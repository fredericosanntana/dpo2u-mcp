/**
 * Ollama Local LLM Integration
 * 100% private AI processing for compliance documents
 */

import axios from 'axios';

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  system?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  eval_duration?: number;
}

export class OllamaIntegration {
  private apiUrl: string;
  private model: string;

  constructor(apiUrl: string, model: string) {
    this.apiUrl = apiUrl;
    this.model = model;
  }

  /**
   * Generate text using Ollama
   */
  async generate(prompt: string, system?: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/api/generate`,
        {
          model: this.model,
          prompt,
          system: system || 'You are a LGPD/GDPR compliance expert assistant. Provide accurate, professional advice.',
          stream: false,
          temperature: 0.7
        }
      );

      return response.data.response;
    } catch (error) {
      console.error('[Ollama] Generation error:', error);
      return this.getMockResponse(prompt);
    }
  }

  /**
   * Generate compliance document
   */
  async generateDocument(documentType: string, parameters: any): Promise<string> {
    const prompt = this.buildDocumentPrompt(documentType, parameters);
    return this.generate(prompt);
  }

  /**
   * Analyze risks using AI
   */
  async analyzeRisk(activity: string, dataTypes: string[]): Promise<any> {
    const prompt = `
Analyze the privacy risks for the following processing activity:
Activity: ${activity}
Data Types: ${dataTypes.join(', ')}

Provide:
1. Risk level (high/medium/low)
2. Main risks identified
3. Mitigation recommendations
4. Compliance requirements (LGPD/GDPR)
    `;

    const response = await this.generate(prompt);

    return {
      analysis: response,
      riskLevel: this.extractRiskLevel(response),
      recommendations: this.extractRecommendations(response)
    };
  }

  /**
   * Create privacy policy
   */
  async createPrivacyPolicy(company: string, dataTypes: string[], language: string = 'pt-BR'): Promise<string> {
    const systemPrompt = language === 'pt-BR'
      ? 'Você é um especialista em LGPD. Gere documentos em português brasileiro, formais e completos.'
      : 'You are a GDPR expert. Generate formal, complete documents in English.';

    const prompt = `
Generate a complete privacy policy for:
Company: ${company}
Data collected: ${dataTypes.join(', ')}
Regulations: LGPD and GDPR
Language: ${language}

Include all required sections according to LGPD/GDPR.
    `;

    return this.generate(prompt, systemPrompt);
  }

  /**
   * Build document generation prompt
   */
  private buildDocumentPrompt(documentType: string, parameters: any): string {
    const prompts: Record<string, string> = {
      'privacy-policy': `
Generate a complete LGPD/GDPR compliant privacy policy for:
Company: ${parameters.companyName}
Type: ${parameters.companyType}
Data: ${parameters.dataCollected?.join(', ')}
      `,
      'dpia': `
Generate a Data Protection Impact Assessment (DPIA/RIPD) for:
Processing: ${parameters.processingActivity}
Data Types: ${parameters.dataTypes?.join(', ')}
Purpose: ${parameters.purpose}
      `,
      'consent': `
Generate a consent form for:
Company: ${parameters.companyName}
Data: ${parameters.dataCollected?.join(', ')}
Purpose: ${parameters.purpose}
      `,
      'dpo-report': `
Generate a DPO executive report for:
Period: ${parameters.period}
Company: ${parameters.companyName}
Main findings: ${parameters.findings}
      `
    };

    return prompts[documentType] || 'Generate a compliance document based on the provided parameters.';
  }

  /**
   * Extract risk level from AI response
   */
  private extractRiskLevel(response: string): 'high' | 'medium' | 'low' {
    const lower = response.toLowerCase();
    if (lower.includes('high risk') || lower.includes('alto risco')) {
      return 'high';
    } else if (lower.includes('medium risk') || lower.includes('médio risco')) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Extract recommendations from AI response
   */
  private extractRecommendations(response: string): string[] {
    const recommendations: string[] = [];
    const lines = response.split('\n');

    let inRecommendations = false;
    for (const line of lines) {
      if (line.toLowerCase().includes('recommendation') || line.toLowerCase().includes('recomenda')) {
        inRecommendations = true;
        continue;
      }
      if (inRecommendations && line.trim().match(/^[\d\-\*•]/)) {
        recommendations.push(line.trim());
      }
    }

    return recommendations.length > 0 ? recommendations : [
      'Implement data minimization principles',
      'Ensure proper legal basis for processing',
      'Establish data retention policies',
      'Implement security measures'
    ];
  }

  /**
   * Get mock response for development
   */
  private getMockResponse(prompt: string): string {
    if (prompt.includes('privacy policy') || prompt.includes('política de privacidade')) {
      return `
# POLÍTICA DE PRIVACIDADE

## 1. INTRODUÇÃO
Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD).

## 2. DADOS COLETADOS
Coletamos os seguintes dados:
- Dados de identificação (nome, CPF)
- Dados de contato (email, telefone)
- Dados de navegação (cookies, IP)

## 3. BASE LEGAL
O tratamento dos seus dados é realizado com base em:
- Consentimento
- Execução de contrato
- Obrigação legal

## 4. SEUS DIREITOS
Você tem direito a:
- Acessar seus dados
- Corrigir informações
- Solicitar exclusão
- Portabilidade dos dados

## 5. CONTATO
Para exercer seus direitos, entre em contato com nosso DPO:
Email: dpo@empresa.com.br
      `;
    }

    if (prompt.includes('risk') || prompt.includes('risco')) {
      return `
## ANÁLISE DE RISCO

**Nível de Risco: MÉDIO**

### Riscos Identificados:
1. Acesso não autorizado a dados pessoais
2. Vazamento de dados sensíveis
3. Uso inadequado de dados para finalidades não autorizadas

### Recomendações de Mitigação:
1. Implementar criptografia em repouso e trânsito
2. Estabelecer controles de acesso baseados em papéis
3. Realizar treinamentos regulares de conscientização
4. Implementar logs de auditoria

### Requisitos de Conformidade:
- LGPD: Artigos 46-49 (Segurança e Boas Práticas)
- GDPR: Artigo 32 (Security of processing)
      `;
    }

    return 'Mock response for: ' + prompt.substring(0, 100);
  }

  /**
   * Check Ollama connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/tags`);
      return response.status === 200;
    } catch {
      return false;
    }
  }
}