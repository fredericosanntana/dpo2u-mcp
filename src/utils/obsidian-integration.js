#!/usr/bin/env node

/**
 * DPO2U MCP - Obsidian Integration Module
 * Salva todos os relatórios e auditorias diretamente no Obsidian vault
 */

import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

const OBSIDIAN_VAULT_PATH = '/var/lib/docker/volumes/docker-compose_obsidian-vaults/_data/MyVault/04-DPO2U-Compliance';

export class ObsidianIntegration {
  constructor() {
    this.vaultPath = OBSIDIAN_VAULT_PATH;
    this.ensureDirectories();
  }

  /**
   * Garante que todos os diretórios necessários existam
   */
  ensureDirectories() {
    const dirs = [
      'Auditorias',
      'Relatorios',
      'Politicas',
      'Incidentes',
      'Consentimentos',
      'Contratos',
      'Templates',
      'Dashboard'
    ];

    dirs.forEach(dir => {
      const fullPath = path.join(this.vaultPath, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });
  }

  /**
   * Salva resultado de auditoria no Obsidian
   */
  saveAuditReport(auditData) {
    const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
    const filename = `Audit-${timestamp}.md`;
    const filepath = path.join(this.vaultPath, 'Auditorias', filename);

    const content = `---
tags: [auditoria, lgpd, gdpr, compliance]
created: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
type: audit-report
score: ${auditData.score || 0}
status: ${auditData.status || 'PENDENTE'}
ultima_auditoria: ${format(new Date(), 'yyyy-MM-dd')}
---

# Relatório de Auditoria LGPD/GDPR

## 📊 Resumo Executivo

- **Data**: ${format(new Date(), 'dd/MM/yyyy HH:mm')}
- **Sistema**: ${auditData.system_name || 'DPO2U Infrastructure'}
- **Score de Compliance**: ${auditData.score || 0}/100
- **Status**: ${auditData.status || 'PENDENTE'}
- **Issues Críticos**: ${auditData.critical_issues || 0}

## ✅ Pontos Positivos

${(auditData.positive_findings || []).map(item => `- ${item}`).join('\n')}

## ❌ Issues Críticos

${(auditData.critical_findings || []).map(item => `- ${item}`).join('\n')}

## ⚠️ Avisos

${(auditData.warnings || []).map(item => `- ${item}`).join('\n')}

## 📋 Recomendações

${(auditData.recommendations || []).map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

## 🎯 Plano de Ação

### Imediato (7 dias)
${(auditData.immediate_actions || []).map(item => `- [ ] ${item}`).join('\n')}

### Curto Prazo (30 dias)
${(auditData.short_term_actions || []).map(item => `- [ ] ${item}`).join('\n')}

### Longo Prazo (90 dias)
${(auditData.long_term_actions || []).map(item => `- [ ] ${item}`).join('\n')}

## 📈 Métricas Detalhadas

\`\`\`json
${JSON.stringify(auditData.metrics || {}, null, 2)}
\`\`\`

## 🔗 Links Relacionados

- [[00-DPO2U-Hub|Voltar ao Hub]]
- [[${this.getLastAuditLink()}|Auditoria Anterior]]
- [[compliance-roadmap|Roadmap de Compliance]]

---
*Gerado automaticamente por DPO2U MCP v1.0*
`;

    fs.writeFileSync(filepath, content);
    console.log(`✅ Auditoria salva em: ${filepath}`);
    return filepath;
  }

  /**
   * Salva relatório DPO no Obsidian
   */
  saveDPOReport(reportData) {
    const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
    const period = reportData.period || 'mensal';
    const filename = `DPO-Report-${period}-${timestamp}.md`;
    const filepath = path.join(this.vaultPath, 'Relatorios', filename);

    const content = `---
tags: [dpo-report, relatorio, lgpd, gdpr]
created: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
type: dpo-report
period: ${period}
---

# Relatório DPO - ${reportData.period || 'Período'}

## 📅 Informações do Período

- **Período**: ${reportData.period || 'Não especificado'}
- **Data de Geração**: ${format(new Date(), 'dd/MM/yyyy HH:mm')}
- **Responsável**: ${reportData.responsible || 'DPO'}
- **Status Geral**: ${reportData.overall_status || 'Em análise'}

## 📊 KPIs de Privacidade

### Score de Compliance
- **Score Atual**: ${reportData.current_score || 0}/100
- **Score Anterior**: ${reportData.previous_score || 0}/100
- **Variação**: ${reportData.score_variation || 0}%

### Incidentes
- **Total no Período**: ${reportData.incidents_count || 0}
- **Resolvidos**: ${reportData.incidents_resolved || 0}
- **Pendentes**: ${reportData.incidents_pending || 0}
- **Tempo Médio Resolução**: ${reportData.avg_resolution_time || 'N/A'}

### Consentimentos
- **Total Válidos**: ${reportData.valid_consents || 0}
- **Expirados**: ${reportData.expired_consents || 0}
- **Renovados**: ${reportData.renewed_consents || 0}
- **Taxa de Renovação**: ${reportData.renewal_rate || 0}%

## 📋 Atividades Realizadas

${(reportData.activities || []).map(item => `- ${item}`).join('\n')}

## 🎯 Metas Alcançadas

${(reportData.achieved_goals || []).map(item => `- ✅ ${item}`).join('\n')}

## 🚧 Metas Pendentes

${(reportData.pending_goals || []).map(item => `- ⏳ ${item}`).join('\n')}

## 📈 Análise de Tendências

${reportData.trend_analysis || 'Análise de tendências não disponível'}

## 🔍 Principais Riscos Identificados

${(reportData.identified_risks || []).map(item => `- ${item}`).join('\n')}

## 📝 Recomendações para o Próximo Período

${(reportData.next_period_recommendations || []).map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

## 📊 Dashboard Visual

\`\`\`mermaid
pie title Distribuição de Issues
    "Resolvidos" : ${reportData.issues_resolved || 0}
    "Em Progresso" : ${reportData.issues_in_progress || 0}
    "Pendentes" : ${reportData.issues_pending || 0}
\`\`\`

## 🔗 Anexos e Referências

- [[00-DPO2U-Hub|Hub Principal]]
- [[Auditorias/|Auditorias do Período]]
- [[Incidentes/|Registro de Incidentes]]

---
*Relatório gerado automaticamente por DPO2U MCP*
`;

    fs.writeFileSync(filepath, content);
    console.log(`✅ Relatório DPO salvo em: ${filepath}`);
    return filepath;
  }

  /**
   * Salva política de privacidade no Obsidian
   */
  savePrivacyPolicy(policyData) {
    const timestamp = format(new Date(), 'yyyy-MM-dd');
    const filename = `Privacy-Policy-${policyData.company_name || 'Company'}-${timestamp}.md`;
    const filepath = path.join(this.vaultPath, 'Politicas', filename);

    const content = `---
tags: [privacy-policy, politica-privacidade, lgpd, gdpr]
created: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
type: privacy-policy
status: active
company: ${policyData.company_name || 'Company'}
version: ${policyData.version || '1.0'}
---

# Política de Privacidade - ${policyData.company_name || 'Company'}

## 📋 Informações do Documento

- **Empresa**: ${policyData.company_name || 'Company'}
- **Versão**: ${policyData.version || '1.0'}
- **Data de Criação**: ${format(new Date(), 'dd/MM/yyyy')}
- **Válida até**: ${policyData.valid_until || 'Indeterminado'}
- **Status**: Ativa

## 📄 Conteúdo da Política

${policyData.content || 'Conteúdo da política de privacidade'}

## 🔗 Links Relacionados

- [[00-DPO2U-Hub|Hub de Compliance]]
- [[Politicas/|Outras Políticas]]

---
*Documento gerado por DPO2U MCP*
`;

    fs.writeFileSync(filepath, content);
    console.log(`✅ Política salva em: ${filepath}`);
    return filepath;
  }

  /**
   * Salva registro de incidente no Obsidian
   */
  saveIncidentReport(incidentData) {
    const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
    const filename = `Incident-${incidentData.type || 'breach'}-${timestamp}.md`;
    const filepath = path.join(this.vaultPath, 'Incidentes', filename);

    const content = `---
tags: [incidente, breach, lgpd, gdpr]
created: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
type: incident
status: ${incidentData.status || 'open'}
severity: ${incidentData.severity || 'medium'}
affected_records: ${incidentData.affected_records || 0}
---

# Registro de Incidente - ${incidentData.type || 'Breach'}

## 🚨 Informações do Incidente

- **Tipo**: ${incidentData.type || 'Não especificado'}
- **Data/Hora**: ${format(new Date(), 'dd/MM/yyyy HH:mm')}
- **Severidade**: ${incidentData.severity || 'Medium'}
- **Status**: ${incidentData.status || 'Open'}
- **Registros Afetados**: ${incidentData.affected_records || 0}

## 📝 Descrição

${incidentData.description || 'Descrição do incidente'}

## 🎯 Ações Tomadas

${(incidentData.actions_taken || []).map(item => `- ${item}`).join('\n')}

## 📋 Plano de Resposta

${incidentData.response_plan || 'Plano de resposta a ser definido'}

## 🔗 Links Relacionados

- [[00-DPO2U-Hub|Hub de Compliance]]
- [[Incidentes/|Outros Incidentes]]

---
*Registro criado por DPO2U MCP*
`;

    fs.writeFileSync(filepath, content);
    console.log(`✅ Incidente salvo em: ${filepath}`);
    return filepath;
  }

  /**
   * Obtém link para última auditoria
   */
  getLastAuditLink() {
    const auditDir = path.join(this.vaultPath, 'Auditorias');
    if (!fs.existsSync(auditDir)) return 'primeira-auditoria';

    const files = fs.readdirSync(auditDir)
      .filter(f => f.startsWith('Audit-'))
      .sort()
      .reverse();

    return files.length > 1 ? `Auditorias/${files[1].replace('.md', '')}` : 'primeira-auditoria';
  }

  /**
   * Cria dashboard resumido
   */
  updateDashboard(data) {
    const dashboardPath = path.join(this.vaultPath, 'Dashboard', 'current-status.md');

    const content = `---
tags: [dashboard, status, metrics]
updated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
---

# Dashboard de Compliance - Status Atual

## 📊 Métricas em Tempo Real

- **Última Atualização**: ${format(new Date(), 'dd/MM/yyyy HH:mm')}
- **Privacy Score**: ${data.privacy_score || 0}/100
- **Conformidade LGPD**: ${data.lgpd_compliance || 'Parcial'}
- **Conformidade GDPR**: ${data.gdpr_compliance || 'Parcial'}

## 📈 Indicadores

\`\`\`json
${JSON.stringify(data.metrics || {}, null, 2)}
\`\`\`

---
*Dashboard atualizado automaticamente*
`;

    fs.writeFileSync(dashboardPath, content);
    return dashboardPath;
  }
}

// Export singleton instance
export default new ObsidianIntegration();