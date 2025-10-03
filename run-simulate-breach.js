#!/usr/bin/env node

/**
 * DPO2U MCP - Breach Simulation Tool
 * Simula vazamento de dados e gera plano de resposta
 */

import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

const OBSIDIAN_PATH = '/var/lib/docker/volumes/docker-compose_obsidian-vaults/_data/MyVault/04-DPO2U-Compliance';

async function simulateBreach() {
  console.log('🚨 Iniciando Simulação de Vazamento de Dados...');
  console.log('================================================\n');
  console.log('⚠️  SIMULAÇÃO - Não é um incidente real\n');
  console.log('Cenário: Vazamento de 1000 registros de clientes\n');

  // Dados da simulação
  const breachData = {
    simulation_id: `SIM-BREACH-${Date.now()}`,
    simulation_date: new Date(),
    type: 'SIMULAÇÃO',

    // Cenário simulado
    scenario: {
      breach_type: 'Exposição de Database',
      vector: 'API endpoint sem autenticação',
      discovery: 'Auditoria de segurança interna',
      affected_records: 1000,
      data_exposed: [
        'Nome completo',
        'Email',
        'CPF',
        'Telefone',
        'Endereço'
      ],
      sensitivity: 'ALTA',
      occurred_at: new Date(Date.now() - 72 * 60 * 60 * 1000), // 72h atrás
      discovered_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24h atrás
      systems_affected: ['PostgreSQL Database', 'API Gateway', 'Backup System']
    },

    // Timeline de resposta
    response_timeline: {
      't_0': {
        time: '0h',
        action: 'Descoberta do incidente',
        status: 'COMPLETO',
        responsible: 'Security Team'
      },
      't_1': {
        time: '0-1h',
        action: 'Avaliação inicial e isolamento',
        status: 'COMPLETO',
        responsible: 'DevOps + Security'
      },
      't_2': {
        time: '1-4h',
        action: 'Análise forense e identificação do escopo',
        status: 'COMPLETO',
        responsible: 'Forensics Team'
      },
      't_3': {
        time: '4-8h',
        action: 'Contenção e correção da vulnerabilidade',
        status: 'EM ANDAMENTO',
        responsible: 'Dev Team'
      },
      't_4': {
        time: '8-24h',
        action: 'Identificação dos titulares afetados',
        status: 'EM ANDAMENTO',
        responsible: 'Data Team'
      },
      't_5': {
        time: '24-48h',
        action: 'Notificação ANPD',
        status: 'PENDENTE',
        responsible: 'DPO + Legal'
      },
      't_6': {
        time: '48-72h',
        action: 'Comunicação aos titulares',
        status: 'PENDENTE',
        responsible: 'Communications'
      },
      't_7': {
        time: '72h+',
        action: 'Monitoramento e follow-up',
        status: 'PLANEJADO',
        responsible: 'All Teams'
      }
    },

    // Ações de contenção
    containment_actions: [
      { action: 'Desabilitar endpoint vulnerável', status: 'COMPLETO', time: '15min' },
      { action: 'Rotacionar todas as API keys', status: 'COMPLETO', time: '30min' },
      { action: 'Implementar autenticação no endpoint', status: 'COMPLETO', time: '2h' },
      { action: 'Aplicar patch de segurança', status: 'EM ANDAMENTO', time: '4h' },
      { action: 'Revisar todos os endpoints públicos', status: 'EM ANDAMENTO', time: '8h' },
      { action: 'Implementar WAF rules', status: 'PENDENTE', time: '24h' }
    ],

    // Análise de impacto
    impact_analysis: {
      data_subjects: {
        total: 1000,
        categorias: {
          clientes_ativos: 750,
          clientes_inativos: 200,
          prospects: 50
        },
        geografia: {
          brasil: 950,
          outros: 50
        }
      },
      potential_damages: {
        financial: 'R$ 50.000 - R$ 500.000',
        reputational: 'ALTO - Perda de confiança',
        operational: 'MÉDIO - 48h downtime parcial',
        legal: 'Multa LGPD até R$ 50M ou 2% faturamento'
      },
      risk_rating: {
        likelihood: 'Ocorrido (simulação)',
        severity: 'ALTA',
        overall: 'CRÍTICO'
      }
    },

    // Notificações obrigatórias
    notifications: {
      anpd: {
        required: true,
        deadline: '2 dias úteis',
        status: 'TEMPLATE PRONTO',
        content: {
          natureza: 'Exposição não autorizada de dados pessoais',
          categoria_dados: 'Dados de identificação e contato',
          quantidade: '1000 registros',
          medidas: 'Isolamento, correção, notificação',
          impacto: 'Potencial uso indevido de dados'
        }
      },
      data_subjects: {
        required: true,
        deadline: '72 horas',
        status: 'TEMPLATE PRONTO',
        method: ['Email', 'Website banner', 'Central de atendimento'],
        content: 'Comunicação clara sobre o incidente e medidas'
      },
      authorities: {
        other: ['PROCON', 'Ministério Público Digital'],
        status: 'AVALIANDO NECESSIDADE'
      }
    },

    // Plano de comunicação
    communication_plan: {
      internal: {
        ceo: { informed: true, time: 'T+0h' },
        board: { informed: true, time: 'T+1h' },
        all_staff: { informed: true, time: 'T+4h' }
      },
      external: {
        press_release: { status: 'RASCUNHO', time: 'T+24h' },
        website_notice: { status: 'PRONTO', time: 'T+24h' },
        social_media: { status: 'STANDBY', time: 'Se necessário' },
        partners: { status: 'PENDENTE', time: 'T+48h' }
      }
    },

    // Lições aprendidas (pós-simulação)
    lessons_learned: [
      'Necessidade de autenticação em TODOS os endpoints',
      'Implementar rate limiting em APIs',
      'Melhorar monitoramento de acessos anômalos',
      'Criar playbook de resposta a incidentes',
      'Treinar equipe regularmente em resposta',
      'Implementar DLP (Data Loss Prevention)',
      'Revisar política de retenção de logs'
    ],

    // Custos estimados
    estimated_costs: {
      immediate: {
        forensics: 'R$ 10.000',
        overtime: 'R$ 5.000',
        communications: 'R$ 8.000',
        legal: 'R$ 15.000'
      },
      short_term: {
        security_improvements: 'R$ 30.000',
        training: 'R$ 10.000',
        audits: 'R$ 20.000'
      },
      potential_fines: {
        anpd: 'Até R$ 50.000.000',
        procon: 'R$ 10.000 - R$ 100.000',
        civil_lawsuits: 'R$ 100.000 - R$ 1.000.000'
      }
    }
  };

  // Gerar checklist de resposta
  const generateChecklist = () => {
    return `
## ✅ Checklist de Resposta Imediata

### Primeiras 24 horas
- [x] Isolar sistemas afetados
- [x] Documentar descoberta inicial
- [x] Notificar equipe de resposta
- [x] Iniciar análise forense
- [x] Identificar escopo do vazamento
- [x] Corrigir vulnerabilidade imediata
- [ ] Preparar comunicação ANPD
- [ ] Identificar todos os afetados

### 24-48 horas
- [ ] Notificar ANPD (CRÍTICO - prazo legal)
- [ ] Finalizar lista de afetados
- [ ] Preparar comunicação aos titulares
- [ ] Revisar medidas de segurança
- [ ] Preparar FAQ para suporte

### 48-72 horas
- [ ] Comunicar titulares afetados
- [ ] Publicar notice no website
- [ ] Briefing equipe de suporte
- [ ] Monitorar dark web
- [ ] Avaliar necessidade de PR

### Após 72 horas
- [ ] Relatório completo do incidente
- [ ] Revisão de políticas
- [ ] Treinamento adicional
- [ ] Auditoria externa
- [ ] Melhorias de segurança`;
  };

  // Salvar no Obsidian
  const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
  const filename = `Breach-Simulation-1000-records-${timestamp}.md`;
  const filepath = path.join(OBSIDIAN_PATH, 'Incidentes', filename);

  const mdContent = `---
tags: [breach-simulation, incidente, vazamento, resposta, drill]
created: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
type: breach-simulation
severity: ALTA
affected_records: 1000
status: SIMULAÇÃO
---

# 🚨 Simulação de Vazamento - 1000 Registros

## ⚠️ STATUS: SIMULAÇÃO/DRILL
**Este é um exercício de simulação para teste do plano de resposta**

## 📋 Informações do Incidente

- **ID Simulação**: ${breachData.simulation_id}
- **Data/Hora**: ${format(breachData.simulation_date, 'dd/MM/yyyy HH:mm')}
- **Tipo de Vazamento**: ${breachData.scenario.breach_type}
- **Vetor de Ataque**: ${breachData.scenario.vector}
- **Registros Afetados**: **${breachData.scenario.affected_records}**
- **Severidade**: ${breachData.scenario.sensitivity}

## 🔍 Cenário Simulado

### Descoberta
- **Ocorrência**: ${format(breachData.scenario.occurred_at, 'dd/MM HH:mm')} (há 72h)
- **Descoberta**: ${format(breachData.scenario.discovered_at, 'dd/MM HH:mm')} (há 24h)
- **Método**: ${breachData.scenario.discovery}
- **Delay de detecção**: 48 horas

### Dados Expostos
${breachData.scenario.data_exposed.map(data => `- ${data}`).join('\n')}

### Sistemas Afetados
${breachData.scenario.systems_affected.map(system => `- ${system}`).join('\n')}

## ⏱️ Timeline de Resposta

| Tempo | Ação | Status | Responsável |
|-------|------|--------|-------------|
${Object.values(breachData.response_timeline).map(t =>
`| ${t.time} | ${t.action} | ${t.status} | ${t.responsible} |`).join('\n')}

## 🛡️ Ações de Contenção

| Ação | Status | Tempo |
|------|--------|-------|
${breachData.containment_actions.map(a =>
`| ${a.action} | ${a.status} | ${a.time} |`).join('\n')}

## 📊 Análise de Impacto

### Titulares Afetados
- **Total**: ${breachData.impact_analysis.data_subjects.total} pessoas
- **Clientes Ativos**: ${breachData.impact_analysis.data_subjects.categorias.clientes_ativos}
- **Clientes Inativos**: ${breachData.impact_analysis.data_subjects.categorias.clientes_inativos}
- **Prospects**: ${breachData.impact_analysis.data_subjects.categorias.prospects}
- **Geografia**: ${breachData.impact_analysis.data_subjects.geografia.brasil} Brasil, ${breachData.impact_analysis.data_subjects.geografia.outros} outros

### Impacto Potencial
- **Financeiro**: ${breachData.impact_analysis.potential_damages.financial}
- **Reputacional**: ${breachData.impact_analysis.potential_damages.reputational}
- **Operacional**: ${breachData.impact_analysis.potential_damages.operational}
- **Legal**: ${breachData.impact_analysis.potential_damages.legal}

### Classificação de Risco
- **Probabilidade**: ${breachData.impact_analysis.risk_rating.likelihood}
- **Severidade**: ${breachData.impact_analysis.risk_rating.severity}
- **Risco Geral**: **${breachData.impact_analysis.risk_rating.overall}**

## 📢 Notificações Obrigatórias

### ANPD - Autoridade Nacional
- **Obrigatório**: SIM ✅
- **Prazo**: ${breachData.notifications.anpd.deadline}
- **Status**: ${breachData.notifications.anpd.status}

**Conteúdo da Notificação:**
- Natureza: ${breachData.notifications.anpd.content.natureza}
- Categoria: ${breachData.notifications.anpd.content.categoria_dados}
- Quantidade: ${breachData.notifications.anpd.content.quantidade}
- Medidas: ${breachData.notifications.anpd.content.medidas}

### Titulares dos Dados
- **Obrigatório**: SIM ✅
- **Prazo**: ${breachData.notifications.data_subjects.deadline}
- **Métodos**: ${breachData.notifications.data_subjects.method.join(', ')}
- **Status**: ${breachData.notifications.data_subjects.status}

### Outras Autoridades
- ${breachData.notifications.authorities.other.join(', ')}
- Status: ${breachData.notifications.authorities.status}

## 📣 Plano de Comunicação

### Comunicação Interna
- **CEO**: Informado em T+${breachData.communication_plan.internal.ceo.time}
- **Board**: Informado em T+${breachData.communication_plan.internal.board.time}
- **Equipe**: Informado em T+${breachData.communication_plan.internal.all_staff.time}

### Comunicação Externa
- **Press Release**: ${breachData.communication_plan.external.press_release.status}
- **Website**: ${breachData.communication_plan.external.website_notice.status}
- **Redes Sociais**: ${breachData.communication_plan.external.social_media.status}
- **Parceiros**: ${breachData.communication_plan.external.partners.status}

${generateChecklist()}

## 💰 Custos Estimados

### Custos Imediatos
- Análise Forense: ${breachData.estimated_costs.immediate.forensics}
- Horas Extras: ${breachData.estimated_costs.immediate.overtime}
- Comunicação: ${breachData.estimated_costs.immediate.communications}
- Jurídico: ${breachData.estimated_costs.immediate.legal}
- **Total Imediato**: R$ 38.000

### Custos Curto Prazo
- Melhorias Segurança: ${breachData.estimated_costs.short_term.security_improvements}
- Treinamento: ${breachData.estimated_costs.short_term.training}
- Auditorias: ${breachData.estimated_costs.short_term.audits}
- **Total Curto Prazo**: R$ 60.000

### Multas Potenciais
- ANPD: ${breachData.estimated_costs.potential_fines.anpd}
- PROCON: ${breachData.estimated_costs.potential_fines.procon}
- Ações Civis: ${breachData.estimated_costs.potential_fines.civil_lawsuits}

## 📝 Lições Aprendidas

${breachData.lessons_learned.map((lesson, idx) => `${idx + 1}. ${lesson}`).join('\n')}

## 📎 Templates de Comunicação

### Template Email Titulares
\`\`\`
Assunto: Comunicado Importante sobre Segurança de Dados

Prezado(a) Cliente,

Informamos que identificamos um incidente de segurança que pode ter exposto alguns de seus dados pessoais. Tomamos medidas imediatas para conter o incidente e estamos trabalhando para garantir que isso não ocorra novamente.

Dados potencialmente afetados: Nome, email, CPF, telefone
Período: [Data]
Ações tomadas: Correção imediata da vulnerabilidade

Recomendamos:
- Monitorar suas contas
- Alterar senhas por precaução
- Entrar em contato conosco para dúvidas

Atenciosamente,
DPO2U Technology Solutions
\`\`\`

### Template Notificação ANPD
\`\`\`
À ANPD - Autoridade Nacional de Proteção de Dados

COMUNICAÇÃO DE INCIDENTE DE SEGURANÇA

Empresa: DPO2U Technology Solutions
CNPJ: XX.XXX.XXX/0001-XX
Data do Incidente: [Data]
Data da Descoberta: [Data]

Natureza: Exposição não autorizada de dados
Quantidade: 1000 registros
Categorias: Dados de identificação e contato

Medidas tomadas:
1. Isolamento imediato
2. Correção da vulnerabilidade
3. Notificação aos titulares

Em conformidade com Art. 48 da LGPD.

[Assinatura DPO]
\`\`\`

## 🔗 Links e Referências

- [[00-DPO2U-Hub|Hub de Compliance]]
- [[incident-response-plan|Plano de Resposta]]
- [[Templates/incident-template|Template Base]]
- [ANPD - Comunicação de Incidentes](https://www.gov.br/anpd/pt-br/assuntos/incidente-de-seguranca)

## 📊 Métricas da Simulação

- **Tempo de Detecção**: 48h (MELHORAR - Meta: <24h)
- **Tempo de Contenção**: 4h (BOM - Meta: <6h)
- **Tempo para Notificação**: 48h (ADEQUADO - Prazo: 2 dias)
- **Score de Resposta**: 75/100

---

**⚠️ FIM DA SIMULAÇÃO**

*Simulação de vazamento executada por DPO2U MCP v1.0*
*Documento confidencial - Uso interno*`;

  // Criar diretório se não existir
  const incidentDir = path.dirname(filepath);
  if (!fs.existsSync(incidentDir)) {
    fs.mkdirSync(incidentDir, { recursive: true });
  }

  // Salvar arquivo
  fs.writeFileSync(filepath, mdContent);

  // Exibir resumo no console
  console.log('🚨 SIMULAÇÃO DE VAZAMENTO CONCLUÍDA!\n');
  console.log('📊 CENÁRIO SIMULADO:');
  console.log(`  Tipo: ${breachData.scenario.breach_type}`);
  console.log(`  Registros: ${breachData.scenario.affected_records}`);
  console.log(`  Dados: ${breachData.scenario.data_exposed.join(', ')}`);
  console.log(`  Severidade: ${breachData.scenario.sensitivity}\n`);

  console.log('⏱️  TIMELINE DE RESPOSTA:');
  console.log('  T+0h: Descoberta ✅');
  console.log('  T+1h: Isolamento ✅');
  console.log('  T+4h: Análise forense ✅');
  console.log('  T+8h: Contenção 🔄');
  console.log('  T+24h: Identificação afetados 🔄');
  console.log('  T+48h: Notificação ANPD ⏳');
  console.log('  T+72h: Comunicação titulares ⏳\n');

  console.log('📢 NOTIFICAÇÕES NECESSÁRIAS:');
  console.log('  ANPD: OBRIGATÓRIO (2 dias úteis)');
  console.log('  Titulares: OBRIGATÓRIO (72 horas)');
  console.log('  PROCON: Em avaliação\n');

  console.log('💰 CUSTOS ESTIMADOS:');
  console.log('  Resposta Imediata: R$ 38.000');
  console.log('  Melhorias: R$ 60.000');
  console.log('  Multas Potenciais: Até R$ 50.000.000\n');

  console.log('✅ AÇÕES CRÍTICAS:');
  console.log('  1. Endpoint vulnerável DESABILITADO');
  console.log('  2. API keys ROTACIONADAS');
  console.log('  3. Autenticação IMPLEMENTADA');
  console.log('  4. Patch segurança EM ANDAMENTO');
  console.log('  5. Templates comunicação PRONTOS\n');

  console.log('📈 SCORE DA SIMULAÇÃO: 75/100');
  console.log('  Pontos fortes: Contenção rápida, documentação');
  console.log('  Melhorias: Reduzir tempo detecção (<24h)\n');

  console.log('================================================');
  console.log('✅ Plano de resposta salvo no Obsidian:');
  console.log(`📁 ${filepath}`);
  console.log('⚠️  LEMBRETE: Esta foi uma SIMULAÇÃO');
  console.log('================================================');

  return filepath;
}

// Executar simulação
simulateBreach().catch(console.error);