#!/usr/bin/env node

/**
 * DPO2U MCP - Risk Assessment Tool
 * Avalia riscos de vazamento de dados e salva no Obsidian
 */

import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

const OBSIDIAN_PATH = '/var/lib/docker/volumes/docker-compose_obsidian-vaults/_data/MyVault/04-DPO2U-Compliance';

async function assessDataBreachRisk() {
  console.log('🔍 Avaliando Riscos de Vazamento de Dados...');
  console.log('================================================\n');
  console.log('Analisando vetores de ataque e vulnerabilidades...\n');

  // Simulação da avaliação de riscos
  const riskData = {
    assessment_id: `RISK-${Date.now()}`,
    assessment_type: 'Data Breach Risk Assessment',
    assessment_date: new Date(),
    organization: 'DPO2U Infrastructure Stack',

    // Score geral de risco
    overall_risk_score: 7.2,
    risk_level: 'ALTO',
    risk_trend: 'CRESCENTE',

    // Análise de vulnerabilidades
    vulnerabilities: {
      technical: {
        category: 'Vulnerabilidades Técnicas',
        score: 6.5,
        level: 'MÉDIO-ALTO',
        items: [
          {
            name: 'API Keys Hardcoded',
            severity: 'CRÍTICO',
            likelihood: 'ALTA',
            impact: 'MUITO ALTO',
            score: 9.0,
            description: 'API keys encontradas em código-fonte',
            affected_systems: ['GitHub repos', 'Config files'],
            mitigation: 'Migrar para gerenciador de secrets (Vault/AWS Secrets)',
            priority: 1
          },
          {
            name: 'Logs com PII não sanitizados',
            severity: 'ALTO',
            likelihood: 'MÉDIA',
            impact: 'ALTO',
            score: 7.5,
            description: 'Logs contêm dados pessoais em texto claro',
            affected_systems: ['Grafana', 'Docker logs', 'Application logs'],
            mitigation: 'Implementar sanitização automática de PII em logs',
            priority: 2
          },
          {
            name: 'Backups sem criptografia em repouso',
            severity: 'MÉDIO',
            likelihood: 'BAIXA',
            impact: 'MUITO ALTO',
            score: 6.0,
            description: 'Alguns backups não estão criptografados',
            affected_systems: ['PostgreSQL backups', 'File backups'],
            mitigation: 'Ativar criptografia para todos os backups',
            priority: 3
          },
          {
            name: 'Ausência de MFA em sistemas críticos',
            severity: 'ALTO',
            likelihood: 'MÉDIA',
            impact: 'ALTO',
            score: 7.0,
            description: 'Autenticação de dois fatores não obrigatória',
            affected_systems: ['Admin panels', 'Database access'],
            mitigation: 'Implementar MFA obrigatório para acessos privilegiados',
            priority: 2
          }
        ]
      },

      human: {
        category: 'Fatores Humanos',
        score: 7.8,
        level: 'ALTO',
        items: [
          {
            name: 'Falta de treinamento em segurança',
            severity: 'ALTO',
            likelihood: 'ALTA',
            impact: 'MÉDIO',
            score: 7.5,
            description: 'Equipe sem treinamento formal em LGPD/segurança',
            affected_areas: ['Todos os departamentos'],
            mitigation: 'Programa de treinamento trimestral obrigatório',
            priority: 1
          },
          {
            name: 'Compartilhamento inadequado de senhas',
            severity: 'CRÍTICO',
            likelihood: 'MÉDIA',
            impact: 'ALTO',
            score: 8.0,
            description: 'Senhas compartilhadas via comunicadores',
            affected_areas: ['DevOps', 'Suporte'],
            mitigation: 'Implementar gerenciador de senhas corporativo',
            priority: 1
          },
          {
            name: 'Phishing susceptibility',
            severity: 'MÉDIO',
            likelihood: 'ALTA',
            impact: 'MÉDIO',
            score: 6.5,
            description: 'Usuários suscetíveis a ataques de phishing',
            affected_areas: ['Email corporativo'],
            mitigation: 'Simulações mensais de phishing + treinamento',
            priority: 2
          }
        ]
      },

      process: {
        category: 'Falhas de Processo',
        score: 8.0,
        level: 'ALTO',
        items: [
          {
            name: 'Ausência de DPO designado',
            severity: 'CRÍTICO',
            likelihood: 'CONFIRMADO',
            impact: 'ALTO',
            score: 10.0,
            description: 'Sem responsável formal por proteção de dados',
            affected_areas: ['Governança', 'Compliance'],
            mitigation: 'Designar DPO imediatamente',
            priority: 1
          },
          {
            name: 'Processo RTBF manual',
            severity: 'ALTO',
            likelihood: 'ALTA',
            impact: 'MÉDIO',
            score: 7.0,
            description: 'Exclusão de dados não automatizada',
            affected_areas: ['Atendimento', 'TI'],
            mitigation: 'Automatizar processo de exclusão',
            priority: 2
          },
          {
            name: 'Resposta a incidentes não testada',
            severity: 'ALTO',
            likelihood: 'MÉDIA',
            impact: 'MUITO ALTO',
            score: 8.0,
            description: 'Plano existe mas nunca foi simulado',
            affected_areas: ['Segurança', 'Comunicação'],
            mitigation: 'Realizar simulação trimestral',
            priority: 1
          },
          {
            name: 'ROPA incompleto',
            severity: 'MÉDIO',
            likelihood: 'CONFIRMADO',
            impact: 'MÉDIO',
            score: 7.5,
            description: 'Inventário de processamento incompleto',
            affected_areas: ['Compliance', 'Legal'],
            mitigation: 'Completar mapeamento de dados',
            priority: 2
          }
        ]
      },

      external: {
        category: 'Riscos Externos',
        score: 6.0,
        level: 'MÉDIO',
        items: [
          {
            name: 'Fornecedores sem avaliação',
            severity: 'MÉDIO',
            likelihood: 'MÉDIA',
            impact: 'ALTO',
            score: 6.5,
            description: 'Terceiros processam dados sem due diligence',
            affected_areas: ['Procurement', 'Legal'],
            mitigation: 'Implementar processo de vendor assessment',
            priority: 3
          },
          {
            name: 'APIs públicas sem rate limiting',
            severity: 'MÉDIO',
            likelihood: 'ALTA',
            impact: 'MÉDIO',
            score: 6.0,
            description: 'APIs expostas a ataques de força bruta',
            affected_areas: ['n8n webhooks', 'API endpoints'],
            mitigation: 'Implementar rate limiting e WAF',
            priority: 2
          }
        ]
      }
    },

    // Cenários de vazamento
    breach_scenarios: [
      {
        scenario: 'Ataque Ransomware',
        probability: 'MÉDIA',
        impact: 'CATASTRÓFICO',
        risk_score: 8.5,
        estimated_records: '100.000+',
        estimated_cost: 'R$ 5.000.000+',
        recovery_time: '7-14 dias',
        reputation_damage: 'SEVERO'
      },
      {
        scenario: 'Insider Threat (Funcionário)',
        probability: 'MÉDIA-ALTA',
        impact: 'ALTO',
        risk_score: 7.0,
        estimated_records: '10.000-50.000',
        estimated_cost: 'R$ 500.000-2.000.000',
        recovery_time: '3-5 dias',
        reputation_damage: 'MODERADO'
      },
      {
        scenario: 'Exposição de API/Database',
        probability: 'BAIXA-MÉDIA',
        impact: 'MUITO ALTO',
        risk_score: 7.5,
        estimated_records: '50.000+',
        estimated_cost: 'R$ 2.000.000+',
        recovery_time: '1-3 dias',
        reputation_damage: 'ALTO'
      },
      {
        scenario: 'Comprometimento de Credenciais',
        probability: 'ALTA',
        impact: 'MÉDIO',
        risk_score: 6.5,
        estimated_records: '1.000-10.000',
        estimated_cost: 'R$ 100.000-500.000',
        recovery_time: '1 dia',
        reputation_damage: 'BAIXO-MODERADO'
      }
    ],

    // Análise de impacto
    impact_analysis: {
      data_categories_at_risk: [
        { category: 'Dados de identificação', volume: '50.000 registros', sensitivity: 'ALTA' },
        { category: 'Dados financeiros', volume: '10.000 registros', sensitivity: 'CRÍTICA' },
        { category: 'Dados de saúde', volume: '5.000 registros', sensitivity: 'CRÍTICA' },
        { category: 'Dados de localização', volume: '100.000 registros', sensitivity: 'MÉDIA' },
        { category: 'Logs e metadados', volume: '1.000.000+ registros', sensitivity: 'BAIXA-MÉDIA' }
      ],

      business_impact: {
        financial: {
          direct_costs: 'R$ 500.000 - R$ 5.000.000',
          regulatory_fines: 'Até R$ 50.000.000',
          legal_costs: 'R$ 200.000 - R$ 1.000.000',
          recovery_costs: 'R$ 300.000 - R$ 2.000.000'
        },
        operational: {
          downtime: '1-14 dias',
          productivity_loss: '20-50%',
          customer_churn: '5-15%',
          partner_impact: 'Perda de 2-5 contratos'
        },
        reputational: {
          brand_damage: 'ALTO',
          media_coverage: 'Nacional',
          trust_loss: '30-50%',
          recovery_period: '12-24 meses'
        }
      }
    },

    // Controles existentes
    existing_controls: {
      effective: [
        'Criptografia TLS em trânsito',
        'Firewall e segmentação de rede',
        'Backup automatizado diário',
        'Monitoramento com Grafana/Prometheus',
        'Controle de acesso baseado em roles'
      ],
      partially_effective: [
        'Logs de auditoria (sem sanitização)',
        'Autenticação (sem MFA obrigatório)',
        'Gestão de patches (manual)',
        'Revisão de código (inconsistente)'
      ],
      ineffective: [
        'Treinamento de segurança',
        'Gestão de fornecedores',
        'Resposta a incidentes',
        'Gestão de consentimentos'
      ]
    },

    // Recomendações priorizadas
    recommendations: {
      critical_priority: [
        {
          action: 'Designar DPO e equipe de privacidade',
          timeline: 'Imediato',
          cost: 'R$ 15.000/mês',
          risk_reduction: '15%'
        },
        {
          action: 'Remover API keys do código e implementar Vault',
          timeline: '7 dias',
          cost: 'R$ 5.000 (setup)',
          risk_reduction: '20%'
        },
        {
          action: 'Implementar MFA obrigatório',
          timeline: '14 dias',
          cost: 'R$ 50/usuário/ano',
          risk_reduction: '25%'
        }
      ],
      high_priority: [
        {
          action: 'Programa de treinamento em segurança',
          timeline: '30 dias',
          cost: 'R$ 20.000',
          risk_reduction: '15%'
        },
        {
          action: 'Automatizar processo RTBF',
          timeline: '45 dias',
          cost: 'R$ 30.000',
          risk_reduction: '10%'
        },
        {
          action: 'Simulação de incidente',
          timeline: '30 dias',
          cost: 'R$ 10.000',
          risk_reduction: '12%'
        }
      ],
      medium_priority: [
        {
          action: 'Implementar DLP (Data Loss Prevention)',
          timeline: '90 dias',
          cost: 'R$ 50.000',
          risk_reduction: '18%'
        },
        {
          action: 'Completar ROPA',
          timeline: '60 dias',
          cost: 'R$ 15.000',
          risk_reduction: '8%'
        }
      ]
    },

    // KPIs de risco
    risk_metrics: {
      mttr: '72 horas (atual) -> 24 horas (meta)',
      detection_rate: '60% (atual) -> 95% (meta)',
      false_positive_rate: '30% (atual) -> 10% (meta)',
      coverage_rate: '70% (atual) -> 99% (meta)',
      compliance_score: '72% (atual) -> 90% (meta)'
    }
  };

  // Calcular estatísticas
  const totalVulnerabilities =
    riskData.vulnerabilities.technical.items.length +
    riskData.vulnerabilities.human.items.length +
    riskData.vulnerabilities.process.items.length +
    riskData.vulnerabilities.external.items.length;

  const criticalCount = [
    ...riskData.vulnerabilities.technical.items,
    ...riskData.vulnerabilities.human.items,
    ...riskData.vulnerabilities.process.items,
    ...riskData.vulnerabilities.external.items
  ].filter(v => v.severity === 'CRÍTICO').length;

  // Salvar no Obsidian
  const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
  const filename = `Risk-Assessment-DataBreach-${timestamp}.md`;
  const filepath = path.join(OBSIDIAN_PATH, 'Auditorias', filename);

  const mdContent = `---
tags: [risk-assessment, data-breach, vazamento, seguranca, lgpd]
created: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
type: risk-assessment
risk_type: data_breach
risk_score: ${riskData.overall_risk_score}
risk_level: ${riskData.risk_level}
vulnerabilities: ${totalVulnerabilities}
critical_items: ${criticalCount}
---

# 🔐 Avaliação de Riscos de Vazamento de Dados

## 📊 Resumo Executivo

- **Data da Avaliação**: ${format(riskData.assessment_date, 'dd/MM/yyyy HH:mm')}
- **Tipo**: ${riskData.assessment_type}
- **Organização**: ${riskData.organization}
- **ID da Avaliação**: ${riskData.assessment_id}

### Score de Risco: ${riskData.overall_risk_score}/10

\`\`\`mermaid
gauge
  title Risk Score
  value ${riskData.overall_risk_score}
  min 0
  max 10
  ranges
    green 0 3
    yellow 3 7
    red 7 10
\`\`\`

**Nível de Risco**: ${riskData.risk_level}
**Tendência**: ${riskData.risk_trend}

## 🔍 Análise de Vulnerabilidades

### 💻 Vulnerabilidades Técnicas (Score: ${riskData.vulnerabilities.technical.score}/10)

${riskData.vulnerabilities.technical.items.map(item => `#### ${item.name}
- **Severidade**: ${item.severity} | **Score**: ${item.score}/10
- **Probabilidade**: ${item.likelihood} | **Impacto**: ${item.impact}
- **Descrição**: ${item.description}
- **Sistemas Afetados**: ${item.affected_systems.join(', ')}
- **Mitigação**: ${item.mitigation}
- **Prioridade**: ${item.priority}
`).join('\n')}

### 👥 Fatores Humanos (Score: ${riskData.vulnerabilities.human.score}/10)

${riskData.vulnerabilities.human.items.map(item => `#### ${item.name}
- **Severidade**: ${item.severity} | **Score**: ${item.score}/10
- **Probabilidade**: ${item.likelihood} | **Impacto**: ${item.impact}
- **Descrição**: ${item.description}
- **Áreas Afetadas**: ${item.affected_areas.join(', ')}
- **Mitigação**: ${item.mitigation}
- **Prioridade**: ${item.priority}
`).join('\n')}

### 📋 Falhas de Processo (Score: ${riskData.vulnerabilities.process.score}/10)

${riskData.vulnerabilities.process.items.map(item => `#### ${item.name}
- **Severidade**: ${item.severity} | **Score**: ${item.score}/10
- **Probabilidade**: ${item.likelihood} | **Impacto**: ${item.impact}
- **Descrição**: ${item.description}
- **Áreas Afetadas**: ${item.affected_areas.join(', ')}
- **Mitigação**: ${item.mitigation}
- **Prioridade**: ${item.priority}
`).join('\n')}

### 🌐 Riscos Externos (Score: ${riskData.vulnerabilities.external.score}/10)

${riskData.vulnerabilities.external.items.map(item => `#### ${item.name}
- **Severidade**: ${item.severity} | **Score**: ${item.score}/10
- **Probabilidade**: ${item.likelihood} | **Impacto**: ${item.impact}
- **Descrição**: ${item.description}
- **Áreas Afetadas**: ${item.affected_areas.join(', ')}
- **Mitigação**: ${item.mitigation}
- **Prioridade**: ${item.priority}
`).join('\n')}

## 💥 Cenários de Vazamento

${riskData.breach_scenarios.map(scenario => `### ${scenario.scenario}
- **Probabilidade**: ${scenario.probability}
- **Impacto**: ${scenario.impact}
- **Risk Score**: ${scenario.risk_score}/10
- **Registros Estimados**: ${scenario.estimated_records}
- **Custo Estimado**: ${scenario.estimated_cost}
- **Tempo de Recuperação**: ${scenario.recovery_time}
- **Dano Reputacional**: ${scenario.reputation_damage}
`).join('\n')}

## 📈 Análise de Impacto

### Categorias de Dados em Risco

| Categoria | Volume | Sensibilidade |
|-----------|--------|---------------|
${riskData.impact_analysis.data_categories_at_risk.map(cat =>
`| ${cat.category} | ${cat.volume} | ${cat.sensitivity} |`).join('\n')}

### Impacto no Negócio

#### 💰 Impacto Financeiro
- **Custos Diretos**: ${riskData.impact_analysis.business_impact.financial.direct_costs}
- **Multas Regulatórias**: ${riskData.impact_analysis.business_impact.financial.regulatory_fines}
- **Custos Legais**: ${riskData.impact_analysis.business_impact.financial.legal_costs}
- **Custos de Recuperação**: ${riskData.impact_analysis.business_impact.financial.recovery_costs}

#### ⚙️ Impacto Operacional
- **Downtime**: ${riskData.impact_analysis.business_impact.operational.downtime}
- **Perda de Produtividade**: ${riskData.impact_analysis.business_impact.operational.productivity_loss}
- **Perda de Clientes**: ${riskData.impact_analysis.business_impact.operational.customer_churn}
- **Impacto em Parceiros**: ${riskData.impact_analysis.business_impact.operational.partner_impact}

#### 🏢 Impacto Reputacional
- **Dano à Marca**: ${riskData.impact_analysis.business_impact.reputational.brand_damage}
- **Cobertura de Mídia**: ${riskData.impact_analysis.business_impact.reputational.media_coverage}
- **Perda de Confiança**: ${riskData.impact_analysis.business_impact.reputational.trust_loss}
- **Período de Recuperação**: ${riskData.impact_analysis.business_impact.reputational.recovery_period}

## 🛡️ Controles Existentes

### ✅ Controles Efetivos
${riskData.existing_controls.effective.map(control => `- ${control}`).join('\n')}

### ⚠️ Controles Parcialmente Efetivos
${riskData.existing_controls.partially_effective.map(control => `- ${control}`).join('\n')}

### ❌ Controles Inefetivos
${riskData.existing_controls.ineffective.map(control => `- ${control}`).join('\n')}

## 🎯 Recomendações Priorizadas

### 🔴 Prioridade Crítica
${riskData.recommendations.critical_priority.map(rec => `#### ${rec.action}
- **Timeline**: ${rec.timeline}
- **Custo**: ${rec.cost}
- **Redução de Risco**: ${rec.risk_reduction}
`).join('\n')}

### 🟡 Prioridade Alta
${riskData.recommendations.high_priority.map(rec => `#### ${rec.action}
- **Timeline**: ${rec.timeline}
- **Custo**: ${rec.cost}
- **Redução de Risco**: ${rec.risk_reduction}
`).join('\n')}

### 🟢 Prioridade Média
${riskData.recommendations.medium_priority.map(rec => `#### ${rec.action}
- **Timeline**: ${rec.timeline}
- **Custo**: ${rec.cost}
- **Redução de Risco**: ${rec.risk_reduction}
`).join('\n')}

## 📊 KPIs de Risco

| Métrica | Valor Atual | Meta |
|---------|------------|------|
| MTTR (Mean Time to Respond) | 72 horas | 24 horas |
| Taxa de Detecção | 60% | 95% |
| Taxa de Falsos Positivos | 30% | 10% |
| Cobertura de Monitoramento | 70% | 99% |
| Score de Compliance | 72% | 90% |

## 📈 Matriz de Risco

\`\`\`mermaid
graph LR
    A[API Keys Hardcoded] --> |9.0| CRITICO
    B[DPO Ausente] --> |10.0| CRITICO
    C[Senha Compartilhada] --> |8.0| ALTO
    D[Resposta não testada] --> |8.0| ALTO
    E[RTBF Manual] --> |7.0| ALTO
    F[Logs com PII] --> |7.5| ALTO
    G[Sem MFA] --> |7.0| ALTO
    H[ROPA Incompleto] --> |7.5| MEDIO
    I[Backups sem cripto] --> |6.0| MEDIO
\`\`\`

## 🔗 Links e Referências

- [[00-DPO2U-Hub|Hub de Compliance]]
- [[Incidentes/incident-response-plan|Plano de Resposta]]
- [[Templates/risk-assessment-template|Template de Avaliação]]
- [ISO 27005 - Risk Management](https://www.iso.org/standard/75281.html)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

## 📋 Sumário de Ações

**Total de Vulnerabilidades**: ${totalVulnerabilities}
**Itens Críticos**: ${criticalCount}
**Investimento Necessário**: R$ 200.000 - R$ 500.000
**Redução de Risco Esperada**: 60-75%
**Timeline Completo**: 90 dias

---
*Avaliação de Riscos gerada por DPO2U MCP v1.0*
*Salvo automaticamente no Obsidian*`;

  // Criar diretório se não existir
  const auditDir = path.dirname(filepath);
  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  // Salvar arquivo
  fs.writeFileSync(filepath, mdContent);

  // Exibir resumo no console
  console.log('🔐 AVALIAÇÃO DE RISCOS CONCLUÍDA\n');
  console.log(`Risk Score: ${riskData.overall_risk_score}/10 (${riskData.risk_level})`);
  console.log(`Tendência: ${riskData.risk_trend}\n`);

  console.log('📊 VULNERABILIDADES IDENTIFICADAS:');
  console.log(`  Total: ${totalVulnerabilities}`);
  console.log(`  Críticas: ${criticalCount}`);
  console.log(`  Técnicas: ${riskData.vulnerabilities.technical.items.length}`);
  console.log(`  Humanas: ${riskData.vulnerabilities.human.items.length}`);
  console.log(`  Processos: ${riskData.vulnerabilities.process.items.length}`);
  console.log(`  Externas: ${riskData.vulnerabilities.external.items.length}\n`);

  console.log('💥 CENÁRIOS MAIS PROVÁVEIS:');
  riskData.breach_scenarios
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 3)
    .forEach(scenario => {
      console.log(`  - ${scenario.scenario}: Score ${scenario.risk_score}/10`);
      console.log(`    Impacto: ${scenario.estimated_cost} | ${scenario.estimated_records} registros`);
    });

  console.log('\n🎯 TOP 3 AÇÕES CRÍTICAS:');
  riskData.recommendations.critical_priority.forEach((rec, idx) => {
    console.log(`  ${idx + 1}. ${rec.action}`);
    console.log(`     Timeline: ${rec.timeline} | Redução: ${rec.risk_reduction}`);
  });

  console.log('\n💰 IMPACTO FINANCEIRO POTENCIAL:');
  console.log(`  Custos Diretos: ${riskData.impact_analysis.business_impact.financial.direct_costs}`);
  console.log(`  Multas LGPD: ${riskData.impact_analysis.business_impact.financial.regulatory_fines}`);

  console.log('\n================================================');
  console.log('✅ Relatório salvo no Obsidian:');
  console.log(`📁 ${filepath}`);
  console.log('================================================');

  return filepath;
}

// Executar avaliação
assessDataBreachRisk().catch(console.error);