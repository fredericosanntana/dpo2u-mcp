#!/usr/bin/env node

/**
 * DPO2U MCP - Evidence Collector System
 * Sistema de coleta de evidências reais do sistema
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const OBSIDIAN_PATH = '/var/lib/docker/volumes/docker-compose_obsidian-vaults/_data/MyVault/04-DPO2U-Compliance';
const CONFIG_PATH = '/opt/dpo2u-mcp/config';
const SEARCH_PATHS = [
  '/opt/dpo2u-mcp',
  '/opt/docker-compose',
  '/var/log',
  OBSIDIAN_PATH
];

export class EvidenceCollector {
  constructor() {
    this.evidenceMap = new Map();
    this.searchCache = new Map();
  }

  /**
   * Busca evidências no sistema de arquivos
   */
  async searchEvidence(keywords, searchPath = null) {
    const paths = searchPath ? [searchPath] : SEARCH_PATHS;
    const results = [];

    for (const basePath of paths) {
      if (!fs.existsSync(basePath)) continue;

      try {
        // Usar grep para buscar keywords
        const grepCommand = `grep -r -l -i "${keywords}" ${basePath} 2>/dev/null || true`;
        const files = execSync(grepCommand, { encoding: 'utf-8' })
          .split('\n')
          .filter(f => f.length > 0);

        for (const file of files) {
          if (fs.existsSync(file)) {
            const stats = fs.statSync(file);
            results.push({
              path: file,
              keywords: keywords,
              size: stats.size,
              modified: stats.mtime,
              type: path.extname(file)
            });
          }
        }
      } catch (error) {
        console.error(`Erro buscando em ${basePath}:`, error.message);
      }
    }

    // Cachear resultados
    this.searchCache.set(keywords, results);
    return results;
  }

  /**
   * Busca evidências no Obsidian
   */
  async searchObsidian(query) {
    const results = [];
    const obsidianFiles = this.getAllFiles(OBSIDIAN_PATH, '.md');

    for (const file of obsidianFiles) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        if (content.toLowerCase().includes(query.toLowerCase())) {
          // Extrair contexto
          const lines = content.split('\n');
          const matchingLines = lines.filter(line =>
            line.toLowerCase().includes(query.toLowerCase())
          );

          results.push({
            file: file,
            path: file.replace(OBSIDIAN_PATH, ''),
            matches: matchingLines.slice(0, 3), // Primeiras 3 linhas que match
            modified: fs.statSync(file).mtime
          });
        }
      } catch (error) {
        console.error(`Erro lendo ${file}:`, error.message);
      }
    }

    return results;
  }

  /**
   * Busca logs relacionados
   */
  async searchLogs(pattern, days = 7) {
    const results = [];
    const logPaths = [
      '/var/log/dpo2u-mcp',
      '/var/log/activity-agent',
      '/var/log/leann-auto-reindex.log'
    ];

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    for (const logPath of logPaths) {
      if (!fs.existsSync(logPath)) continue;

      try {
        const files = fs.statSync(logPath).isDirectory() ?
          fs.readdirSync(logPath).map(f => path.join(logPath, f)) :
          [logPath];

        for (const file of files) {
          const stats = fs.statSync(file);
          if (stats.mtime < cutoffDate) continue;

          try {
            const content = fs.readFileSync(file, 'utf-8');
            if (content.includes(pattern)) {
              const lines = content.split('\n');
              const matching = lines.filter(l => l.includes(pattern));

              results.push({
                log: file,
                pattern: pattern,
                matches: matching.slice(0, 5),
                date: stats.mtime,
                size: stats.size
              });
            }
          } catch (e) {
            // Log pode ser muito grande ou binário
            continue;
          }
        }
      } catch (error) {
        console.error(`Erro processando logs em ${logPath}:`, error.message);
      }
    }

    return results;
  }

  /**
   * Verifica existência de arquivo/política específica
   */
  async checkPolicy(policyName) {
    const commonPolicies = {
      'privacy': ['privacy-policy', 'politica-privacidade', 'Privacy-Policy'],
      'terms': ['terms-of-use', 'termos-uso', 'Terms'],
      'dpo': ['dpo-report', 'relatorio-dpo', 'DPO-Report'],
      'consent': ['consent', 'consentimento', 'Consent'],
      'incident': ['incident', 'incidente', 'breach', 'vazamento']
    };

    const patterns = commonPolicies[policyName.toLowerCase()] || [policyName];
    const found = [];

    for (const pattern of patterns) {
      const results = await this.searchObsidian(pattern);
      found.push(...results);
    }

    return {
      exists: found.length > 0,
      files: found,
      pattern: policyName
    };
  }

  /**
   * Verifica configurações da empresa
   */
  async getCompanyConfig() {
    const configFile = path.join(CONFIG_PATH, 'company.json');

    if (!fs.existsSync(configFile)) {
      return {
        configured: false,
        message: 'Empresa não configurada. Execute companySetup primeiro.'
      };
    }

    try {
      const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
      return {
        configured: true,
        company: config.company,
        compliance_score: config.compliance_score,
        setup_date: config.setup_date
      };
    } catch (error) {
      return {
        configured: false,
        error: error.message
      };
    }
  }

  /**
   * Busca evidências para item do checklist
   */
  async findChecklistEvidence(checklistItemId) {
    const configFile = path.join(CONFIG_PATH, 'company.json');

    if (!fs.existsSync(configFile)) {
      return { found: false, message: 'Configuração não encontrada' };
    }

    const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
    const response = config.checklist_responses[checklistItemId];

    if (!response) {
      return { found: false, message: 'Item do checklist não encontrado' };
    }

    if (response.evidence) {
      // Verificar se a evidência ainda existe
      if (fs.existsSync(response.evidence)) {
        return {
          found: true,
          item: response,
          evidence_path: response.evidence,
          evidence_exists: true
        };
      } else {
        return {
          found: true,
          item: response,
          evidence_path: response.evidence,
          evidence_exists: false,
          message: 'Evidência registrada mas arquivo não encontrado'
        };
      }
    }

    return {
      found: true,
      item: response,
      evidence_path: null,
      message: response.response === 'n' ?
        'Item marcado como não conforme' :
        'Item conforme mas sem evidência registrada'
    };
  }

  /**
   * Coleta métricas do sistema
   */
  async collectSystemMetrics() {
    const metrics = {
      docker_containers: 0,
      services_running: [],
      disk_usage: {},
      recent_audits: [],
      recent_incidents: []
    };

    try {
      // Contar containers Docker
      const containers = execSync('docker ps --format "{{.Names}}"', { encoding: 'utf-8' });
      metrics.docker_containers = containers.split('\n').filter(c => c.length > 0).length;
      metrics.services_running = containers.split('\n').filter(c => c.length > 0);
    } catch (e) {
      metrics.docker_containers = 0;
    }

    try {
      // Disk usage
      const df = execSync('df -h / | tail -1', { encoding: 'utf-8' });
      const parts = df.split(/\s+/);
      metrics.disk_usage = {
        size: parts[1],
        used: parts[2],
        available: parts[3],
        percentage: parts[4]
      };
    } catch (e) {
      // Ignorar erro
    }

    // Buscar auditorias recentes
    const auditPath = path.join(OBSIDIAN_PATH, 'Auditorias');
    if (fs.existsSync(auditPath)) {
      const files = fs.readdirSync(auditPath)
        .filter(f => f.endsWith('.md'))
        .map(f => ({
          file: f,
          path: path.join(auditPath, f),
          date: fs.statSync(path.join(auditPath, f)).mtime
        }))
        .sort((a, b) => b.date - a.date)
        .slice(0, 5);

      metrics.recent_audits = files;
    }

    // Buscar incidentes recentes
    const incidentPath = path.join(OBSIDIAN_PATH, 'Incidentes');
    if (fs.existsSync(incidentPath)) {
      const files = fs.readdirSync(incidentPath)
        .filter(f => f.endsWith('.md'))
        .map(f => ({
          file: f,
          path: path.join(incidentPath, f),
          date: fs.statSync(path.join(incidentPath, f)).mtime
        }))
        .sort((a, b) => b.date - a.date)
        .slice(0, 5);

      metrics.recent_incidents = files;
    }

    return metrics;
  }

  /**
   * Helper: Obter todos os arquivos de um diretório
   */
  getAllFiles(dirPath, extension = null, files = []) {
    if (!fs.existsSync(dirPath)) return files;

    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        this.getAllFiles(fullPath, extension, files);
      } else if (!extension || fullPath.endsWith(extension)) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Buscar usando LEANN se disponível
   */
  async searchWithLEANN(query) {
    try {
      const response = await fetch('http://localhost:3001/search', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer leann_api_2025',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: query,
          index: 'myvault',
          top_k: 5
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          available: true,
          results: data.results || []
        };
      }
    } catch (error) {
      // LEANN não disponível
    }

    return {
      available: false,
      results: []
    };
  }

  /**
   * Gerar relatório de evidências
   */
  generateEvidenceReport(evidences) {
    const report = {
      generated_at: new Date(),
      total_evidences: evidences.length,
      by_type: {},
      by_location: {},
      summary: []
    };

    for (const evidence of evidences) {
      // Por tipo
      const type = evidence.type || 'unknown';
      if (!report.by_type[type]) report.by_type[type] = 0;
      report.by_type[type]++;

      // Por localização
      const location = evidence.path ? path.dirname(evidence.path) : 'unknown';
      if (!report.by_location[location]) report.by_location[location] = 0;
      report.by_location[location]++;

      // Resumo
      report.summary.push({
        path: evidence.path || evidence.file || evidence.log,
        type: type,
        date: evidence.modified || evidence.date || null
      });
    }

    return report;
  }
}

// Export singleton
export default new EvidenceCollector();