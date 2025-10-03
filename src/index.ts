#!/usr/bin/env node
/**
 * DPO2U MCP Server - AI-Powered LGPD/GDPR Compliance Platform
 * First MCP-native compliance solution with Claude Desktop integration
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import {
  getBasePath,
  getConfigDirectory,
  getOnboardingFlagPath,
  resolveInBase,
} from './utils/pathResolver.js';
// Import all compliance tools from single file
import {
  AuditInfrastructureTool,
  CheckComplianceTool,
  AssessRiskTool,
  MapDataFlowTool,
  GeneratePrivacyPolicyTool,
  CreateDPOReportTool,
  AnalyzeContractTool,
  SimulateBreachTool,
  VerifyConsentTool,
  CalculatePrivacyScoreTool
} from './tools/auditInfrastructure.js';

// Import OpenFHE-powered tools
import {
  EncryptedReportingTool,
  PrivateBenchmarkTool,
  ZKComplianceTool,
  FHEExecutiveDashboardTool,
  HomomorphicAnalyticsTool,
  SecureDataSharingTool,
  ComplianceRemediationTool
} from './tools/fheTools.js';

// Import integrations
import { LEANNIntegration } from './integrations/leann.js';
import { OllamaIntegration } from './integrations/ollama.js';
import { OpenFHEIntegration } from './integrations/openfhe.js';

dotenv.config();

/**
 * Main DPO2U MCP Server Class
 */
class DPO2UMCPServer {
  private server: Server;
  private leann: LEANNIntegration;
  private ollama: OllamaIntegration;
  private openfhe: OpenFHEIntegration;
  private tools: Map<string, any>;

