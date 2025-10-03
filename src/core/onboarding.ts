import fs from 'fs/promises';
import { existsSync } from 'fs';
import readline from 'readline';
import {
  getConfigDirectory,
  getOnboardingFlagPath,
  resolveInBase,
} from '../utils/pathResolver.js';

type QuickOnboardingOptions = {
  companyName?: string;
  cnpj?: string;
  email?: string;
  hasDPO?: string | boolean;
  silent?: boolean;
};

export async function ensureOnboardingCompleted(): Promise<void> {
  const configPath = resolveInBase('config', 'company.json');
  const onboardingFlagPath = getOnboardingFlagPath();

  try {
    await fs.access(configPath);
    await fs.access(onboardingFlagPath);
    console.log('✅ [DPO2U] Onboarding completed - Starting MCP server');
    return;
  } catch (error) {
    const autoMode = (process.env.MCP_AUTO_ONBOARDING || '').toLowerCase();
    const nonInteractive =
      process.env.MCP_NON_INTERACTIVE === 'true' ||
      process.env.CI === 'true' ||
      !process.stdin.isTTY;

    if (autoMode === 'skip') {
      console.log('\n⚙️  [DPO2U] Auto-onboarding desativado, gerando configuração padrão mínima...');
      await runQuickOnboarding({ silent: true });
      return;
    }

    if (autoMode === 'quick' || nonInteractive) {
      console.log('\n⚙️  [DPO2U] Executando onboarding rápido automático (modo não interativo)...');
      await runQuickOnboarding({
        silent: true,
        companyName: process.env.MCP_COMPANY_NAME,
        cnpj: process.env.MCP_COMPANY_CNPJ,
        email: process.env.MCP_COMPANY_EMAIL,
        hasDPO: process.env.MCP_COMPANY_HAS_DPO,
      });
      return;
    }

    await promptInteractiveOnboarding();
  }
}

async function promptInteractiveOnboarding(): Promise<void> {
  console.log('\n🚨 ONBOARDING OBRIGATÓRIO DETECTADO');
  console.log('='.repeat(50));
  console.log('⚠️  O MCP DPO2U requer configuração inicial antes do primeiro uso.');
  console.log('📋 Esta etapa coleta dados da empresa e avalia conformidade LGPD.');
  console.log('⏱️  Tempo estimado: 15-20 minutos');
  console.log('='.repeat(50));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query: string): Promise<string> =>
    new Promise((resolve) => rl.question(query, resolve));

  console.log('\nOpções:');
  console.log('1. Executar onboarding completo agora');
  console.log('2. Executar onboarding rápido (dados mínimos)');
  console.log('3. Sair (servidor não iniciará)');

  const choice = await question('\nEscolha uma opção (1/2/3): ');

  rl.close();

  switch (choice) {
    case '1':
      console.log('\n🚀 Iniciando onboarding completo...');
      await runFullOnboarding();
      break;
    case '2':
      console.log('\n⚡ Iniciando onboarding rápido...');
      await runQuickOnboarding();
      break;
    default:
      console.log('\n❌ Onboarding cancelado. O servidor MCP não pode iniciar sem configuração.');
      process.exit(1);
  }
}

export async function runFullOnboarding(): Promise<void> {
  const { runCompanySetup } = await import('../initialization/companySetup.js');
  await runCompanySetup();
  await markOnboardingCompleted();
  console.log('✅ Onboarding completo finalizado!');
}

export async function runQuickOnboarding(options: QuickOnboardingOptions = {}): Promise<void> {
  let rl: readline.Interface | null = null;
  let question: ((query: string) => Promise<string>) | null = null;

  const needsInteractivePrompts =
    !options.companyName &&
    !options.email &&
    options.silent !== true &&
    process.stdin.isTTY;

  if (needsInteractivePrompts) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    question = (query: string): Promise<string> =>
      new Promise((resolve) => rl!.question(query, resolve));
  }

  try {
    if (!options.silent) {
      console.log('\n📝 ONBOARDING RÁPIDO - Dados Mínimos');
      console.log('====================================');
    }

    const companyName = await resolveAnswer(options.companyName, question, 'Nome da Empresa: ', 'DPO2U CLI Demo');
    const cnpj = await resolveAnswer(options.cnpj, question, 'CNPJ (opcional): ', 'N/A');
    const email = await resolveAnswer(options.email, question, 'Email de Contato: ', 'cli@dpo2u.com');
    const rawHasDPO = options.hasDPO ?? (question ? await question('Possui DPO designado? (s/n): ') : 'n');
    const hasDPO = typeof rawHasDPO === 'boolean' ? rawHasDPO : rawHasDPO.toLowerCase() === 's';

    const quickConfig = {
      name: companyName,
      cnpj,
      email,
      phone: 'N/A',
      address: 'N/A',
      website: 'N/A',
      sector: 'N/A',
      size: 'N/A',
      dpo: {
        name: hasDPO ? 'Designado' : 'Claude AI Assistant (Sistema Automatizado)',
        email: hasDPO ? email : 'dpo@dpo2u.com',
        phone: 'N/A',
        formalized: hasDPO,
      },
      checklistAnswers: {
        governance: { hasPrivacyPolicy: hasDPO ? 'sim' : 'parcial' },
        dataManagement: { hasConsentManagement: 'parcial' },
        security: { hasEncryption: 'parcial' },
        thirdParties: { hasVendorAssessments: 'parcial' },
        rights: { hasSubjectRightsProcess: 'parcial' },
        incidents: { hasBreachNotification: 'parcial' },
      },
      evidencePaths: {},
      configuredAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      setupType: options.silent ? 'auto-quick' : 'quick',
      complianceScore: hasDPO ? 55 : 50,
    };

    const configDir = getConfigDirectory();
    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(resolveInBase('config', 'company.json'), JSON.stringify(quickConfig, null, 2));
    await markOnboardingCompleted();

    if (rl) {
      rl.close();
    }

    if (!options.silent) {
      console.log('✅ Onboarding rápido finalizado!');
    }
  } catch (error) {
    if (rl) {
      rl.close();
    }
    console.error('❌ Erro no onboarding rápido:', error);
    process.exit(1);
  }
}

function resolveAnswer(
  value: string | undefined,
  question: ((query: string) => Promise<string>) | null,
  prompt: string,
  fallback: string,
): Promise<string> {
  if (value && value.trim().length > 0) {
    return Promise.resolve(value.trim());
  }

  if (question) {
    return question(prompt).then((answer) => (answer && answer.trim().length > 0 ? answer.trim() : fallback));
  }

  return Promise.resolve(fallback);
}

export async function markOnboardingCompleted(): Promise<void> {
  await fs.writeFile(getOnboardingFlagPath(), `ONBOARDING_COMPLETED=${new Date().toISOString()}`);
}

export async function resetOnboarding(): Promise<void> {
  const configPath = resolveInBase('config', 'company.json');
  const onboardingFlagPath = getOnboardingFlagPath();

  if (existsSync(configPath)) {
    await fs.unlink(configPath);
  }

  if (existsSync(onboardingFlagPath)) {
    await fs.unlink(onboardingFlagPath);
  }
}
