#!/usr/bin/env node
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ensureOnboardingCompleted } from './core/onboarding.js';
import { createServiceContext, listTools } from './core/serviceContext.js';
import { getSecret } from './core/secrets.js';

dotenv.config();

export async function startHttpServer(): Promise<void> {
  await ensureOnboardingCompleted();

  const context = createServiceContext();
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  const apiKey = getSecret('DPO2U_HTTP_API_KEY');
  if (apiKey) {
    app.use((req, res, next) => {
      const providedKey = req.headers['x-api-key'];
      if (providedKey !== apiKey) {
        res.status(401).json({ error: 'API key inválida ou ausente.' });
        return;
      }
      return next();
    });
  }

  app.get('/health', (req, res) => {
    return res.json({ status: 'ok', tools: context.tools.size, timestamp: new Date().toISOString() });
  });

  app.get('/tools', (req, res) => {
    return res.json({ tools: listTools(context) });
  });

  app.post('/tools/:name/execute', async (req, res) => {
    const name = req.params.name;
    const tool = context.tools.get(name);

    if (!tool) {
      res.status(404).json({ error: `Tool "${name}" não encontrada.` });
      return;
    }

    try {
      const result = await tool.execute(req.body?.arguments || {});
      return res.json({ success: true, result });
    } catch (error: any) {
      console.error(`[DPO2U][HTTP] Tool ${name} error:`, error);
      return res.status(500).json({
        success: false,
        error: error?.message || 'Falha ao executar ferramenta',
      });
    }
  });

  const port = Number(process.env.DPO2U_HTTP_PORT || 4000);
  app.listen(port, () => {
    console.log(`[DPO2U][HTTP] API disponível em http://localhost:${port}`);
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startHttpServer().catch((error) => {
    console.error('[DPO2U][HTTP] Falha ao iniciar servidor HTTP:', error);
    process.exit(1);
  });
}
