#!/usr/bin/env node

/**
 * DPO2U MCP - Sistema Principal v2.0
 * Sistema de compliance LGPD/GDPR com evidências reais
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import { runCompanySetup } from './src/initialization/companySetup.js';
import evidenceCollector from './src/initialization/evidenceCollector.js';
import n8nWebhook from './src/integrations/n8nWebhook.js';

const CONFIG_PATH = '/opt/dpo2u-mcp/config';
const OBSIDIAN_PATH = '/var/lib/docker/volumes/docker-compose_obsidian-vaults/_data/MyVault/04-DPO2U-Compliance';

// Interface readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Verificar se empresa está configurada
async function checkCompanySetup() {
  const config = await evidenceCollector.getCompanyConfig();

  if (!config.configured) {
    console.log('\n⚠️  Empresa não configurada. Iniciando setup...\n');
    const setupData = await runCompanySetup();

    // Enviar notificação para n8n
    await n8nWebhook.sendSetupNotification(setupData);

    return setupData;
  }

  return config;
}

// Menu principal
async function showMainMenu() {
  console.log('\n📊 DPO2U MCP - Sistema de Compliance v2.0');
  console.log('==========================================\n');

  const config = await checkCompanySetup();

  console.log(`Empresa: ${config.company?.name || 'Não configurado'}`);
  console.log(`Score LGPD: ${config.compliance_score || 0}%\n`);

  console.log('Escolha uma opção:\n');
  console.log('1. 📋 Executar Auditoria de Compliance');
  console.log('2. 🔍 Avaliar Riscos');
  console.log('3. 📊 Calcular Privacy Score');
  console.log('4. 🗺️  Mapear Fluxo de Dados');
  console.log('5. 📄 Gerar Relatório DPO');
  console.log('6. ✅ Verificar Consentimentos');
  console.log('7. 🔎 Buscar Evidências');
  console.log('8. 📤 Testar Webhook n8n');
  console.log('9. 🏢 Reconfigurar Empresa');
  console.log('0. Sair\n');

  const choice = await question('Opção: ');
  return choice;
}

// 1. Executar Auditoria
async function runAudit() {
  console.log('\n🔍 Executando Auditoria de Compliance...\n');

  const config = await evidenceCollector.getCompanyConfig();
  if (!config.configured) {
    console.log('❌ Empresa não configurada');
    return;
  }

  // Coletar métricas reais
  const metrics = await evidenceCollector.collectSystemMetrics();

  // Buscar políticas
  const privacyPolicy = await evidenceCollector.checkPolicy('privacy');
  const termsOfUse = await evidenceCollector.checkPolicy('terms');
  const dpoReport = await evidenceCollector.checkPolicy('dpo');

  // Analisar checklist
  let conformeCount = 0;
  let totalItems = 0;
  const issues = [];
  const conformities = [];

  if (config.company && fs.existsSync(path.join(CONFIG_PATH, 'company.json'))) {
    const fullConfig = JSON.parse(fs.readFileSync(path.join(CONFIG_PATH, 'company.json'), 'utf-8'));

    for (const [id, response] of Object.entries(fullConfig.checklist_responses || {})) {
      totalItems++;
      if (response.response === 's') {
        conformeCount++;
        if (response.evidence) {
          conformities.push({
            item: response.question,
            evidence: response.evidence
          });
        }
      } else if (response.response === 'n') {
        issues.push({
          item: response.question,
          category: response.category,
          legal_ref: response.legal_ref
        });
      }
    }
  }

  const auditResult = {
    audit_id: `AUDIT-${Date.now()}`,
    date: new Date(),
    company: config.company,
    compliance_score: totalItems > 0 ? Math.round((conformeCount / totalItems) * 100) : 0,
    status: conformeCount / totalItems > 0.8 ? 'CONFORME' :
            conformeCount / totalItems > 0.6 ? 'PARCIALMENTE CONFORME' : 'NÃO CONFORME',
    metrics: metrics,
    policies: {
      privacy_policy: privacyPolicy.exists,
      terms_of_use: termsOfUse.exists,
      dpo_reports: dpoReport.exists
    },
    conformities: conformities,
    issues: issues,
    evidence_paths: [
      ...privacyPolicy.files.map(f => f.path),
      ...termsOfUse.files.map(f => f.path),
      ...dpoReport.files.map(f => f.path)
    ]
  };

  // Salvar no Obsidian
  const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
  const auditPath = path.join(OBSIDIAN_PATH, 'Auditorias', `Audit-Real-${timestamp}.md`);

  const mdContent = `---
tags: [auditoria, lgpd, compliance, real-data]
created: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
type: audit-report
score: ${auditResult.compliance_score}
status: ${auditResult.status}
---

# 📊 Relatório de Auditoria - Dados Reais

## Informações da Empresa
- **Nome**: ${config.company?.name}
- **CNPJ**: ${config.company?.cnpj}
- **Score**: ${auditResult.compliance_score}%
- **Status**: ${auditResult.status}

## Métricas do Sistema
- **Containers Docker**: ${metrics.docker_containers}
- **Serviços Rodando**: ${metrics.services_running.length}
- **Uso de Disco**: ${metrics.disk_usage.percentage || 'N/A'}

## Políticas Encontradas
- Política de Privacidade: ${privacyPolicy.exists ? '✅' : '❌'}
- Termos de Uso: ${termsOfUse.exists ? '✅' : '❌'}
- Relatórios DPO: ${dpoReport.exists ? '✅' : '❌'}

## Conformidades (${conformities.length})
${conformities.slice(0, 10).map(c => `- ✅ ${c.item}`).join('\n')}

## Não Conformidades (${issues.length})
${issues.slice(0, 10).map(i => `- ❌ ${i.item}`).join('\n')}

## Evidências Encontradas
${auditResult.evidence_paths.slice(0, 10).map(p => `- ${p}`).join('\n')}

---
*Auditoria com dados reais - ${format(new Date(), 'dd/MM/yyyy HH:mm')}*`;

  // Criar diretório se não existir
  const auditDir = path.dirname(auditPath);
  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  fs.writeFileSync(auditPath, mdContent);

  // Enviar para webhook
  await n8nWebhook.sendAuditReport(auditResult);

  console.log(`\n✅ Auditoria concluída!`);
  console.log(`📊 Score: ${auditResult.compliance_score}%`);
  console.log(`📄 Relatório salvo em: ${auditPath}`);
  console.log(`📤 Enviado para webhook n8n`);
}

// 7. Buscar Evidências
async function searchEvidence() {
  console.log('\n🔎 Buscar Evidências\n');

  const keyword = await question('Digite o termo de busca: ');

  console.log('\nBuscando...\n');

  // Buscar em arquivos
  const fileResults = await evidenceCollector.searchEvidence(keyword);
  console.log(`📁 Arquivos encontrados: ${fileResults.length}`);
  fileResults.slice(0, 5).forEach(r => {
    console.log(`  - ${r.path}`);
  });

  // Buscar no Obsidian
  const obsidianResults = await evidenceCollector.searchObsidian(keyword);
  console.log(`\n📝 Documentos no Obsidian: ${obsidianResults.length}`);
  obsidianResults.slice(0, 5).forEach(r => {
    console.log(`  - ${r.path}`);
  });

  // Buscar em logs
  const logResults = await evidenceCollector.searchLogs(keyword);
  console.log(`\n📜 Logs encontrados: ${logResults.length}`);
  logResults.slice(0, 5).forEach(r => {
    console.log(`  - ${r.log}`);
  });

  // Buscar com LEANN se disponível
  const leannResults = await evidenceCollector.searchWithLEANN(keyword);
  if (leannResults.available) {
    console.log(`\n🧠 LEANN (busca semântica): ${leannResults.results.length} resultados`);
  }

  const totalResults = fileResults.length + obsidianResults.length + logResults.length;
  console.log(`\n📊 Total de evidências encontradas: ${totalResults}`);

  if (totalResults === 0) {
    console.log('⚠️  Nenhuma evidência encontrada para o termo pesquisado');
  }
}

// 8. Testar Webhook
async function testWebhook() {
  console.log('\n🔌 Testando conexão com webhook n8n...\n');

  const result = await n8nWebhook.testConnection();

  if (result.success) {
    console.log('✅ Webhook funcionando corretamente!');

    // Mostrar estatísticas
    const stats = n8nWebhook.getStats();
    console.log(`\n📊 Estatísticas de envio:`);
    console.log(`  Total: ${stats.total}`);
    console.log(`  Sucesso: ${stats.success} (${stats.success_rate}%)`);
    console.log(`  Erros: ${stats.error}`);
  } else {
    console.log('❌ Falha no teste do webhook');
    console.log(`Erro: ${result.error}`);
  }
}

// Executar menu principal
async function main() {
  console.log('\n🚀 Iniciando DPO2U MCP v2.0...');
  console.log('Sistema de Compliance com Dados Reais\n');

  let running = true;

  while (running) {
    const choice = await showMainMenu();

    switch (choice) {
      case '1':
        await runAudit();
        break;

      case '2':
        console.log('\n⚠️  Avaliação de Riscos');
        console.log('Buscando vulnerabilidades reais...');
        // Implementar busca de riscos reais
        console.log('Função em desenvolvimento');
        break;

      case '3':
        console.log('\n📊 Calcular Privacy Score');
        console.log('Analisando maturidade real...');
        // Implementar cálculo baseado em evidências
        console.log('Função em desenvolvimento');
        break;

      case '4':
        console.log('\n🗺️ Mapear Fluxo de Dados');
        console.log('Mapeando fluxos reais...');
        // Implementar mapeamento real
        console.log('Função em desenvolvimento');
        break;

      case '5':
        console.log('\n📄 Gerar Relatório DPO');
        console.log('Compilando dados reais...');
        // Implementar relatório com dados reais
        console.log('Função em desenvolvimento');
        break;

      case '6':
        console.log('\n✅ Verificar Consentimentos');
        console.log('Verificando consentimentos reais...');
        // Implementar verificação real
        console.log('Função em desenvolvimento');
        break;

      case '7':
        await searchEvidence();
        break;

      case '8':
        await testWebhook();
        break;

      case '9':
        console.log('\n🏢 Reconfigurando empresa...');
        await runCompanySetup();
        break;

      case '0':
        running = false;
        console.log('\n👋 Encerrando DPO2U MCP...');
        break;

      default:
        console.log('\n❌ Opção inválida');
    }

    if (running && choice !== '0') {
      await question('\nPressione Enter para continuar...');
    }
  }

  rl.close();
}

// Tratamento de erros
process.on('uncaughtException', (error) => {
  console.error('\n❌ Erro não tratado:', error);
  process.exit(1);
});

// Executar
main().catch(console.error);