  constructor() {
    // Initialize server with capabilities
    this.server = new Server(
      {
        name: 'dpo2u-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize integrations
    this.leann = new LEANNIntegration(
      process.env.LEANN_API_URL || 'http://localhost:3001',
      process.env.LEANN_API_KEY || 'leann-api-2025'
    );

    this.ollama = new OllamaIntegration(
      process.env.OLLAMA_API_URL || 'http://172.18.0.1:11434',
      process.env.OLLAMA_MODEL || 'qwen2.5:3b-instruct'
    );

    this.openfhe = new OpenFHEIntegration();

    // Initialize tools
    this.tools = new Map();
    this.initializeTools();

    // Setup request handlers
    this.setupHandlers();

    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Initialize all compliance tools including OpenFHE-powered tools
   */
  private initializeTools(): void {
    // Register all 10 standard compliance tools
    this.tools.set('auditinfrastructure', new AuditInfrastructureTool(this.leann, this.ollama));
    this.tools.set('checkcompliance', new CheckComplianceTool(this.leann, this.ollama));
    this.tools.set('assessrisk', new AssessRiskTool(this.leann, this.ollama));
    this.tools.set('mapdataflow', new MapDataFlowTool(this.leann));
    this.tools.set('generateprivacypolicy', new GeneratePrivacyPolicyTool(this.leann, this.ollama));
    this.tools.set('createdporeport', new CreateDPOReportTool(this.leann, this.ollama));
    this.tools.set('analyzecontract', new AnalyzeContractTool(this.leann, this.ollama));
    this.tools.set('simulatebreach', new SimulateBreachTool(this.leann));
    this.tools.set('verifyconsent', new VerifyConsentTool(this.leann));
    this.tools.set('calculateprivacyscore', new CalculatePrivacyScoreTool(this.leann));

    // Register 7 new OpenFHE-powered tools
    this.tools.set('encryptedreporting', new EncryptedReportingTool(this.leann, this.ollama, this.openfhe));
    this.tools.set('privatebenchmark', new PrivateBenchmarkTool(this.leann, this.ollama, this.openfhe));
    this.tools.set('zkcomplianceproof', new ZKComplianceTool(this.leann, this.ollama, this.openfhe));
    this.tools.set('fheexecutivedashboard', new FHEExecutiveDashboardTool(this.leann, this.ollama, this.openfhe));
    this.tools.set('homomorphicanalytics', new HomomorphicAnalyticsTool(this.leann, this.ollama, this.openfhe));
    this.tools.set('securedatasharing', new SecureDataSharingTool(this.leann, this.ollama, this.openfhe));
    this.tools.set('automatedremediation', new ComplianceRemediationTool(this.leann, this.ollama, this.openfhe));

    console.log(`[DPO2U] Initialized ${this.tools.size} compliance tools (${this.tools.size - 10} with OpenFHE)`);
  }

  /**
   * Setup MCP request handlers
   */
  private setupHandlers(): void {
    // Handle list tools request
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = Array.from(this.tools.entries()).map(([name, tool]) => ({
        name,
        description: tool.getDescription(),
        inputSchema: tool.getInputSchema(),
      }));

      return { tools };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      const tool = this.tools.get(name);
      if (!tool) {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Tool "${name}" not found`
        );
      }

      try {
        const startTime = Date.now();
        const result = await tool.execute(args);
        const executionTime = Date.now() - startTime;

        console.log(`[DPO2U] Tool ${name} executed in ${executionTime}ms`);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error(`[DPO2U] Tool ${name} error:`, error);
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  }

  /**
   * Start the MCP server
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('[DPO2U] MCP Server started successfully');
    console.log('[DPO2U] Ready for Claude Desktop integration');
  }
}

// Main execution
async function main() {
  console.log('='.repeat(60));
  console.log('DPO2U MCP Platform - AI Compliance Engine v1.0');
  console.log('First MCP-native LGPD/GDPR compliance solution');
  console.log('='.repeat(60));

  try {
    // 🚨 MANDATORY ONBOARDING CHECK
    await ensureOnboardingCompleted();

    const server = new DPO2UMCPServer();
    await server.start();
  } catch (error) {
    console.error('[DPO2U] Failed to start server:', error);
    process.exit(1);
  }
}

/**
 * Mandatory onboarding check - server cannot start without setup
 */
async function ensureOnboardingCompleted(): Promise<void> {
  const fs = await import('fs/promises');
  const configPath = resolveInBase('config', 'company.json');
  const onboardingFlagPath = getOnboardingFlagPath();

  try {
    // Check if onboarding was completed
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

    console.log('\n🚨 ONBOARDING OBRIGATÓRIO DETECTADO');
    console.log('='.repeat(50));
    console.log('⚠️  O MCP DPO2U requer configuração inicial antes do primeiro uso.');
    console.log('📋 Esta etapa coleta dados da empresa e avalia conformidade LGPD.');
    console.log('⏱️  Tempo estimado: 15-20 minutos');
    console.log('='.repeat(50));

    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (query: string): Promise<string> =>
      new Promise((resolve) => rl.question(query, resolve));

    console.log('\nOpções:');
    console.log('1. Executar onboarding completo agora');
    console.log('2. Executar onboarding rápido (dados mínimos)');
    console.log('3. Sair (servidor não iniciará)');

    const choice = await question('\nEscolha uma opção (1/2/3): ');

    switch (choice) {
      case '1':
        console.log('\n🚀 Iniciando onboarding completo...');
        rl.close();
        await runFullOnboarding();
        break;

      case '2':
        console.log('\n⚡ Iniciando onboarding rápido...');
        rl.close();
        await runQuickOnboarding();
        break;

      default:
        console.log('\n❌ Onboarding cancelado. O servidor MCP não pode iniciar sem configuração.');
        rl.close();
        process.exit(1);
    }
  }
}

/**
 * Run full company setup with complete LGPD checklist
 */
async function runFullOnboarding(): Promise<void> {
  try {
    const { runCompanySetup } = await import('./initialization/companySetup.js');
    await runCompanySetup();
    await markOnboardingCompleted();
    console.log('✅ Onboarding completo finalizado! Iniciando servidor...\n');
  } catch (error) {
    console.error('❌ Erro no onboarding:', error);
    process.exit(1);
  }
}

/**
 * Run quick onboarding with minimal required data
 */
type QuickOnboardingOptions = {
  companyName?: string;
  cnpj?: string;
  email?: string;
  hasDPO?: string | boolean;
  silent?: boolean;
};

async function runQuickOnboarding(options: QuickOnboardingOptions = {}): Promise<void> {
  const fs = await import('fs/promises');

  const needsInteractivePrompts =
    !options.companyName &&
    !options.email &&
    options.silent !== true &&
    process.stdin.isTTY;

  let rl: any = null;
  let question: ((query: string) => Promise<string>) | null = null;

  if (needsInteractivePrompts) {
    const readline = await import('readline');
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

    const companyName = options.companyName && options.companyName.trim().length > 0
      ? options.companyName.trim()
      : question
        ? (await question('Nome da Empresa: ')).trim()
        : 'DPO2U CLI Demo';

    const cnpj = options.cnpj && options.cnpj.trim().length > 0
      ? options.cnpj.trim()
      : question
        ? (await question('CNPJ (opcional): ')).trim()
        : '';

    const email = options.email && options.email.trim().length > 0
      ? options.email.trim()
      : question
        ? (await question('Email de Contato: ')).trim()
        : 'cli@dpo2u.com';

    const rawHasDPO = options.hasDPO ?? (question ? await question('Possui DPO designado? (s/n): ') : 'n');
    const hasDPO = typeof rawHasDPO === 'boolean' ? rawHasDPO : rawHasDPO.toLowerCase() === 's';

    const quickConfig = {
      name: companyName || 'DPO2U CLI Demo',
      cnpj: cnpj || 'N/A',
      email: email || 'cli@dpo2u.com',
      phone: 'N/A',
      address: 'N/A',
      website: 'N/A',
      sector: 'N/A',
      size: 'N/A',
      dpo: {
        name: hasDPO ? 'Designado' : 'Claude AI Assistant (Sistema Automatizado)',
        email: hasDPO ? (email || 'dpo@empresa.com') : 'dpo@dpo2u.com',
        phone: 'N/A',
        formalized: hasDPO,
      },
      checklistAnswers: {
        governance: { hasPrivacyPolicy: 'parcial' },
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
      complianceScore: 50, // Score inicial para setup rápido
    };

    // Save quick config
    const configDir = getConfigDirectory();
    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(
      resolveInBase('config', 'company.json'),
      JSON.stringify(quickConfig, null, 2)
    );

    await markOnboardingCompleted();

    if (rl) {
      rl.close();
    }

    if (!options.silent) {
      console.log('✅ Onboarding rápido finalizado! Iniciando servidor...\n');
      console.log('💡 Recomendação: Execute o onboarding completo posteriormente para melhor conformidade.');
    }
  } catch (error) {
    if (rl) {
      rl.close();
    }
    console.error('❌ Erro no onboarding rápido:', error);
    process.exit(1);
  }
}

/**
 * Mark onboarding as completed
 */
async function markOnboardingCompleted(): Promise<void> {
  const fs = await import('fs/promises');
  await fs.writeFile(
    getOnboardingFlagPath(),
    `ONBOARDING_COMPLETED=${new Date().toISOString()}`
  );
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
