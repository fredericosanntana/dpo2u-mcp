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

// Import integrations
import { LEANNIntegration } from './integrations/leann.js';
import { OllamaIntegration } from './integrations/ollama.js';

dotenv.config();

/**
 * Main DPO2U MCP Server Class
 */
class DPO2UMCPServer {
  private server: Server;
  private leann: LEANNIntegration;
  private ollama: OllamaIntegration;
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
   * Initialize all compliance tools
   */
  private initializeTools(): void {
    // Register all 10 compliance tools
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

    console.log(`[DPO2U] Initialized ${this.tools.size} compliance tools`);
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
    const server = new DPO2UMCPServer();
    await server.start();
  } catch (error) {
    console.error('[DPO2U] Failed to start server:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}