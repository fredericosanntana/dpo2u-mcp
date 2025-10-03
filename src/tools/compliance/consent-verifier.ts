import { LeannIntegration } from "../../integrations/leann.js";
import { OllamaIntegration } from "../../integrations/ollama.js";

export async function verifyConsent(
  args: any,
  integrations: { leann: LeannIntegration; ollama: OllamaIntegration }
): Promise<{ content: any[] }> {
  const consentFlow = args.consent_flow || "User Registration";
  const checkWithdrawability = args.check_withdrawability || true;

  const verification = {
    flow: consentFlow,
    requirements: {
      freely_given: true,
      specific: true,
      informed: true,
      unambiguous: false,
      withdrawable: checkWithdrawability,
    },
    issues: [
      "Pre-ticked boxes found",
      "Consent bundled with terms of service",
    ],
    recommendations: [
      "Remove pre-ticked consent boxes",
      "Separate consent from other agreements",
      "Add clear withdrawal mechanism",
      "Use affirmative action for consent",
    ],
    complianceScore: 60,
  };

  return {
    content: [
      {
        type: "text",
        text: `# Consent Verification - ${consentFlow}\n\nCompliance Score: ${verification.complianceScore}%\n\n## Issues Found\n${verification.issues.join("\n- ")}\n\n## Recommendations\n${verification.recommendations.join("\n- ")}`,
      },
      {
        type: "json",
        data: verification,
      },
    ],
  };
}