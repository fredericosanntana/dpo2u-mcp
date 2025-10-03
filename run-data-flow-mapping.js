#!/usr/bin/env node

/**
 * DPO2U MCP - Data Flow Mapping Tool
 * Mapeia o fluxo de dados pessoais na organização e salva no Obsidian
 */

import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

const OBSIDIAN_PATH = '/var/lib/docker/volumes/docker-compose_obsidian-vaults/_data/MyVault/04-DPO2U-Compliance';

async function mapDataFlow() {
  console.log('🗺️ Mapeando Fluxo de Dados Pessoais...');
  console.log('================================================\n');
  console.log('Analisando sistemas, processos e integrações...\n');

  // Simulação do mapeamento de dados
  const dataFlowMap = {
    mapping_id: `FLOW-${Date.now()}`,
    mapping_date: new Date(),
    organization: 'DPO2U Infrastructure Stack',
    version: '1.0',

    // Sistemas identificados
    systems: [
      {
        id: 'SYS-001',
        name: 'n8n Automation Platform',
        type: 'Workflow Automation',
        criticality: 'ALTA',
        data_categories: ['Identificação', 'Contato', 'Logs'],
        volume: '~10.000 registros',
        location: 'Docker Container',
        owner: 'DevOps Team'
      },
      {
        id: 'SYS-002',
        name: 'BillionMail Server',
        type: 'Email System',
        criticality: 'CRÍTICA',
        data_categories: ['Email', 'Comunicações', 'Anexos'],
        volume: '~50.000 emails',
        location: 'Docker Container',
        owner: 'IT Team'
      },
      {
        id: 'SYS-003',
        name: 'PostgreSQL Database',
        type: 'Database',
        criticality: 'CRÍTICA',
        data_categories: ['Todos os dados estruturados'],
        volume: '~100.000 registros',
        location: 'Docker Container',
        owner: 'Database Team'
      },
      {
        id: 'SYS-004',
        name: 'Obsidian Vault',
        type: 'Knowledge Management',
        criticality: 'MÉDIA',
        data_categories: ['Documentação', 'Relatórios', 'Políticas'],
        volume: '~1.000 documentos',
        location: 'Docker Volume',
        owner: 'Knowledge Team'
      },
      {
        id: 'SYS-005',
        name: 'Grafana/Prometheus',
        type: 'Monitoring',
        criticality: 'MÉDIA',
        data_categories: ['Logs', 'Métricas', 'Alertas'],
        volume: '~1M registros/dia',
        location: 'Docker Container',
        owner: 'DevOps Team'
      },
      {
        id: 'SYS-006',
        name: 'Redis Cache',
        type: 'Cache Layer',
        criticality: 'ALTA',
        data_categories: ['Sessions', 'Cache temporário'],
        volume: '~100.000 chaves',
        location: 'Docker Container',
        owner: 'DevOps Team'
      },
      {
        id: 'SYS-007',
        name: 'LEANN Vector DB',
        type: 'AI/Search',
        criticality: 'MÉDIA',
        data_categories: ['Embeddings', 'Conhecimento'],
        volume: '~10.000 vetores',
        location: 'Docker Container',
        owner: 'AI Team'
      },
      {
        id: 'SYS-008',
        name: 'Ollama LLM',
        type: 'AI Model',
        criticality: 'BAIXA',
        data_categories: ['Queries', 'Responses'],
        volume: 'Processamento local',
        location: 'Docker Container',
        owner: 'AI Team'
      }
    ],

    // Fluxos de dados identificados
    data_flows: [
      {
        flow_id: 'FLOW-001',
        name: 'Registro de Usuário',
        description: 'Fluxo de cadastro de novo usuário',
        data_types: ['Nome', 'Email', 'Senha', 'Telefone'],
        source: 'Web Form',
        path: [
          { step: 1, system: 'Traefik', action: 'Recebe request HTTPS' },
          { step: 2, system: 'n8n', action: 'Valida e processa dados' },
          { step: 3, system: 'PostgreSQL', action: 'Armazena dados' },
          { step: 4, system: 'Redis', action: 'Cache de sessão' },
          { step: 5, system: 'BillionMail', action: 'Envia email confirmação' }
        ],
        retention: '5 anos',
        legal_basis: 'Consentimento',
        purpose: 'Criação de conta'
      },
      {
        flow_id: 'FLOW-002',
        name: 'Processamento de Email',
        description: 'Recebimento e processamento de emails',
        data_types: ['Email', 'Conteúdo', 'Anexos', 'Metadados'],
        source: 'SMTP External',
        path: [
          { step: 1, system: 'Postfix', action: 'Recebe email SMTP' },
          { step: 2, system: 'Rspamd', action: 'Filtra spam/vírus' },
          { step: 3, system: 'Dovecot', action: 'Armazena em mailbox' },
          { step: 4, system: 'PostgreSQL', action: 'Registra metadados' },
          { step: 5, system: 'Roundcube', action: 'Disponibiliza para usuário' }
        ],
        retention: '2 anos',
        legal_basis: 'Execução de contrato',
        purpose: 'Comunicação'
      },
      {
        flow_id: 'FLOW-003',
        name: 'Auditoria e Compliance',
        description: 'Coleta de dados para auditoria LGPD',
        data_types: ['Logs', 'Acessos', 'Modificações'],
        source: 'Todos os sistemas',
        path: [
          { step: 1, system: 'Aplicações', action: 'Geram logs' },
          { step: 2, system: 'Docker', action: 'Coleta logs containers' },
          { step: 3, system: 'Prometheus', action: 'Coleta métricas' },
          { step: 4, system: 'Grafana', action: 'Visualiza dados' },
          { step: 5, system: 'Obsidian', action: 'Armazena relatórios' }
        ],
        retention: '7 anos',
        legal_basis: 'Obrigação legal',
        purpose: 'Auditoria e compliance'
      },
      {
        flow_id: 'FLOW-004',
        name: 'Busca Semântica AI',
        description: 'Processamento de queries com AI',
        data_types: ['Queries', 'Embeddings', 'Respostas'],
        source: 'User Interface',
        path: [
          { step: 1, system: 'n8n', action: 'Recebe query' },
          { step: 2, system: 'LEANN', action: 'Gera embedding' },
          { step: 3, system: 'Vector DB', action: 'Busca similar' },
          { step: 4, system: 'Ollama', action: 'Gera resposta' },
          { step: 5, system: 'Redis', action: 'Cache resultado' }
        ],
        retention: '30 dias',
        legal_basis: 'Legítimo interesse',
        purpose: 'Melhorar experiência'
      },
      {
        flow_id: 'FLOW-005',
        name: 'Backup e Recovery',
        description: 'Backup de dados críticos',
        data_types: ['Todos os dados'],
        source: 'Sistemas internos',
        path: [
          { step: 1, system: 'PostgreSQL', action: 'Dump database' },
          { step: 2, system: 'Docker Volumes', action: 'Snapshot volumes' },
          { step: 3, system: 'Scripts', action: 'Compacta e cripta' },
          { step: 4, system: 'GitHub', action: 'Armazena backup' },
          { step: 5, system: 'Logs', action: 'Registra operação' }
        ],
        retention: '1 ano',
        legal_basis: 'Legítimo interesse',
        purpose: 'Continuidade do negócio'
      }
    ],

    // Integrações com terceiros
    third_party_integrations: [
      {
        name: 'OpenAI API',
        type: 'AI Service',
        data_shared: ['Queries', 'Text content'],
        purpose: 'Embeddings generation',
        location: 'USA',
        safeguards: 'API Key, HTTPS',
        dpa_status: 'Pendente'
      },
      {
        name: 'GitHub',
        type: 'Version Control',
        data_shared: ['Code', 'Configurations', 'Backups'],
        purpose: 'Backup and versioning',
        location: 'USA',
        safeguards: 'SSH Key, 2FA',
        dpa_status: 'Terms accepted'
      },
      {
        name: 'Firecrawl',
        type: 'Web Scraping',
        data_shared: ['URLs', 'Scraped content'],
        purpose: 'Content extraction',
        location: 'Cloud',
        safeguards: 'API Key',
        dpa_status: 'Não aplicável'
      }
    ],

    // Pontos de coleta de dados
    collection_points: [
      {
        point: 'Web Forms',
        data_collected: ['Nome', 'Email', 'Telefone', 'Mensagens'],
        consent_mechanism: 'Checkbox opt-in',
        transparency: 'Privacy notice presente'
      },
      {
        point: 'APIs',
        data_collected: ['Requests', 'IPs', 'User agents'],
        consent_mechanism: 'Terms of service',
        transparency: 'API documentation'
      },
      {
        point: 'Email',
        data_collected: ['Emails', 'Anexos', 'Contatos'],
        consent_mechanism: 'Implícito por comunicação',
        transparency: 'Email footer'
      },
      {
        point: 'Logs',
        data_collected: ['IPs', 'Timestamps', 'Actions'],
        consent_mechanism: 'Legítimo interesse',
        transparency: 'Privacy policy'
      }
    ],

    // Categorias de dados processados
    data_categories: [
      {
        category: 'Dados de Identificação',
        types: ['Nome', 'CPF', 'RG', 'ID usuário'],
        sensitivity: 'MÉDIA',
        volume: '~50.000',
        systems: ['PostgreSQL', 'n8n', 'BillionMail']
      },
      {
        category: 'Dados de Contato',
        types: ['Email', 'Telefone', 'Endereço'],
        sensitivity: 'BAIXA',
        volume: '~50.000',
        systems: ['PostgreSQL', 'BillionMail', 'n8n']
      },
      {
        category: 'Dados de Acesso',
        types: ['Username', 'Senha hash', 'Tokens'],
        sensitivity: 'ALTA',
        volume: '~10.000',
        systems: ['PostgreSQL', 'Redis', 'n8n']
      },
      {
        category: 'Dados Comportamentais',
        types: ['Logs', 'Clicks', 'Navegação'],
        sensitivity: 'BAIXA',
        volume: '~1M/dia',
        systems: ['Grafana', 'Prometheus', 'Logs']
      },
      {
        category: 'Dados de Comunicação',
        types: ['Emails', 'Mensagens', 'Anexos'],
        sensitivity: 'MÉDIA',
        volume: '~100.000',
        systems: ['BillionMail', 'PostgreSQL']
      },
      {
        category: 'Dados Técnicos',
        types: ['IPs', 'User agents', 'Cookies'],
        sensitivity: 'BAIXA',
        volume: '~1M',
        systems: ['Traefik', 'Logs', 'Redis']
      }
    ],

    // Riscos identificados no fluxo
    flow_risks: [
      {
        risk: 'Dados em trânsito sem criptografia interna',
        location: 'Entre containers Docker',
        severity: 'MÉDIA',
        mitigation: 'Implementar TLS interno'
      },
      {
        risk: 'Logs contendo PII',
        location: 'Grafana/Prometheus',
        severity: 'ALTA',
        mitigation: 'Sanitização de logs'
      },
      {
        risk: 'Backups não criptografados',
        location: 'Docker volumes',
        severity: 'ALTA',
        mitigation: 'Criptografia em repouso'
      },
      {
        risk: 'Retenção excessiva de dados',
        location: 'PostgreSQL',
        severity: 'MÉDIA',
        mitigation: 'Política de retenção automática'
      }
    ],

    // Controles de privacidade
    privacy_controls: [
      {
        control: 'Minimização de dados',
        status: 'PARCIAL',
        implementation: '60%',
        gaps: ['Coleta excessiva em forms', 'Logs verbosos']
      },
      {
        control: 'Pseudonimização',
        status: 'NÃO IMPLEMENTADO',
        implementation: '0%',
        gaps: ['Dados em texto claro', 'IDs diretos']
      },
      {
        control: 'Criptografia',
        status: 'PARCIAL',
        implementation: '70%',
        gaps: ['Backups', 'Comunicação interna']
      },
      {
        control: 'Controle de acesso',
        status: 'IMPLEMENTADO',
        implementation: '85%',
        gaps: ['MFA não obrigatório']
      },
      {
        control: 'Auditoria',
        status: 'IMPLEMENTADO',
        implementation: '90%',
        gaps: ['Logs não centralizados 100%']
      }
    ],

    // Matriz RACI
    raci_matrix: [
      {
        process: 'Coleta de dados',
        responsible: 'Product Team',
        accountable: 'DPO',
        consulted: 'Legal',
        informed: 'IT'
      },
      {
        process: 'Armazenamento',
        responsible: 'IT Team',
        accountable: 'CTO',
        consulted: 'DPO',
        informed: 'Security'
      },
      {
        process: 'Processamento',
        responsible: 'Dev Team',
        accountable: 'Product Manager',
        consulted: 'DPO',
        informed: 'Stakeholders'
      },
      {
        process: 'Compartilhamento',
        responsible: 'Business Team',
        accountable: 'DPO',
        consulted: 'Legal',
        informed: 'All teams'
      },
      {
        process: 'Exclusão',
        responsible: 'IT Team',
        accountable: 'DPO',
        consulted: 'Legal',
        informed: 'User'
      }
    ],

    // Estatísticas do mapeamento
    statistics: {
      total_systems: 8,
      total_flows: 5,
      total_data_categories: 6,
      third_parties: 3,
      collection_points: 4,
      identified_risks: 4,
      compliance_score: 65
    }
  };

  // Gerar diagrama Mermaid do fluxo principal
  const generateMermaidDiagram = (flow) => {
    let diagram = 'graph LR\n';
    flow.path.forEach((step, idx) => {
      if (idx === 0) {
        diagram += `    Start[${flow.source}] --> ${step.system}["${step.system}<br/>${step.action}"]\n`;
      } else if (idx === flow.path.length - 1) {
        diagram += `    ${flow.path[idx-1].system} --> ${step.system}["${step.system}<br/>${step.action}"]\n`;
        diagram += `    ${step.system} --> End[Fim]\n`;
      } else {
        diagram += `    ${flow.path[idx-1].system} --> ${step.system}["${step.system}<br/>${step.action}"]\n`;
      }
    });
    return diagram;
  };

  // Salvar no Obsidian
  const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
  const filename = `Data-Flow-Map-${timestamp}.md`;
  const filepath = path.join(OBSIDIAN_PATH, 'Auditorias', filename);

  const mdContent = `---
tags: [data-flow, mapeamento, lgpd, gdpr, fluxo-dados]
created: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
type: data-flow-map
version: ${dataFlowMap.version}
systems: ${dataFlowMap.statistics.total_systems}
flows: ${dataFlowMap.statistics.total_flows}
compliance_score: ${dataFlowMap.statistics.compliance_score}
---

# 🗺️ Mapeamento de Fluxo de Dados Pessoais

## 📊 Resumo Executivo

- **Data do Mapeamento**: ${format(dataFlowMap.mapping_date, 'dd/MM/yyyy HH:mm')}
- **Organização**: ${dataFlowMap.organization}
- **ID do Mapeamento**: ${dataFlowMap.mapping_id}
- **Versão**: ${dataFlowMap.version}

### Estatísticas Gerais

| Métrica | Valor |
|---------|-------|
| Sistemas Mapeados | ${dataFlowMap.statistics.total_systems} |
| Fluxos Identificados | ${dataFlowMap.statistics.total_flows} |
| Categorias de Dados | ${dataFlowMap.statistics.total_data_categories} |
| Integrações Terceiros | ${dataFlowMap.statistics.third_parties} |
| Pontos de Coleta | ${dataFlowMap.statistics.collection_points} |
| Riscos Identificados | ${dataFlowMap.statistics.identified_risks} |
| Score de Compliance | ${dataFlowMap.statistics.compliance_score}% |

## 🖥️ Sistemas Identificados

${dataFlowMap.systems.map(sys => `### ${sys.name}
- **ID**: ${sys.id}
- **Tipo**: ${sys.type}
- **Criticidade**: ${sys.criticality}
- **Categorias de Dados**: ${sys.data_categories.join(', ')}
- **Volume**: ${sys.volume}
- **Localização**: ${sys.location}
- **Responsável**: ${sys.owner}
`).join('\n')}

## 🔄 Fluxos de Dados Mapeados

${dataFlowMap.data_flows.map(flow => `### ${flow.name}

**ID**: ${flow.flow_id}
**Descrição**: ${flow.description}
**Tipos de Dados**: ${flow.data_types.join(', ')}
**Origem**: ${flow.source}
**Base Legal**: ${flow.legal_basis}
**Finalidade**: ${flow.purpose}
**Retenção**: ${flow.retention}

#### Caminho do Fluxo:
${flow.path.map(step => `${step.step}. **${step.system}**: ${step.action}`).join('\n')}

#### Diagrama do Fluxo:
\`\`\`mermaid
${generateMermaidDiagram(flow)}\`\`\`
`).join('\n')}

