import { LEANNIntegration } from '../integrations/leann.js';
import { OllamaIntegration } from '../integrations/ollama.js';
import { OpenFHEIntegration } from '../integrations/openfhe.js';
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
  CalculatePrivacyScoreTool,
} from '../tools/auditInfrastructure.js';
import {
  EncryptedReportingTool,
  PrivateBenchmarkTool,
  ZKComplianceTool,
  FHEExecutiveDashboardTool,
  HomomorphicAnalyticsTool,
  SecureDataSharingTool,
  ComplianceRemediationTool,
} from '../tools/fheTools.js';
import { requireSecret } from './secrets.js';

export interface ToolInstance {
  getDescription(): string;
  getInputSchema(): any;
  execute(args: any): Promise<any>;
}

export interface ServiceContext {
  leann: LEANNIntegration;
  ollama: OllamaIntegration;
  openfhe: OpenFHEIntegration;
  tools: Map<string, ToolInstance>;
}

export function createServiceContext(): ServiceContext {
  const leannApiUrl = process.env.LEANN_API_URL || 'http://localhost:3001';
  const leannApiKey = requireSecret('LEANN_API_KEY', 'LEANN_API_KEY obrigatório para integrar com o LEANN API');

  const ollamaApiUrl = process.env.OLLAMA_API_URL || 'http://127.0.0.1:11434';
  const ollamaModel = process.env.OLLAMA_MODEL || 'qwen2.5:3b-instruct';

  const leann = new LEANNIntegration(leannApiUrl, leannApiKey);
  const ollama = new OllamaIntegration(ollamaApiUrl, ollamaModel);
  const openfhe = new OpenFHEIntegration();

  const tools = registerTools({ leann, ollama, openfhe });

  return {
    leann,
    ollama,
    openfhe,
    tools,
  };
}

function registerTools(context: {
  leann: LEANNIntegration;
  ollama: OllamaIntegration;
  openfhe: OpenFHEIntegration;
}): Map<string, ToolInstance> {
  const tools = new Map<string, ToolInstance>();

  tools.set('auditinfrastructure', new AuditInfrastructureTool(context.leann, context.ollama));
  tools.set('checkcompliance', new CheckComplianceTool(context.leann, context.ollama));
  tools.set('assessrisk', new AssessRiskTool(context.leann, context.ollama));
  tools.set('mapdataflow', new MapDataFlowTool(context.leann));
  tools.set('generateprivacypolicy', new GeneratePrivacyPolicyTool(context.leann, context.ollama));
  tools.set('createdporeport', new CreateDPOReportTool(context.leann, context.ollama));
  tools.set('analyzecontract', new AnalyzeContractTool(context.leann, context.ollama));
  tools.set('simulatebreach', new SimulateBreachTool(context.leann));
  tools.set('verifyconsent', new VerifyConsentTool(context.leann));
  tools.set('calculateprivacyscore', new CalculatePrivacyScoreTool(context.leann));

  tools.set('encryptedreporting', new EncryptedReportingTool(context.leann, context.ollama, context.openfhe));
  tools.set('privatebenchmark', new PrivateBenchmarkTool(context.leann, context.ollama, context.openfhe));
  tools.set('zkcomplianceproof', new ZKComplianceTool(context.leann, context.ollama, context.openfhe));
  tools.set('fheexecutivedashboard', new FHEExecutiveDashboardTool(context.leann, context.ollama, context.openfhe));
  tools.set('homomorphicanalytics', new HomomorphicAnalyticsTool(context.leann, context.ollama, context.openfhe));
  tools.set('securedatasharing', new SecureDataSharingTool(context.leann, context.ollama, context.openfhe));
  tools.set('automatedremediation', new ComplianceRemediationTool(context.leann, context.ollama, context.openfhe));

  return tools;
}

export function listTools(context: ServiceContext): Array<{ name: string; description: string; inputSchema: any }> {
  return Array.from(context.tools.entries()).map(([name, tool]) => ({
    name,
    description: tool.getDescription(),
    inputSchema: tool.getInputSchema(),
  }));
}
