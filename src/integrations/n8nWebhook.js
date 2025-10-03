#!/usr/bin/env node

/**
 * DPO2U MCP - n8n Webhook Integration
 * Envia relatórios para webhook do n8n
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { getConfigDirectory } from '../utils/pathResolver.js';

const WEBHOOK_URL = process.env.DPO2U_N8N_WEBHOOK_URL || 'https://www.n8n.dpo2u.com/webhook/mcp-report';
const CONFIG_PATH = getConfigDirectory();
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 segundos

export class N8nWebhookIntegration {
  constructor() {
    this.webhookUrl = WEBHOOK_URL;
    this.logFile = path.join(CONFIG_PATH, 'webhook-logs.json');
    this.logs = [];
    this.loadLogs();
  }

  /**
   * Carrega logs anteriores
   */
  loadLogs() {
    if (fs.existsSync(this.logFile)) {
      try {
        this.logs = JSON.parse(fs.readFileSync(this.logFile, 'utf-8'));
      } catch (error) {
        this.logs = [];
      }
    }
  }

  /**
   * Salva logs
   */
  saveLogs() {
    try {
      if (!fs.existsSync(CONFIG_PATH)) {
        fs.mkdirSync(CONFIG_PATH, { recursive: true });
      }
      fs.writeFileSync(this.logFile, JSON.stringify(this.logs, null, 2));
    } catch (error) {
      console.error('Erro salvando logs:', error);
    }
  }

  /**
   * Envia relatório para o webhook
   */
  async sendReport(reportData, retryCount = 0) {
    const payload = {
      timestamp: new Date().toISOString(),
      report_type: reportData.type || 'generic',
      report_id: reportData.id || `REPORT-${Date.now()}`,
      company: this.getCompanyInfo(),
      data: reportData,
      metadata: {
        source: 'DPO2U MCP',
        version: '1.0.0',
        environment: 'production'
      }
    };

    try {
      console.log(`📤 Enviando relatório para webhook n8n...`);

      const response = await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Source': 'DPO2U-MCP'
        },
        timeout: 30000 // 30 segundos
      });

      // Log sucesso
      this.logSuccess(payload, response.data);

      console.log(`✅ Relatório enviado com sucesso!`);
      return {
        success: true,
        response: response.data,
        status: response.status
      };

    } catch (error) {
      console.error(`❌ Erro enviando relatório (tentativa ${retryCount + 1}):`, error.message);

      // Log erro
      this.logError(payload, error);

      // Retry logic
      if (retryCount < RETRY_ATTEMPTS - 1) {
        console.log(`🔄 Tentando novamente em ${RETRY_DELAY/1000} segundos...`);
        await this.sleep(RETRY_DELAY);
        return this.sendReport(reportData, retryCount + 1);
      }

      return {
        success: false,
        error: error.message,
        attempts: retryCount + 1
      };
    }
  }

  /**
   * Envia relatório de auditoria
   */
  async sendAuditReport(auditData) {
    const report = {
      type: 'audit',
      id: auditData.audit_id || `AUDIT-${Date.now()}`,
      title: 'Relatório de Auditoria LGPD/GDPR',
      score: auditData.compliance_score || 0,
      status: auditData.status || 'unknown',
      findings: {
        critical: auditData.critical_findings || [],
        warnings: auditData.warnings || [],
        conformities: auditData.conformities || []
      },
      evidence_paths: auditData.evidence_paths || [],
      generated_at: new Date().toISOString()
    };

    return this.sendReport(report);
  }

  /**
   * Envia relatório de risco
   */
  async sendRiskReport(riskData) {
    const report = {
      type: 'risk',
      id: riskData.risk_id || `RISK-${Date.now()}`,
      title: 'Avaliação de Riscos',
      risk_score: riskData.overall_score || 0,
      risk_level: riskData.risk_level || 'unknown',
      vulnerabilities: riskData.vulnerabilities || [],
      mitigation_plan: riskData.mitigation_plan || [],
      evidence_paths: riskData.evidence_paths || [],
      generated_at: new Date().toISOString()
    };

    return this.sendReport(report);
  }

  /**
   * Envia relatório DPO
   */
  async sendDPOReport(dpoData) {
    const report = {
      type: 'dpo',
      id: dpoData.report_id || `DPO-${Date.now()}`,
      title: 'Relatório DPO Periódico',
      period: dpoData.period || 'monthly',
      metrics: dpoData.metrics || {},
      compliance_status: dpoData.compliance_status || {},
      incidents: dpoData.incidents || [],
      actions_taken: dpoData.actions_taken || [],
      evidence_paths: dpoData.evidence_paths || [],
      generated_at: new Date().toISOString()
    };

    return this.sendReport(report);
  }

  /**
   * Envia relatório de consentimento
   */
  async sendConsentReport(consentData) {
    const report = {
      type: 'consent',
      id: consentData.consent_id || `CONSENT-${Date.now()}`,
      title: 'Verificação de Consentimentos',
      total_users: consentData.total_users || 0,
      valid_consents: consentData.valid_consents || 0,
      expired_consents: consentData.expired_consents || 0,
      compliance_score: consentData.compliance_score || 0,
      issues: consentData.issues || [],
      evidence_paths: consentData.evidence_paths || [],
      generated_at: new Date().toISOString()
    };

    return this.sendReport(report);
  }

  /**
   * Envia relatório de privacy score
   */
  async sendPrivacyScoreReport(scoreData) {
    const report = {
      type: 'privacy_score',
      id: scoreData.score_id || `SCORE-${Date.now()}`,
      title: 'Privacy Score Assessment',
      overall_score: scoreData.overall_score || 0,
      maturity_level: scoreData.maturity_level || 'unknown',
      dimensions: scoreData.dimensions || [],
      gaps: scoreData.gaps || [],
      recommendations: scoreData.recommendations || [],
      evidence_paths: scoreData.evidence_paths || [],
      generated_at: new Date().toISOString()
    };

    return this.sendReport(report);
  }

  /**
   * Envia notificação de setup inicial
   */
  async sendSetupNotification(setupData) {
    const report = {
      type: 'setup',
      id: setupData.setup_id || `SETUP-${Date.now()}`,
      title: 'Configuração Inicial Completa',
      company: setupData.company || {},
      checklist_score: setupData.compliance_score || 0,
      checklist_responses: setupData.checklist_summary || {},
      evidence_count: setupData.evidence_locations?.length || 0,
      generated_at: new Date().toISOString()
    };

    return this.sendReport(report);
  }

  /**
   * Obtém informações da empresa
   */
  getCompanyInfo() {
    try {
      const configFile = path.join(CONFIG_PATH, 'company.json');
      if (fs.existsSync(configFile)) {
        const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
        return {
          name: config.company?.name || 'Não configurado',
          cnpj: config.company?.cnpj || '',
          email: config.company?.email || ''
        };
      }
    } catch (error) {
      console.error('Erro lendo config da empresa:', error);
    }

    return {
      name: 'Não configurado',
      cnpj: '',
      email: ''
    };
  }

  /**
   * Log de sucesso
   */
  logSuccess(payload, response) {
    const log = {
      timestamp: new Date().toISOString(),
      status: 'success',
      type: payload.report_type,
      id: payload.report_id,
      response: response
    };

    this.logs.push(log);

    // Manter apenas últimos 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }

    this.saveLogs();
  }

  /**
   * Log de erro
   */
  logError(payload, error) {
    const log = {
      timestamp: new Date().toISOString(),
      status: 'error',
      type: payload.report_type,
      id: payload.report_id,
      error: error.message,
      code: error.code || 'UNKNOWN'
    };

    this.logs.push(log);

    // Manter apenas últimos 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }

    this.saveLogs();
  }

  /**
   * Obter estatísticas dos envios
   */
  getStats() {
    const stats = {
      total: this.logs.length,
      success: 0,
      error: 0,
      by_type: {},
      last_success: null,
      last_error: null
    };

    for (const log of this.logs) {
      if (log.status === 'success') {
        stats.success++;
        if (!stats.last_success || log.timestamp > stats.last_success) {
          stats.last_success = log.timestamp;
        }
      } else {
        stats.error++;
        if (!stats.last_error || log.timestamp > stats.last_error) {
          stats.last_error = log.timestamp;
        }
      }

      if (!stats.by_type[log.type]) {
        stats.by_type[log.type] = { success: 0, error: 0 };
      }

      if (log.status === 'success') {
        stats.by_type[log.type].success++;
      } else {
        stats.by_type[log.type].error++;
      }
    }

    stats.success_rate = stats.total > 0 ?
      Math.round((stats.success / stats.total) * 100) : 0;

    return stats;
  }

  /**
   * Helper: Sleep
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Testa conexão com webhook
   */
  async testConnection() {
    console.log(`🔌 Testando conexão com webhook n8n...`);

    const testPayload = {
      type: 'test',
      id: `TEST-${Date.now()}`,
      title: 'Teste de Conexão',
      message: 'Teste de conectividade DPO2U MCP',
      timestamp: new Date().toISOString()
    };

    const result = await this.sendReport(testPayload);

    if (result.success) {
      console.log(`✅ Conexão com webhook funcionando!`);
    } else {
      console.log(`❌ Falha na conexão com webhook`);
    }

    return result;
  }
}

// Export singleton
export default new N8nWebhookIntegration();