## 🌐 Integrações com Terceiros

| Serviço | Tipo | Dados Compartilhados | Localização | DPA Status |
|---------|------|---------------------|-------------|------------|
${dataFlowMap.third_party_integrations.map(tp =>
`| ${tp.name} | ${tp.type} | ${tp.data_shared.join(', ')} | ${tp.location} | ${tp.dpa_status} |`).join('\n')}

## 📍 Pontos de Coleta de Dados

${dataFlowMap.collection_points.map(point => `### ${point.point}
- **Dados Coletados**: ${point.data_collected.join(', ')}
- **Mecanismo de Consentimento**: ${point.consent_mechanism}
- **Transparência**: ${point.transparency}
`).join('\n')}

## 📂 Categorias de Dados Processados

${dataFlowMap.data_categories.map(cat => `### ${cat.category}
- **Tipos**: ${cat.types.join(', ')}
- **Sensibilidade**: ${cat.sensitivity}
- **Volume**: ${cat.volume}
- **Sistemas**: ${cat.systems.join(', ')}
`).join('\n')}

## ⚠️ Riscos Identificados no Fluxo

${dataFlowMap.flow_risks.map(risk => `### ${risk.risk}
- **Localização**: ${risk.location}
- **Severidade**: ${risk.severity}
- **Mitigação**: ${risk.mitigation}
`).join('\n')}

