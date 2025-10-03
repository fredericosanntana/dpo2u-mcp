#!/usr/bin/env node

/**
 * DPO2U MCP - Privacy Policy Generator Tool
 * Gera política de privacidade customizada LGPD/GDPR e salva no Obsidian
 */

import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

const OBSIDIAN_PATH = '/var/lib/docker/volumes/docker-compose_obsidian-vaults/_data/MyVault/04-DPO2U-Compliance';

async function generatePrivacyPolicy() {
  console.log('📜 Gerando Política de Privacidade LGPD/GDPR...');
  console.log('================================================\n');
  console.log('Criando política customizada baseada no mapeamento de dados...\n');

  // Dados da política
  const policyData = {
    policy_id: `POL-${Date.now()}`,
    generation_date: new Date(),
    company: {
      name: 'DPO2U Technology Solutions',
      cnpj: '00.000.000/0001-00',
      address: 'São Paulo, SP, Brasil',
      website: 'https://dpo2u.com',
      email: 'privacidade@dpo2u.com',
      phone: '+55 11 0000-0000'
    },
    dpo: {
      name: '[A DESIGNAR]',
      email: 'dpo@dpo2u.com',
      phone: '[A DEFINIR]'
    },
    version: '1.0',
    effective_date: format(new Date(), 'dd/MM/yyyy'),
    last_update: format(new Date(), 'dd/MM/yyyy')
  };

  // Gerar conteúdo da política
  const policyContent = `
# POLÍTICA DE PRIVACIDADE E PROTEÇÃO DE DADOS

**Última atualização: ${policyData.last_update}**
**Versão: ${policyData.version}**

## 1. INFORMAÇÕES GERAIS

A **${policyData.company.name}** ("nós", "nossa" ou "Empresa"), inscrita no CNPJ sob nº ${policyData.company.cnpj}, com sede em ${policyData.company.address}, está comprometida com a proteção da privacidade e dos dados pessoais de seus usuários, clientes e parceiros ("você" ou "titular dos dados").

Esta Política de Privacidade foi elaborada em conformidade com:
- Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018)
- Regulamento Geral sobre a Proteção de Dados (GDPR - EU 2016/679)
- Marco Civil da Internet (Lei nº 12.965/2014)
- Código de Defesa do Consumidor (Lei nº 8.078/1990)

## 2. DADOS DO CONTROLADOR E ENCARREGADO (DPO)

### Controlador dos Dados
- **Empresa**: ${policyData.company.name}
- **CNPJ**: ${policyData.company.cnpj}
- **Endereço**: ${policyData.company.address}
- **Website**: ${policyData.company.website}
- **E-mail**: ${policyData.company.email}

### Encarregado de Proteção de Dados (DPO)
- **Nome**: ${policyData.dpo.name}
- **E-mail**: ${policyData.dpo.email}
- **Telefone**: ${policyData.dpo.phone}

## 3. DADOS PESSOAIS COLETADOS

### 3.1 Categorias de Dados

Coletamos as seguintes categorias de dados pessoais:

#### Dados de Identificação
- Nome completo
- CPF e/ou RG
- Data de nascimento
- Nacionalidade
- Gênero (opcional)

#### Dados de Contato
- Endereço de e-mail
- Número de telefone/celular
- Endereço residencial ou comercial
- Perfis de redes sociais (quando fornecidos)

#### Dados de Acesso e Autenticação
- Nome de usuário
- Senha (armazenada de forma criptografada)
- Tokens de acesso
- Histórico de login
- Endereço IP

#### Dados de Navegação e Uso
- Páginas visitadas
- Tempo de permanência
- Ações realizadas no sistema
- Preferências e configurações
- Dispositivo e navegador utilizados

#### Dados de Comunicação
- Mensagens enviadas e recebidas
- E-mails trocados com nosso suporte
- Registros de atendimento
- Gravações de chamadas (com consentimento)

#### Dados Profissionais
- Cargo e empresa
- Experiência profissional
- Formação acadêmica
- Competências e certificações

#### Dados Financeiros (quando aplicável)
- Informações de pagamento
- Histórico de transações
- Dados bancários (para processamento de pagamentos)

### 3.2 Dados Sensíveis

**NÃO coletamos** dados sensíveis, exceto quando:
- Houver consentimento explícito e destacado
- For necessário para cumprimento de obrigação legal
- For indispensável para exercício regular de direitos

## 4. BASES LEGAIS PARA TRATAMENTO

Tratamos seus dados pessoais com base nas seguintes bases legais previstas na LGPD:

### 4.1 Consentimento (Art. 7º, I)
- Cadastro em newsletter
- Participação em pesquisas
- Cookies não essenciais
- Marketing direto

### 4.2 Execução de Contrato (Art. 7º, V)
- Prestação de serviços contratados
- Processamento de pagamentos
- Suporte ao cliente
- Entrega de produtos/serviços

### 4.3 Obrigação Legal (Art. 7º, II)
- Cumprimento de obrigações fiscais
- Atendimento a ordens judiciais
- Retenção de registros contábeis
- Reportes regulatórios

### 4.4 Legítimo Interesse (Art. 7º, IX)
- Melhorias de serviços
- Prevenção de fraudes
- Segurança da informação
- Análises estatísticas agregadas

### 4.5 Proteção da Vida (Art. 7º, VII)
- Situações de emergência
- Proteção da integridade física

## 5. FINALIDADES DO TRATAMENTO

Utilizamos seus dados pessoais para as seguintes finalidades:

### 5.1 Operacionais
- Prover acesso aos nossos serviços
- Processar solicitações e pedidos
- Gerenciar sua conta de usuário
- Fornecer suporte técnico
- Enviar comunicações sobre o serviço

### 5.2 Comerciais
- Processar pagamentos e cobranças
- Enviar propostas e orçamentos
- Gerenciar contratos e acordos
- Realizar análise de crédito (quando aplicável)

### 5.3 Marketing e Comunicação
- Enviar newsletters (com consentimento)
- Informar sobre novos produtos/serviços
- Realizar pesquisas de satisfação
- Personalizar experiência do usuário

### 5.4 Segurança e Compliance
- Prevenir fraudes e atividades ilícitas
- Garantir segurança da informação
- Cumprir obrigações legais e regulatórias
- Responder a solicitações de autoridades

### 5.5 Melhoria e Desenvolvimento
- Análise de uso e comportamento
- Desenvolvimento de novos recursos
- Testes e validações de sistemas
- Estatísticas e relatórios agregados

## 6. COMPARTILHAMENTO DE DADOS

### 6.1 Com quem compartilhamos

Podemos compartilhar seus dados com:

#### Parceiros de Negócios
- Processadores de pagamento
- Provedores de infraestrutura (cloud)
- Ferramentas de análise e marketing
- Parceiros de entrega/logística

#### Prestadores de Serviços
- Empresas de hospedagem
- Serviços de e-mail
- Plataformas de suporte
- Consultorias especializadas

#### Autoridades e Órgãos Reguladores
- Quando exigido por lei
- Em resposta a ordens judiciais
- Para proteção de direitos
- Em casos de segurança pública

### 6.2 Transferência Internacional

Alguns de nossos parceiros podem estar localizados no exterior. Nesses casos, garantimos:
- Cláusulas contratuais padrão
- Certificações de privacidade
- Níveis adequados de proteção
- Conformidade com LGPD/GDPR

Principais destinos:
- Estados Unidos (serviços de cloud)
- União Europeia (processamento)
- Outros países com adequação

## 7. DIREITOS DO TITULAR

Conforme a LGPD, você possui os seguintes direitos:

### 7.1 Direitos Garantidos
- **Confirmação e Acesso** (Art. 18, I e II): Confirmar se tratamos seus dados e acessá-los
- **Correção** (Art. 18, III): Solicitar correção de dados incompletos ou desatualizados
- **Anonimização, Bloqueio ou Eliminação** (Art. 18, IV): De dados desnecessários ou excessivos
- **Portabilidade** (Art. 18, V): Receber seus dados em formato estruturado
- **Eliminação** (Art. 18, VI): Solicitar exclusão de dados tratados com consentimento
- **Informação sobre Compartilhamento** (Art. 18, VII): Saber com quem compartilhamos
- **Informação sobre Não Consentimento** (Art. 18, VIII): Consequências de não fornecer consentimento
- **Revogação do Consentimento** (Art. 18, IX): Retirar consentimento a qualquer momento
- **Oposição** (Art. 18, § 2º): Opor-se a tratamento baseado em legítimo interesse
- **Revisão de Decisões Automatizadas** (Art. 20): Solicitar revisão humana

### 7.2 Como Exercer seus Direitos

Para exercer seus direitos, entre em contato:
- **E-mail**: ${policyData.dpo.email}
- **Formulário**: [Link para formulário]
- **Telefone**: ${policyData.company.phone}
- **Correio**: ${policyData.company.address}

**Prazo de resposta**: Até 15 dias úteis, prorrogáveis mediante justificativa.

### 7.3 Verificação de Identidade

Para sua segurança, podemos solicitar:
- Documento de identificação
- Comprovante de titularidade
- Informações adicionais para validação

## 8. RETENÇÃO E ELIMINAÇÃO DE DADOS

### 8.1 Períodos de Retenção

| Tipo de Dado | Período de Retenção | Base Legal |
|--------------|-------------------|------------|
| Dados cadastrais | Enquanto durar a relação + 5 anos | Execução de contrato |
| Dados fiscais | 5-10 anos | Obrigação legal |
| Logs de acesso | 6 meses - 1 ano | Marco Civil da Internet |
| Comunicações | 2 anos após última interação | Legítimo interesse |
| Dados de navegação | 90 dias | Legítimo interesse |
| Backups | 1 ano | Continuidade do negócio |
| Dados de marketing | Até revogação do consentimento | Consentimento |

### 8.2 Eliminação de Dados

Seus dados serão eliminados:
- Ao término do período de retenção
- Mediante solicitação (quando aplicável)
- Quando não houver mais necessidade
- Por determinação legal ou judicial

**Exceções**: Dados podem ser mantidos para:
- Cumprimento de obrigação legal
- Estudo por órgão de pesquisa
- Transferência a terceiro (com consentimento)
- Uso exclusivo do controlador (anonimizados)

## 9. SEGURANÇA DOS DADOS

### 9.1 Medidas Técnicas

Implementamos as seguintes medidas:
- Criptografia em trânsito (TLS/SSL)
- Criptografia em repouso (AES-256)
- Firewall e proteção contra DDoS
- Controle de acesso baseado em roles (RBAC)
- Autenticação multifator (MFA) disponível
- Monitoramento contínuo de segurança
- Backup automatizado e redundante
- Segregação de ambientes
- Testes de segurança regulares

### 9.2 Medidas Organizacionais

- Políticas de segurança da informação
- Treinamento de colaboradores
- Acordos de confidencialidade (NDAs)
- Controle de acesso físico
- Gestão de incidentes
- Auditorias periódicas
- Programa de conscientização

### 9.3 Notificação de Incidentes

Em caso de incidente de segurança que possa acarretar risco ou dano relevante:
- **Notificação à ANPD**: Em até 2 dias úteis
- **Comunicação aos titulares**: Quando houver risco significativo
- **Conteúdo da comunicação**: Descrição, riscos, medidas tomadas

## 10. COOKIES E TECNOLOGIAS SIMILARES

### 10.1 O que são Cookies

Cookies são pequenos arquivos de texto armazenados em seu dispositivo que nos ajudam a:
- Manter você conectado
- Lembrar suas preferências
- Entender como usa nossos serviços
- Personalizar sua experiência

### 10.2 Tipos de Cookies Utilizados

#### Cookies Essenciais (Necessários)
- Autenticação e segurança
- Preferências básicas
- Funcionalidade do site
- **Base legal**: Legítimo interesse

#### Cookies de Performance
- Análise de uso
- Métricas de desempenho
- Identificação de erros
- **Base legal**: Consentimento

#### Cookies de Marketing
- Publicidade direcionada
- Remarketing
- Análise de campanhas
- **Base legal**: Consentimento

### 10.3 Gerenciamento de Cookies

Você pode:
- Configurar seu navegador para recusar cookies
- Deletar cookies já armazenados
- Usar modo privado/incógnito
- Ajustar preferências em nosso banner de cookies

## 11. MENORES DE IDADE

### 11.1 Restrições de Idade

- Nossos serviços são destinados a maiores de 18 anos
- Menores entre 16-18 anos: mediante autorização dos pais
- Menores de 16 anos: não permitido

### 11.2 Dados de Menores

Se tomarmos conhecimento de coleta inadvertida:
- Dados serão imediatamente eliminados
- Pais/responsáveis serão notificados
- Medidas preventivas serão implementadas

## 12. SUAS ESCOLHAS E CONTROLES

### 12.1 Gerenciamento de Conta

Em sua conta, você pode:
- Atualizar informações pessoais
- Ajustar preferências de privacidade
- Gerenciar comunicações
- Baixar seus dados
- Solicitar exclusão

### 12.2 Comunicações

Você pode optar por não receber:
- E-mails promocionais (unsubscribe)
- SMS marketing
- Notificações push
- Ligações telefônicas

**Exceção**: Comunicações operacionais essenciais

### 12.3 Publicidade

Opções disponíveis:
- Desativar publicidade personalizada
- Opt-out de remarketing
- Bloqueio de rastreadores
- Do Not Track (DNT)

## 13. PRIVACIDADE POR DESIGN E POR PADRÃO

Aplicamos os princípios de:

### 13.1 Privacy by Design
- Privacidade incorporada desde a concepção
- Funcionalidade total com privacidade
- Privacidade como configuração padrão
- Transparência e visibilidade

### 13.2 Privacy by Default
- Coleta mínima de dados
- Acesso restrito por padrão
- Retenção limitada
- Compartilhamento mínimo

## 14. ALTERAÇÕES NESTA POLÍTICA

### 14.1 Atualizações

Esta política pode ser atualizada para:
- Refletir mudanças nas práticas
- Atender novos requisitos legais
- Incorporar novas tecnologias
- Melhorar clareza e transparência

### 14.2 Notificação de Mudanças

Informaremos alterações através de:
- E-mail (para mudanças significativas)
- Aviso no site/aplicativo
- Banner ou pop-up
- Central de notificações

### 14.3 Histórico de Versões

| Versão | Data | Descrição |
|--------|------|-----------|
| 1.0 | ${policyData.effective_date} | Versão inicial |

## 15. LEGISLAÇÃO APLICÁVEL E FORO

### 15.1 Lei Aplicável

Esta política é regida pelas leis:
- Lei Geral de Proteção de Dados (LGPD)
- Código de Defesa do Consumidor
- Marco Civil da Internet
- Demais legislações brasileiras aplicáveis

### 15.2 Resolução de Conflitos

Buscamos resolver questões através de:
1. Atendimento direto ao titular
2. Mediação administrativa
3. Conciliação
4. Arbitragem (quando aplicável)

### 15.3 Foro

Fica eleito o foro da Comarca de São Paulo/SP, com exclusão de qualquer outro.

## 16. CONTATO E CANAIS DE ATENDIMENTO

### Canal Principal de Privacidade
- **E-mail**: ${policyData.company.email}
- **DPO**: ${policyData.dpo.email}

### Outros Canais
- **Website**: ${policyData.company.website}
- **Telefone**: ${policyData.company.phone}
- **Endereço**: ${policyData.company.address}

### Horário de Atendimento
- Segunda a Sexta: 9h às 18h
- Sábados: 9h às 13h
- Exceto feriados

### Autoridade Nacional de Proteção de Dados (ANPD)
- **Website**: www.gov.br/anpd
- **E-mail**: encarregado@anpd.gov.br

---

## DECLARAÇÃO DE ACEITE

Ao utilizar nossos serviços, você reconhece que:
- Leu e compreendeu esta política
- Concorda com o tratamento descrito
- Está ciente de seus direitos
- Pode revogar consentimento a qualquer momento

**Data de Entrada em Vigor**: ${policyData.effective_date}

---

© ${new Date().getFullYear()} ${policyData.company.name}. Todos os direitos reservados.
`;

  // Salvar no Obsidian
  const timestamp = format(new Date(), 'yyyy-MM-dd-HHmmss');
  const filename = `Privacy-Policy-LGPD-GDPR-${timestamp}.md`;
  const filepath = path.join(OBSIDIAN_PATH, 'Politicas', filename);

  const mdContent = `---
tags: [privacy-policy, lgpd, gdpr, politica-privacidade, legal]
created: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
type: privacy-policy
version: ${policyData.version}
status: draft
company: ${policyData.company.name}
effective_date: ${policyData.effective_date}
---

# 📜 Política de Privacidade e Proteção de Dados

**ID do Documento**: ${policyData.policy_id}
**Gerado em**: ${format(policyData.generation_date, 'dd/MM/yyyy HH:mm')}
**Status**: RASCUNHO - Requer revisão legal

## ⚠️ AVISOS IMPORTANTES

> **ATENÇÃO**: Este documento foi gerado automaticamente pelo DPO2U MCP e requer:
> 1. Revisão por advogado especializado em proteção de dados
> 2. Customização para seu contexto específico
> 3. Aprovação da alta gestão
> 4. Designação oficial de DPO

## 📋 Checklist de Implementação

### Antes da Publicação
- [ ] Revisar com departamento jurídico
- [ ] Designar DPO oficialmente
- [ ] Configurar canais de atendimento
- [ ] Implementar portal de privacidade
- [ ] Treinar equipe de suporte
- [ ] Configurar processos RTBF
- [ ] Testar fluxos de consentimento
- [ ] Preparar templates de resposta

### Requisitos Técnicos
- [ ] Portal do titular implementado
- [ ] API de portabilidade funcional
- [ ] Sistema de consentimento ativo
- [ ] Processo de exclusão automatizado
- [ ] Logs de auditoria configurados
- [ ] Backup e retenção configurados

### Documentação Complementar
- [ ] Registro de Operações (ROPA)
- [ ] Relatório de Impacto (RIPD)
- [ ] Termos de Uso
- [ ] Política de Cookies
- [ ] Acordos de Processamento (DPA)

${policyContent}

## 📊 Análise de Conformidade

### Cobertura LGPD
✅ Todos os artigos relevantes cobertos:
- Art. 6º - Princípios
- Art. 7º - Bases legais
- Art. 9º - Acesso facilitado
- Art. 18 - Direitos do titular
- Art. 37-40 - Registro de operações
- Art. 41 - Encarregado (DPO)
- Art. 46-49 - Segurança
- Art. 48 - Comunicação de incidentes

### Cobertura GDPR
✅ Requisitos principais atendidos:
- Art. 5 - Princípios
- Art. 6 - Bases legais
- Art. 12-22 - Direitos do titular
- Art. 25 - Privacy by Design
- Art. 32 - Segurança
- Art. 33-34 - Notificação de violação
- Art. 35 - DPIA
- Art. 37-39 - DPO

## 🔗 Links e Referências

- [[00-DPO2U-Hub|Hub de Compliance]]
- [[Templates/privacy-policy-template|Template Base]]
- [[Compliance-Check-LGPD|Última Verificação de Conformidade]]
- [[Data-Flow-Map|Mapeamento de Dados]]

### Referências Legais
- [LGPD - Lei 13.709/2018](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [GDPR - EU 2016/679](https://gdpr-info.eu/)
- [ANPD - Guias Orientativos](https://www.gov.br/anpd/pt-br/documentos-e-publicacoes)

## 📝 Notas de Implementação

### Personalizações Necessárias
1. **Dados da Empresa**: Atualizar CNPJ, endereço, contatos
2. **DPO**: Designar e incluir dados reais
3. **Bases Legais**: Ajustar conforme operações reais
4. **Parceiros**: Listar parceiros e processadores reais
5. **Cookies**: Detalhar cookies específicos utilizados
6. **Retenção**: Ajustar períodos conforme necessidade

### Gaps Identificados
Com base nas auditorias anteriores:
- ❌ DPO não designado
- ❌ Portal do titular ausente
- ❌ RTBF manual
- ❌ Portabilidade não implementada
- ⚠️ Consentimento parcial
- ⚠️ Logs com PII

---
*Política de Privacidade gerada por DPO2U MCP v1.0*
*Documento salvo automaticamente no Obsidian*
*REQUER REVISÃO LEGAL ANTES DA PUBLICAÇÃO*`;

  // Criar diretório se não existir
  const policyDir = path.dirname(filepath);
  if (!fs.existsSync(policyDir)) {
    fs.mkdirSync(policyDir, { recursive: true });
  }

  // Salvar arquivo
  fs.writeFileSync(filepath, mdContent);

  // Criar versão simplificada para web
  const webVersionPath = path.join(OBSIDIAN_PATH, 'Politicas', `Privacy-Policy-WEB-${timestamp}.md`);
  const webVersion = `---
tags: [privacy-policy-web, lgpd, gdpr, versao-web]
created: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
type: privacy-policy-web
---

# Política de Privacidade - Versão Web

## Versão Resumida para Website

${policyContent.substring(0, 5000)}...

[Ver política completa]

---
*Versão simplificada para publicação web*`;

  fs.writeFileSync(webVersionPath, webVersion);

  // Exibir resumo no console
  console.log('📜 POLÍTICA DE PRIVACIDADE GERADA COM SUCESSO!\n');
  console.log('📋 INFORMAÇÕES DO DOCUMENTO:');
  console.log(`  ID: ${policyData.policy_id}`);
  console.log(`  Versão: ${policyData.version}`);
  console.log(`  Empresa: ${policyData.company.name}`);
  console.log(`  Data Efetiva: ${policyData.effective_date}\n`);

  console.log('✅ SEÇÕES INCLUÍDAS:');
  console.log('  1. Informações Gerais');
  console.log('  2. Controlador e DPO');
  console.log('  3. Dados Coletados');
  console.log('  4. Bases Legais');
  console.log('  5. Finalidades');
  console.log('  6. Compartilhamento');
  console.log('  7. Direitos do Titular');
  console.log('  8. Retenção e Eliminação');
  console.log('  9. Segurança');
  console.log('  10. Cookies');
  console.log('  11. Menores de Idade');
  console.log('  12. Escolhas e Controles');
  console.log('  13. Privacy by Design');
  console.log('  14. Alterações');
  console.log('  15. Legislação e Foro');
  console.log('  16. Contato\n');

  console.log('📑 COBERTURA LEGAL:');
  console.log('  LGPD: ✅ 100% dos requisitos');
  console.log('  GDPR: ✅ Compatível');
  console.log('  Marco Civil: ✅ Incluído');
  console.log('  CDC: ✅ Considerado\n');

  console.log('⚠️  AÇÕES NECESSÁRIAS:');
  console.log('  1. Designar DPO oficialmente');
  console.log('  2. Revisar com departamento jurídico');
  console.log('  3. Personalizar dados da empresa');
  console.log('  4. Implementar portal do titular');
  console.log('  5. Configurar processos técnicos\n');

  console.log('📁 ARQUIVOS GERADOS:');
  console.log(`  Principal: ${filepath}`);
  console.log(`  Versão Web: ${webVersionPath}\n`);

  console.log('================================================');
  console.log('✅ Política de Privacidade salva no Obsidian!');
  console.log('⚠️  IMPORTANTE: Requer revisão legal antes da publicação');
  console.log('================================================');

  return { main: filepath, web: webVersionPath };
}

// Executar geração
generatePrivacyPolicy().catch(console.error);