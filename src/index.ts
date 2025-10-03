#!/usr/bin/env node
import dotenv from 'dotenv';
import { ensureOnboardingCompleted } from './core/onboarding.js';
import { createServiceContext } from './core/serviceContext.js';
import { DPO2UMCPServer } from './server/mcpServer.js';

dotenv.config();

async function main(): Promise<void> {
  console.log('='.repeat(60));
  console.log('DPO2U MCP Platform - AI Compliance Engine v1.0');
  console.log('First MCP-native LGPD/GDPR compliance solution');
  console.log('='.repeat(60));

  try {
    await ensureOnboardingCompleted();
    const context = createServiceContext();
    const server = new DPO2UMCPServer(context);
    await server.start();
  } catch (error) {
    console.error('[DPO2U] Failed to start server:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