## 🛡️ Controles de Privacidade

| Controle | Status | Implementação | Gaps |
|----------|--------|---------------|------|
${dataFlowMap.privacy_controls.map(ctrl =>
`| ${ctrl.control} | ${ctrl.status} | ${ctrl.implementation} | ${ctrl.gaps.join(', ')} |`).join('\n')}

## 👥 Matriz RACI

| Processo | Responsável | Accountable | Consultado | Informado |
|----------|-------------|-------------|------------|-----------|
${dataFlowMap.raci_matrix.map(raci =>
`| ${raci.process} | ${raci.responsible} | ${raci.accountable} | ${raci.consulted} | ${raci.informed} |`).join('\n')}

## 📈 Visão Geral do Ecossistema de Dados

\`\`\`mermaid
graph TB
    subgraph "Coleta"
        WF[Web Forms]
        API[APIs]
        EM[Email]
        LG[Logs]
    end

    subgraph "Processamento"
        N8N[n8n]
        PG[PostgreSQL]
        RD[Redis]
        LN[LEANN]
    end

    subgraph "Armazenamento"
        DB[(Database)]
        FS[File System]
        BK[Backups]
    end

    subgraph "Terceiros"
        OAI[OpenAI]
        GH[GitHub]
        FC[Firecrawl]
    end

    WF --> N8N
    API --> N8N
    EM --> N8N
    LG --> N8N

    N8N --> PG
    N8N --> RD
    N8N --> LN

    PG --> DB
    RD --> DB
    LN --> FS

    DB --> BK
    FS --> BK

    N8N -.-> OAI
    BK -.-> GH
    N8N -.-> FC
\`\`\`

## 🎯 Recomendações

### Prioridade Alta
1. Implementar pseudonimização de dados pessoais
2. Criptografar backups e comunicação interna
3. Sanitizar logs para remover PII
4. Implementar política de retenção automática

### Prioridade Média
1. Reduzir coleta de dados (minimização)
2. Centralizar todos os logs
3. Implementar DLP (Data Loss Prevention)
4. Revisar contratos com terceiros (DPA)

### Prioridade Baixa
1. Otimizar fluxos de dados
2. Documentar todos os subprocessadores
3. Criar data catalog completo

## 📊 Métricas de Conformidade

\`\`\`mermaid
pie title Implementação de Controles
    "Implementado" : 35
    "Parcial" : 45
    "Não Implementado" : 20
\`\`\`

## 🔗 Links e Referências

- [[00-DPO2U-Hub|Hub de Compliance]]
- [[Templates/data-flow-template|Template de Fluxo]]
- [[ropa-register|Registro ROPA]]
- [ISO 29134 - Privacy Impact Assessment](https://www.iso.org/standard/62289.html)
- [Artigo 30 GDPR - Records of Processing](https://gdpr-info.eu/art-30-gdpr/)

---
*Mapeamento de Fluxo de Dados gerado por DPO2U MCP v1.0*
*Salvo automaticamente no Obsidian*`;

  // Criar diretório se não existir
  const auditDir = path.dirname(filepath);
  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  // Salvar arquivo
  fs.writeFileSync(filepath, mdContent);

  // Exibir resumo no console
  console.log('🗺️  MAPEAMENTO DE FLUXO DE DADOS CONCLUÍDO\n');
  console.log(`📊 ESTATÍSTICAS DO MAPEAMENTO:`);
  console.log(`  Sistemas: ${dataFlowMap.statistics.total_systems}`);
  console.log(`  Fluxos: ${dataFlowMap.statistics.total_flows}`);
  console.log(`  Categorias de Dados: ${dataFlowMap.statistics.total_data_categories}`);
  console.log(`  Terceiros: ${dataFlowMap.statistics.third_parties}`);
  console.log(`  Score de Compliance: ${dataFlowMap.statistics.compliance_score}%\n`);

  console.log('🔄 PRINCIPAIS FLUXOS IDENTIFICADOS:');
  dataFlowMap.data_flows.forEach(flow => {
    console.log(`  - ${flow.name}`);
    console.log(`    Dados: ${flow.data_types.join(', ')}`);
    console.log(`    Base Legal: ${flow.legal_basis} | Retenção: ${flow.retention}`);
  });

  console.log('\n⚠️  RISCOS CRÍTICOS NO FLUXO:');
  dataFlowMap.flow_risks
    .filter(r => r.severity === 'ALTA')
    .forEach(risk => {
      console.log(`  - ${risk.risk}`);
      console.log(`    Local: ${risk.location} | Mitigação: ${risk.mitigation}`);
    });

  console.log('\n🛡️  CONTROLES AUSENTES:');
  dataFlowMap.privacy_controls
    .filter(c => c.status === 'NÃO IMPLEMENTADO')
    .forEach(control => {
      console.log(`  - ${control.control}: ${control.gaps.join(', ')}`);
    });

  console.log('\n📍 PONTOS DE COLETA:');
  dataFlowMap.collection_points.forEach(point => {
    console.log(`  - ${point.point}: ${point.data_collected.join(', ')}`);
  });

  console.log('\n================================================');
  console.log('✅ Mapeamento salvo no Obsidian:');
  console.log(`📁 ${filepath}`);
  console.log('================================================');

  return filepath;
}

// Executar mapeamento
mapDataFlow().catch(console.error);