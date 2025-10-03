#!/usr/bin/env node

/**
 * DPO2U MCP - Company Setup and Initial Configuration
 * Configuração inicial da empresa e checklist LGPD
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import {
  getConfigDirectory,
  getObsidianCompliancePath,
} from '../utils/pathResolver.js';

const CONFIG_PATH = getConfigDirectory();
const OBSIDIAN_PATH = getObsidianCompliancePath();

// Criar interface para input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para fazer perguntas
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Dados da empresa
let companyData = {
  setup_date: new Date(),
  setup_id: `SETUP-${Date.now()}`,
  company: {
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    sector: '',
    size: '',
    dpo: {
      exists: false,
      name: '',
      email: '',
      phone: '',
      formalized: false
    }
  },
  checklist_responses: {},
  compliance_score: 0,
  evidence_locations: []
};

// Checklist LGPD completo
const LGPD_CHECKLIST = [
  // 1. Governança de Proteção de Dados
  {
    id: 'GOV001',
    category: 'Governança de Proteção de Dados',
    question: 'A EMPRESA tem uma pessoa encarregada da proteção de dados pessoais (DPO)?',
    legal_ref: 'LGPD Art. 41, § 2º | GDPR Art. 50',
    weight: 5
  },
  {
    id: 'GOV002',
    category: 'Governança de Proteção de Dados',
    question: 'O papel e responsabilidade do Encarregado está formalizado internamente?',
    legal_ref: 'LGPD Art. 41, § 2º | GDPR: Art. 37(5), Art. 38(3)',
    weight: 4
  },
  {
    id: 'GOV003',
    category: 'Governança de Proteção de Dados',
    question: 'O Encarregado desempenha sua função de forma independente e sigilosa?',
    legal_ref: 'LGPD Art. 41 | GDPR: Art. 37(5), Art. 38(3)',
    weight: 4
  },
  {
    id: 'GOV004',
    category: 'Governança de Proteção de Dados',
    question: 'O contrato do Encarregado tem cláusulas de confidencialidade?',
    legal_ref: 'LGPD: Art. 46 | GDPR: Art. 38(5)',
    weight: 3
  },
  {
    id: 'GOV005',
    category: 'Governança de Proteção de Dados',
    question: 'A EMPRESA possui Política de Gestão de Dados Pessoais formalizada?',
    legal_ref: 'LGPD: Art. 50, § 2º, I | GDPR: Art. 24(2)',
    weight: 5
  },
  {
    id: 'GOV006',
    category: 'Governança de Proteção de Dados',
    question: 'A EMPRESA possui Política de Privacidade e Termos de Uso formalizados?',
    legal_ref: 'LGPD: Art. 6º, VI | GDPR: Art. 5, 6, 7, 12, 13',
    weight: 5
  },
  {
    id: 'GOV007',
    category: 'Governança de Proteção de Dados',
    question: 'Questões de Proteção de Dados foram contempladas nas Avaliações de Risco?',
    legal_ref: 'LGPD: Art. 50 | GDPR: Art. 24(1)',
    weight: 4
  },
  {
    id: 'GOV008',
    category: 'Governança de Proteção de Dados',
    question: 'A EMPRESA mantém documentação de conformidade com a legislação?',
    legal_ref: 'LGPD: Art. 37 | GDPR: Art. 5(2), Art. 24(1)',
    weight: 4
  },

  // 2. Gestão de Dados Pessoais
  {
    id: 'GES001',
    category: 'Gestão de Dados Pessoais',
    question: 'Há procedimento formalizado para coleta e uso legítimos de Dados Pessoais?',
    legal_ref: 'LGPD: Art. 8º, 9º, 10 § 2º | GDPR: Art. 5, 6, 7, 13',
    weight: 5
  },
  {
    id: 'GES002',
    category: 'Gestão de Dados Pessoais',
    question: 'Há procedimento formalizado para Dados Pessoais sensíveis?',
    legal_ref: 'LGPD: Art. 11 | GDPR: Art. 9(1)(2)',
    weight: 5
  },
  {
    id: 'GES003',
    category: 'Gestão de Dados Pessoais',
    question: 'Há procedimento para Dados Pessoais de menores de idade?',
    legal_ref: 'LGPD: Art. 14',
    weight: 4
  },
  {
    id: 'GES004',
    category: 'Gestão de Dados Pessoais',
    question: 'Há procedimento para obtenção de consentimento válido?',
    legal_ref: 'LGPD: Art. 8º, 9º §§ 1º e 2º, 11 I | GDPR: Art. 7',
    weight: 5
  },
  {
    id: 'GES005',
    category: 'Gestão de Dados Pessoais',
    question: 'Existe procedimento para responder solicitações de acesso do Titular?',
    legal_ref: 'LGPD: Art.6º IV, Art. 18 II, Art. 19 | GDPR: Art. 15',
    weight: 5
  },
  {
    id: 'GES006',
    category: 'Gestão de Dados Pessoais',
    question: 'Existe procedimento para retificação, apagamento e limitações de tratamento?',
    legal_ref: 'LGPD: Art. 16, 18 III, IV, VI, IX | GDPR: Art. 16, 17, 18',
    weight: 5
  },
  {
    id: 'GES007',
    category: 'Gestão de Dados Pessoais',
    question: 'Existe procedimento para retirada do consentimento?',
    legal_ref: 'LGPD: Art. 8º § 5º, Art. 18 IX | GDPR: Art. 7(3)',
    weight: 5
  },
  {
    id: 'GES008',
    category: 'Gestão de Dados Pessoais',
    question: 'Há procedimento duplicado para obtenção de consentimento?',
    legal_ref: 'LGPD: Art. 8º § 5º, Art. 18 IX | GDPR: Art. 7(3)',
    weight: 2
  },
  {
    id: 'GES009',
    category: 'Gestão de Dados Pessoais',
    question: 'Existe procedimento para portabilidade de dados?',
    legal_ref: 'LGPD: Art. 19 | GDPR: Art. 20(1)(2)',
    weight: 4
  },
  {
    id: 'GES010',
    category: 'Gestão de Dados Pessoais',
    question: 'O tratamento para fins estatísticos respeita minimização de dados?',
    legal_ref: 'LGPD: Art. 18 IV | GDPR: Art. 89(1), Art. 5(1)(e)',
    weight: 3
  },

  // 3. Segurança da Informação
  {
    id: 'SEG001',
    category: 'Segurança da Informação',
    question: 'A EMPRESA considera questões da legislação em suas trilhas de auditoria?',
    legal_ref: 'LGPD: Art. 37 | GDPR: Art. 5(1)(f)(2)',
    weight: 4
  },
  {
    id: 'SEG002',
    category: 'Segurança da Informação',
    question: 'A EMPRESA mantém registro de todas as atividades de tratamento?',
    legal_ref: 'LGPD: Art. 37 | GDPR: Art. 30(1)',
    weight: 5
  },
  {
    id: 'SEG003',
    category: 'Segurança da Informação',
    question: 'A EMPRESA monitora ambientes físicos, lógicos e virtuais com Dados Pessoais?',
    legal_ref: 'LGPD: Art. 34, 40, 46, 48 III | GDPR: Art. 30, 32(1)',
    weight: 4
  },
  {
    id: 'SEG004',
    category: 'Segurança da Informação',
    question: 'Há dupla verificação na eliminação definitiva de Dados Pessoais?',
    legal_ref: 'LGPD: Art. 16 | GDPR: Art. 32(1)(b)',
    weight: 3
  },
  {
    id: 'SEG005',
    category: 'Segurança da Informação',
    question: 'A EMPRESA realiza gestão do ciclo de vida dos Dados Pessoais?',
    legal_ref: 'LGPD: Art. 15, 16, 18, 37 | GDPR: Art. 32(1)(b), 17',
    weight: 4
  },
  {
    id: 'SEG006',
    category: 'Segurança da Informação',
    question: 'Todos os sistemas refletem políticas de legitimação de processamento?',
    legal_ref: 'LGPD: Art. 15, 16, 18, 37 | GDPR: Art. 25(1)(2)(3), 17',
    weight: 4
  },
  {
    id: 'SEG007',
    category: 'Segurança da Informação',
    question: 'A EMPRESA utiliza pseudonimização ou anonimização quando necessário?',
    legal_ref: 'LGPD: Art. 16 IV, 18 IV § 6º | GDPR: Art. 32(1)(a)',
    weight: 4
  },
  {
    id: 'SEG008',
    category: 'Segurança da Informação',
    question: 'Dados repetitivos possuem processo de consolidação eletrônica?',
    legal_ref: 'LGPD: Art. 6º V | GDPR: Art. 32(1)(b)',
    weight: 3
  },
  {
    id: 'SEG009',
    category: 'Segurança da Informação',
    question: 'A EMPRESA realiza Avaliação de Impacto (RIPD/DPIA)?',
    legal_ref: 'LGPD: Art. 5º XVII, 50 § 2º I d | GDPR: Art. 35(1)',
    weight: 5
  },
  {
    id: 'SEG010',
    category: 'Segurança da Informação',
    question: 'A EMPRESA reporta resultado das Avaliações de Impacto ao Encarregado?',
    legal_ref: 'LGPD: Art. 41 § 2º III | GDPR: Art. 35(2)',
    weight: 3
  },

  // 4. Gestão de Risco dos Dados Pessoais
  {
    id: 'RIS001',
    category: 'Gestão de Risco',
    question: 'A EMPRESA considera Proteção de Dados nas rotinas de avaliação de riscos?',
    legal_ref: 'GDPR: Art. 32(2) | LGPD: Art. 50',
    weight: 4
  },
  {
    id: 'RIS002',
    category: 'Gestão de Risco',
    question: 'A EMPRESA aplica medidas técnicas e organizacionais adequadas?',
    legal_ref: 'GDPR: Art. 32(1)(b) | LGPD: Art. 6º VII, 38, 48 III',
    weight: 5
  },
  {
    id: 'RIS003',
    category: 'Gestão de Risco',
    question: 'A EMPRESA mantém Dados Pessoais criptografados?',
    legal_ref: 'GDPR: Art. 32(1)(b) | LGPD: Art. 6º II',
    weight: 5
  },
  {
    id: 'RIS004',
    category: 'Gestão de Risco',
    question: 'A EMPRESA garante disponibilidade dos Dados em caso de incidente?',
    legal_ref: 'GDPR: Art. 32(1)(c) | LGPD: Art. 46',
    weight: 4
  },
  {
    id: 'RIS005',
    category: 'Gestão de Risco',
    question: 'A EMPRESA realiza testes regulares de eficácia das medidas?',
    legal_ref: 'GDPR: Art. 32(d) | LGPD: Art.38, 46',
    weight: 4
  },

  // 5. Gestão de Dados Pessoais em Terceiros
  {
    id: 'TER001',
    category: 'Terceiros',
    question: 'Há procedimentos para Proteção de Dados tratados por Terceiros?',
    legal_ref: 'Art. 7º § 5º, 9º V, 15 III, 18 § 6º, 46',
    weight: 4
  },
  {
    id: 'TER002',
    category: 'Terceiros',
    question: 'Na transferência internacional, a EMPRESA adota medidas de proteção?',
    legal_ref: 'Art. 7º § 5º, 9º V, 15 III, 18 § 6º, 46',
    weight: 4
  },
  {
    id: 'TER003',
    category: 'Terceiros',
    question: 'A EMPRESA mantém documentação para transferência internacional?',
    legal_ref: 'Art. 6º X, 46, 47',
    weight: 3
  },
  {
    id: 'TER004',
    category: 'Terceiros',
    question: 'A EMPRESA conduz auditorias em Terceiros?',
    legal_ref: 'Art. 6º X, 46, 47',
    weight: 3
  },

  // 6. Gestão de Incidentes
  {
    id: 'INC001',
    category: 'Gestão de Incidentes',
    question: 'A EMPRESA mantém Plano de Resposta a violações formalizado?',
    legal_ref: 'Art. 46, 47, 48, 49',
    weight: 5
  },
  {
    id: 'INC002',
    category: 'Gestão de Incidentes',
    question: 'O Plano contém forma de notificação às autoridades e titulares?',
    legal_ref: 'Art. 46, 47, 48, 49',
    weight: 5
  },
  {
    id: 'INC003',
    category: 'Gestão de Incidentes',
    question: 'A EMPRESA mantém equipe treinada para responder incidentes?',
    legal_ref: 'Art. 46, 47, 48, 49',
    weight: 4
  },
  {
    id: 'INC004',
    category: 'Gestão de Incidentes',
    question: 'A EMPRESA mantém controle da rastreabilidade dos incidentes?',
    legal_ref: 'Art. 46, 47, 48, 49',
    weight: 4
  }
];

// Função para coletar dados da empresa
async function collectCompanyData() {
  console.log('\n🏢 CONFIGURAÇÃO INICIAL - DPO2U MCP\n');
  console.log('================================================\n');

  // Dados básicos
  companyData.company.name = await question('Nome da Empresa: ');
  companyData.company.cnpj = await question('CNPJ: ');
  companyData.company.email = await question('Email Corporativo: ');
  companyData.company.phone = await question('Telefone: ');
  companyData.company.address = await question('Endereço: ');
  companyData.company.website = await question('Website: ');
  companyData.company.sector = await question('Setor de Atuação: ');

  const size = await question('Porte da Empresa (1-Micro, 2-Pequena, 3-Média, 4-Grande): ');
  companyData.company.size = ['', 'Micro', 'Pequena', 'Média', 'Grande'][parseInt(size) || 1];

  // DPO
  const hasDPO = await question('\nA empresa possui DPO/Encarregado designado? (s/n): ');
  if (hasDPO.toLowerCase() === 's') {
    companyData.company.dpo.exists = true;
    companyData.company.dpo.name = await question('Nome do DPO: ');
    companyData.company.dpo.email = await question('Email do DPO: ');
    companyData.company.dpo.phone = await question('Telefone do DPO: ');
    const formalized = await question('O DPO está formalizado internamente? (s/n): ');
    companyData.company.dpo.formalized = formalized.toLowerCase() === 's';
  }
}

// Função para executar o checklist
async function runChecklist() {
  console.log('\n📋 CHECKLIST DE CONFORMIDADE LGPD\n');
  console.log('================================================\n');
  console.log('Responda: s (Sim) | n (Não) | p (Parcial) | na (Não Aplicável)\n');

  let totalScore = 0;
  let maxScore = 0;

  for (const item of LGPD_CHECKLIST) {
    console.log(`\n[${item.category}]`);
    console.log(`${item.question}`);
    console.log(`Ref: ${item.legal_ref}`);

    const response = await question('Resposta (s/n/p/na): ');

    // Solicitar evidência se a resposta for positiva
    let evidence = '';
    if (response.toLowerCase() === 's') {
      evidence = await question('Localização da evidência (caminho ou descrição): ');
      if (evidence) {
        companyData.evidence_locations.push({
          item_id: item.id,
          location: evidence,
          date: new Date()
        });
      }
    }

    // Calcular score
    let score = 0;
    switch(response.toLowerCase()) {
      case 's': score = item.weight; break;
      case 'p': score = item.weight * 0.5; break;
      case 'n': score = 0; break;
      case 'na': score = item.weight; break; // Não aplicável = compliant
    }

    totalScore += score;
    maxScore += item.weight;

    // Salvar resposta
    companyData.checklist_responses[item.id] = {
      question: item.question,
      category: item.category,
      response: response.toLowerCase(),
      evidence: evidence,
      score: score,
      weight: item.weight,
      legal_ref: item.legal_ref
    };
  }

  // Calcular score de compliance
  companyData.compliance_score = Math.round((totalScore / maxScore) * 100);
}

// Função para salvar dados
async function saveData() {
  // Criar diretório se não existir
  if (!fs.existsSync(CONFIG_PATH)) {
    fs.mkdirSync(CONFIG_PATH, { recursive: true });
  }

  // Salvar configuração da empresa
  const configFile = path.join(CONFIG_PATH, 'company.json');
  fs.writeFileSync(configFile, JSON.stringify(companyData, null, 2));

  // Salvar no Obsidian
  const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
  const obsidianFile = path.join(OBSIDIAN_PATH, 'Setup', `Company-Setup-${timestamp}.md`);

  // Criar diretório no Obsidian se não existir
  const setupDir = path.join(OBSIDIAN_PATH, 'Setup');
  if (!fs.existsSync(setupDir)) {
    fs.mkdirSync(setupDir, { recursive: true });
  }

  // Criar conteúdo Markdown
  const mdContent = `---
tags: [company-setup, lgpd, checklist, inicial]
created: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
type: company-setup
company: ${companyData.company.name}
cnpj: ${companyData.company.cnpj}
compliance_score: ${companyData.compliance_score}
---

# 🏢 Configuração Inicial - ${companyData.company.name}

## Dados da Empresa

- **Nome**: ${companyData.company.name}
- **CNPJ**: ${companyData.company.cnpj}
- **Email**: ${companyData.company.email}
- **Telefone**: ${companyData.company.phone}
- **Website**: ${companyData.company.website}
- **Setor**: ${companyData.company.sector}
- **Porte**: ${companyData.company.size}

## DPO/Encarregado

- **Possui DPO**: ${companyData.company.dpo.exists ? 'Sim' : 'Não'}
${companyData.company.dpo.exists ? `- **Nome**: ${companyData.company.dpo.name}
- **Email**: ${companyData.company.dpo.email}
- **Telefone**: ${companyData.company.dpo.phone}
- **Formalizado**: ${companyData.company.dpo.formalized ? 'Sim' : 'Não'}` : ''}

## Score de Conformidade LGPD

### **${companyData.compliance_score}%**

## Resumo do Checklist

${Object.entries(
  Object.values(companyData.checklist_responses).reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = { sim: 0, nao: 0, parcial: 0, na: 0 };
    switch(item.response) {
      case 's': acc[item.category].sim++; break;
      case 'n': acc[item.category].nao++; break;
      case 'p': acc[item.category].parcial++; break;
      case 'na': acc[item.category].na++; break;
    }
    return acc;
  }, {})
).map(([cat, stats]) =>
  `### ${cat}
- Conformes: ${stats.sim}
- Não Conformes: ${stats.nao}
- Parciais: ${stats.parcial}
- Não Aplicáveis: ${stats.na}`
).join('\n\n')}

## Evidências Coletadas

${companyData.evidence_locations.length > 0 ?
  companyData.evidence_locations.map(ev =>
    `- **${ev.item_id}**: ${ev.location}`
  ).join('\n') :
  'Nenhuma evidência registrada'}

---
*Setup realizado em ${format(new Date(), 'dd/MM/yyyy HH:mm')}*`;

  fs.writeFileSync(obsidianFile, mdContent);

  console.log(`\n✅ Dados salvos em:`);
  console.log(`   Config: ${configFile}`);
  console.log(`   Obsidian: ${obsidianFile}`);

  return { configFile, obsidianFile };
}

// Função principal
export async function runCompanySetup() {
  try {
    await collectCompanyData();
    await runChecklist();

    console.log('\n================================================');
    console.log(`✅ SETUP COMPLETO!`);
    console.log(`📊 Score de Conformidade LGPD: ${companyData.compliance_score}%`);
    console.log('================================================\n');

    const files = await saveData();

    rl.close();

    return companyData;
  } catch (error) {
    console.error('Erro durante o setup:', error);
    rl.close();
    throw error;
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runCompanySetup().catch(console.error);
}
