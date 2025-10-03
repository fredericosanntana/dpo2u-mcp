import { LeannIntegration } from "../../integrations/leann.js";
import { OllamaIntegration } from "../../integrations/ollama.js";

export async function generatePrivacyPolicy(
  args: any,
  integrations: { leann: LeannIntegration; ollama: OllamaIntegration }
): Promise<{ content: any[] }> {
  const companyName = args.company_name || "Company";
  const companyType = args.company_type || "Technology";
  const dataCollected = args.data_collected || ["Name", "Email"];
  const purposes = args.purposes || ["Service Provision"];
  const language = args.language || "pt-BR";

  const context = {
    companyName,
    companyType,
    dataCollected,
    purposes,
    language,
  };

  const policy = await integrations.ollama.generateDocument("privacy policy", context);

  const template = `
# Política de Privacidade - ${companyName}

## 1. Informações Gerais
Esta Política de Privacidade descreve como ${companyName}, empresa do setor ${companyType}, coleta, usa e protege suas informações pessoais.

## 2. Dados Coletados
Coletamos os seguintes tipos de dados:
${dataCollected.map((d: string) => `- ${d}`).join("\n")}

## 3. Finalidades do Tratamento
Utilizamos seus dados para:
${purposes.map((p: string) => `- ${p}`).join("\n")}

## 4. Base Legal
O tratamento de seus dados é baseado em:
- Consentimento
- Execução de contrato
- Interesse legítimo

## 5. Compartilhamento de Dados
Seus dados podem ser compartilhados com:
- Prestadores de serviços essenciais
- Autoridades quando exigido por lei

## 6. Seus Direitos
Você tem direito a:
- Acessar seus dados
- Corrigir informações
- Solicitar exclusão
- Portabilidade dos dados
- Revogar consentimento

## 7. Segurança
Implementamos medidas técnicas e organizacionais apropriadas para proteger seus dados.

## 8. Contato
Encarregado de Dados: dpo@${companyName.toLowerCase().replace(/\s+/g, "")}.com

${policy}
`;

  return {
    content: [
      {
        type: "text",
        text: template,
      },
    ],
  };
}