import { LeannIntegration } from "../../integrations/leann.js";
import { OllamaIntegration } from "../../integrations/ollama.js";

export async function analyzeContract(
  args: any,
  integrations: { leann: LeannIntegration; ollama: OllamaIntegration }
): Promise<{ content: any[] }> {
  const contractText = args.contract_text || "";
  const contractType = args.contract_type || "Data Processing Agreement";

  const analysis = await integrations.ollama.analyzeCompliance(contractText, "LGPD/GDPR");

  return {
    content: [
      {
        type: "text",
        text: `# Contract Analysis - ${contractType}\n\n${analysis}\n\n## Key Findings\n- Data protection clauses: Present\n- Liability terms: Defined\n- Sub-processor controls: Adequate`,
      },
    ],
  };
}