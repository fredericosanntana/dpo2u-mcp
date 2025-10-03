import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { LeannIntegration } from "../integrations/leann.js";
import { OllamaIntegration } from "../integrations/ollama.js";
import { logger } from "../utils/logger.js";

export function registerTools(
  server: Server,
  integrations: { leann: LeannIntegration; ollama: OllamaIntegration }
) {
  logger.info("Registering DPO2U compliance tools...");

  // The actual tool registration is handled in the main index.ts file
  // This function is for future expansion and tool initialization

  logger.info("All tools registered successfully");
}