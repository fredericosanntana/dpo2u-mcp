import { logger } from "./logger.js";

const resources: Record<string, any> = {
  "dpo2u://knowledge/lgpd": {
    title: "LGPD Knowledge Base",
    regulations: {
      principles: [
        "Finalidade",
        "Adequação",
        "Necessidade",
        "Livre Acesso",
        "Qualidade dos Dados",
        "Transparência",
        "Segurança",
        "Prevenção",
        "Não Discriminação",
        "Responsabilização",
      ],
      rights: [
        "Confirmação da existência de tratamento",
        "Acesso aos dados",
        "Correção de dados incompletos",
        "Anonimização ou eliminação",
        "Portabilidade",
        "Eliminação dos dados pessoais",
        "Informação sobre compartilhamento",
        "Informação sobre não consentimento",
        "Revogação do consentimento",
      ],
      legal_bases: [
        "Consentimento",
        "Cumprimento de obrigação legal",
        "Execução de políticas públicas",
        "Estudos por órgão de pesquisa",
        "Execução de contrato",
        "Exercício regular de direitos",
        "Proteção da vida",
        "Tutela da saúde",
        "Interesse legítimo",
        "Proteção de crédito",
      ],
    },
  },
  "dpo2u://knowledge/gdpr": {
    title: "GDPR Knowledge Base",
    regulations: {
      principles: [
        "Lawfulness, fairness and transparency",
        "Purpose limitation",
        "Data minimisation",
        "Accuracy",
        "Storage limitation",
        "Integrity and confidentiality",
        "Accountability",
      ],
      rights: [
        "Right to be informed",
        "Right of access",
        "Right to rectification",
        "Right to erasure",
        "Right to restrict processing",
        "Right to data portability",
        "Right to object",
        "Rights related to automated decision making",
      ],
      legal_bases: [
        "Consent",
        "Contract",
        "Legal obligation",
        "Vital interests",
        "Public task",
        "Legitimate interests",
      ],
    },
  },
  "dpo2u://templates/privacy": {
    title: "Privacy Document Templates",
    templates: [
      {
        name: "Privacy Policy",
        sections: [
          "Data Controller Information",
          "Types of Data Collected",
          "Purpose of Processing",
          "Legal Basis",
          "Data Sharing",
          "Data Retention",
          "User Rights",
          "Security Measures",
          "Contact Information",
        ],
      },
      {
        name: "Cookie Policy",
        sections: [
          "What are cookies",
          "Types of cookies used",
          "Purpose of cookies",
          "Managing cookies",
          "Third-party cookies",
        ],
      },
      {
        name: "Data Processing Agreement",
        sections: [
          "Parties",
          "Definitions",
          "Processing details",
          "Obligations",
          "Security measures",
          "Sub-processing",
          "Liability",
          "Termination",
        ],
      },
    ],
  },
  "dpo2u://compliance/checklist": {
    title: "Compliance Checklists",
    checklists: {
      lgpd_initial: [
        "Nomear Encarregado (DPO)",
        "Mapear dados pessoais",
        "Identificar bases legais",
        "Atualizar política de privacidade",
        "Implementar direitos dos titulares",
        "Criar registro de atividades",
        "Implementar segurança adequada",
        "Preparar resposta a incidentes",
        "Treinar colaboradores",
        "Documentar conformidade",
      ],
      gdpr_initial: [
        "Appoint Data Protection Officer",
        "Conduct data audit",
        "Update privacy notices",
        "Implement consent mechanisms",
        "Enable data subject rights",
        "Conduct DPIAs where required",
        "Implement security measures",
        "Prepare breach response plan",
        "Train staff",
        "Document compliance",
      ],
    },
  },
};

export async function getResource(uri: string): Promise<any> {
  logger.info(`Fetching resource: ${uri}`);

  if (resources[uri]) {
    return resources[uri];
  }

  throw new Error(`Resource not found: ${uri}`);
}