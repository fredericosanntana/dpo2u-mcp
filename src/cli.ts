#!/usr/bin/env node
import { Command } from 'commander';
import dotenv from 'dotenv';
import fs from 'fs';
import { ensureOnboardingCompleted, resetOnboarding, runQuickOnboarding } from './core/onboarding.js';
import { createServiceContext, listTools } from './core/serviceContext.js';
import { DPO2UMCPServer } from './server/mcpServer.js';
import { startHttpServer } from './httpServer.js';
import { resolveInBase } from './utils/pathResolver.js';

dotenv.config();

const program = new Command();
program
  .name('dpo2u-mcp')
  .description('CLI oficial da DPO2U MCP Platform');

program
  .command('serve:mcp')
  .description('Inicia o servidor MCP (Model Context Protocol)')
  .action(async () => {
    await ensureOnboardingCompleted();
    const context = createServiceContext();
    const server = new DPO2UMCPServer(context);
    await server.start();
  });

program
  .command('serve:http')
  .description('Inicia a API HTTP para executar ferramentas MCP')
  .option('-p, --port <port>', 'Porta HTTP')
  .action(async (options) => {
    if (options.port) {
      process.env.DPO2U_HTTP_PORT = String(options.port);
    }
    await startHttpServer();
  });

program
  .command('tools:list')
  .description('Lista todas as ferramentas MCP disponíveis')
  .action(async () => {
    await ensureOnboardingCompleted();
    const context = createServiceContext();
    const tools = listTools(context);
    tools.forEach((tool) => {
      console.log(`- ${tool.name}: ${tool.description}`);
    });
  });

program
  .command('tools:call <name>')
  .description('Executa uma ferramenta MCP via CLI')
  .option('-a, --args <json>', 'Argumentos em JSON para a ferramenta', '{}')
  .action(async (name, options) => {
    await ensureOnboardingCompleted();
    const context = createServiceContext();
    const tool = context.tools.get(name);

    if (!tool) {
      console.error(`Ferramenta "${name}" não encontrada.`);
      process.exit(1);
    }

    try {
      const args = JSON.parse(options.args);
      const result = await tool.execute(args);
      console.log(JSON.stringify(result, null, 2));
    } catch (error: any) {
      console.error('Erro executando ferramenta:', error?.message || error);
      process.exit(1);
    }
  });

program
  .command('onboarding:reset')
  .description('Remove arquivos de onboarding para reconfiguração')
  .action(async () => {
    await resetOnboarding();
    console.log('✅ Arquivos de onboarding removidos. Execute novamente para configurar.');
  });

program
  .command('onboarding:quick')
  .description('Executa onboarding rápido com dados fornecidos via flags')
  .option('--company <name>', 'Nome da empresa')
  .option('--email <email>', 'Email de contato')
  .option('--cnpj <cnpj>', 'CNPJ da empresa')
  .option('--has-dpo', 'Indica que a empresa já possui DPO designado')
  .action(async (options) => {
    await runQuickOnboarding({
      companyName: options.company,
      email: options.email,
      cnpj: options.cnpj,
      hasDPO: Boolean(options.hasDpo),
      silent: true,
    });
    console.log('✅ Onboarding rápido concluído.');
  });

program
  .command('config:path')
  .description('Exibe caminhos ativos de configuração')
  .action(() => {
    const configPath = resolveInBase('config', 'company.json');
    const onboardingFlag = resolveInBase('.onboarding-completed');
    const existsConfig = fs.existsSync(configPath);
    const existsFlag = fs.existsSync(onboardingFlag);

    console.log(`Config file: ${configPath} ${existsConfig ? '✅' : '❌'}`);
    console.log(`Onboarding flag: ${onboardingFlag} ${existsFlag ? '✅' : '❌'}`);
  });

program.parseAsync(process.argv);
