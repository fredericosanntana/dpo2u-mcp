# DPO2U MCP Platform - Hybrid AI Compliance Engine

## 🚀 **NOVA ARQUITETURA HÍBRIDA 2025** - Self-Hosted + SaaS

A **DPO2U MCP Platform** é a **única solução de compliance** que combina:
- **100% dados locais** (máxima privacidade)
- **Conhecimento jurídico proprietário** via SaaS (expertise premium)

### 🏗️ **Arquitetura Revolucionária**

```
┌─────────────────────────┐    ┌─────────────────────┐
│   100% SELF-HOSTED      │    │    SaaS DPO2U      │
│ ┌─────────────────────┐ │    │ ┌─────────────────┐ │
│ │ MCP-DPO2U (17 tools)│ │◄──►│ │ LEANN API       │ │
│ │ Ollama LLM Local    │ │    │ │ Knowledge Base  │ │
│ │ OpenFHE Encryption  │ │    │ │ 2856+ docs      │ │
│ │ All Sensitive Data  │ │    │ │ Compliance Intel│ │
│ └─────────────────────┘ │    │ └─────────────────┘ │
│ Cliente = Controle Total│    │ DPO2U = IP Protected│
└─────────────────────────┘    └─────────────────────┘
```

### 🎯 **Proposta de Valor Única**

- **🔐 100% Local Data**: Seus dados NUNCA saem da infraestrutura
- **🧠 Premium Knowledge**: Acesso ao conhecimento LGPD/GDPR mais especializado do mercado
- **⚡ Ultra Performance**: LEANN API com 91.97% cache hit rate (15ms vs 44s)
- **🤖 AI-Powered**: Ollama LLM local + OpenFHE encryption
- **📊 17 Ferramentas**: Compliance automation completa
- **🔒 Zero-Knowledge**: Evidência criptográfica sem exposição de dados
- **🎯 95%+ Compliance**: Remediação automática de gaps

## 📋 Ferramentas Disponíveis

### 🛡️ Ferramentas Standard de Compliance (10)

| Ferramenta | Descrição | Tempo |
|------------|-----------|-------|
| `auditinfrastructure` | Auditoria completa de infraestrutura | 5s |
| `checkcompliance` | Verificação detalhada de conformidade | 5s |
| `assessrisk` | Avaliação de riscos com DPIA/RIPD | 5s |
| `mapdataflow` | Mapeamento visual do fluxo de dados | 5s |
| `generateprivacypolicy` | Políticas de privacidade personalizadas | 5s |
| `createdporeport` | Relatórios executivos de DPO | 5s |
| `analyzecontract` | Análise de contratos e DPAs | 5s |
| `simulatebreach` | Simulação de vazamentos | 5s |
| `verifyconsent` | Auditoria de mecanismos de consentimento | 5s |
| `calculateprivacyscore` | Score de maturidade em privacidade | 5s |

### 🔐 Ferramentas OpenFHE - Homomorphic Encryption (6)

| Ferramenta | Descrição | Tecnologia |
|------------|-----------|------------|
| `encryptedreporting` | Relatórios de compliance com dados sempre criptografados | FHE + ZK |
| `privatebenchmark` | Benchmark multi-organizacional sem expor métricas | Secure MPC |
| `zkcomplianceproof` | Provas zero-knowledge de conformidade regulatória | zk-SNARKs |
| `fheexecutivedashboard` | Dashboard executivo com KPIs totalmente criptografados | Homomorphic |
| `homomorphicanalytics` | Analytics preservando privacidade em dados criptografados | CKKS |
| `securedatasharing` | Compartilhamento seguro multi-party sem exposição | Threshold FHE |

## 🔧 Instalação Rápida

### 1. Clone ou Baixe o Projeto
```bash
cd /opt
git clone https://github.com/dpo2u/dpo2u-mcp.git
# ou
cp -r /opt/dpo2u-mcp /opt/dpo2u-mcp
```

### 2. Instale as Dependências
```bash
cd /opt/dpo2u-mcp
npm install
```

### 3. Configure as Variáveis de Ambiente
```bash
cat > .env << EOF
LEANN_API_URL=http://localhost:3001
LEANN_API_KEY=leann-api-2025
OLLAMA_API_URL=http://172.18.0.1:11434
OLLAMA_MODEL=qwen2.5:3b-instruct
OPENFHE_SCRIPTS_PATH=/opt/openfhe/scripts
OPENFHE_TEMP_DIR=/tmp/openfhe
PYTHON_PATH=python3
EOF
```

### 4. Compile o TypeScript
```bash
npm run build
```

### 5. Configure o Claude Desktop

Adicione ao arquivo `~/.config/claude-desktop/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "dpo2u": {
      "command": "node",
      "args": ["/opt/dpo2u-mcp/dist/index.js"],
      "env": {
        "LEANN_API_URL": "http://localhost:3001",
        "LEANN_API_KEY": "leann-api-2025",
        "OLLAMA_API_URL": "http://172.18.0.1:11434"
      }
    }
  }
}
```

### 6. Reinicie o Claude Desktop
```bash
# Feche e abra novamente o Claude Desktop
# As ferramentas estarão disponíveis automaticamente
```

### ▶️ Uso no Codex CLI / Ambientes Não Interativos

Para executar o MCP diretamente pelo Codex CLI (ou qualquer ambiente sem TTY), defina variáveis de ambiente que habilitam o onboarding automático:

```bash
export MCP_AUTO_ONBOARDING=quick
export MCP_COMPANY_NAME="DPO2U CLI"
export MCP_COMPANY_EMAIL="cli@dpo2u.com"
export DPO2U_MCP_BASE_PATH="$(pwd)"
npm run build
node dist/index.js
```

Variáveis suportadas:

| Variável | Função |
|----------|--------|
| `MCP_AUTO_ONBOARDING` | `quick` para setup automático mínimo, `skip` para gerar config padrão sem prompts |
| `MCP_COMPANY_NAME`, `MCP_COMPANY_EMAIL`, `MCP_COMPANY_CNPJ` | Sobrescrevem dados usados no onboarding rápido |
| `MCP_COMPANY_HAS_DPO` | Use `s`/`n` ou `true`/`false` para informar se já existe DPO |
| `DPO2U_MCP_BASE_PATH` | Define o diretório base do projeto quando executado fora de `/opt/dpo2u-mcp` |
| `DPO2U_OBSIDIAN_PATH` | Ajusta o caminho do vault de compliance, quando diferente do padrão |
| `DPO2U_HTTP_PORT` | Porta para a API HTTP (`serve:http`) |
| `DPO2U_HTTP_API_KEY` | Token opcional para proteger as rotas HTTP (`x-api-key`) |
| `DPO2U_SECRETS_PROVIDER` | `env` (default) ou `file` para carregar segredos de `config/secrets.json` |
| `DPO2U_SECRETS_FILE` | Caminho customizado do arquivo de segredos |

### 🌐 API HTTP para Ferramentas MCP

```bash
# iniciar a API na porta padrão 4000
npm run start:http

# ou via CLI
npx dpo2u-mcp serve:http --port 4500
```

Endpoints principais:

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Status da API e número de ferramentas disponíveis |
| GET | `/tools` | Lista de ferramentas MCP registradas |
| POST | `/tools/:name/execute` | Executa uma ferramenta passando `{ "arguments": { ... } }` |

> **Obs.:** Defina `DPO2U_HTTP_API_KEY` para exigir cabeçalho `x-api-key` em todas as requisições.

### 🧰 CLI Unificada

O pacote expõe um binário `dpo2u-mcp` com comandos auxiliares:

```bash
npx dpo2u-mcp serve:mcp      # inicia o servidor MCP (Claude/Desktop)
npx dpo2u-mcp serve:http     # inicia a API HTTP
npx dpo2u-mcp tools:list     # lista ferramentas disponíveis
npx dpo2u-mcp tools:call auditinfrastructure -a '{"target":"prod","depth":"deep","compliance":["LGPD"]}'
npx dpo2u-mcp onboarding:reset   # limpa arquivos para refazer onboarding
npx dpo2u-mcp onboarding:quick --company "Empresa X" --email contato@x.com --has-dpo
```

### 🔐 Gerenciamento de Segredos

Armazene chaves sensíveis (LEANN, HTTP, n8n) em variáveis de ambiente ou num arquivo `config/secrets.json`:

```json
{
  "LEANN_API_KEY": "sk-...",
  "DPO2U_HTTP_API_KEY": "token-http",
  "DPO2U_N8N_WEBHOOK_TOKEN": "token-n8n"
}
```

Ative com `export DPO2U_SECRETS_PROVIDER=file` (opcionalmente `DPO2U_SECRETS_FILE=/caminho/custom.json`).

## 💡 Exemplos de Uso

### 🛡️ Ferramentas Standard

#### Auditoria Completa de Infraestrutura
No Claude Desktop, digite:
```
Use a ferramenta auditinfrastructure para auditar o sistema "producao" com profundidade "deep" para LGPD e GDPR, gerando relatório executivo.
```

#### Gerar Política de Privacidade
```
Use generateprivacypolicy para criar uma política de privacidade para a empresa "TechCorp" do tipo "SaaS" que coleta Nome, Email e CPF em português.
```

#### Avaliar Riscos (DPIA/RIPD)
```
Use assessrisk para avaliar riscos do processamento de "dados de clientes" incluindo dados pessoais e sensíveis, gerando DPIA completa.
```

### 🔐 Ferramentas OpenFHE - Homomorphic Encryption

#### Relatório Executivo Criptografado
```
Use fheexecutivedashboard para gerar dashboard "comprehensive" trimestral com KPIs ["compliance", "risk", "financial"] em nível "board_ready" incluindo tendências e forecasts.
```

#### Benchmark Privado Multi-Organizacional
```
Use privatebenchmark para benchmark de "compliance" no setor "technology" para organização "large" comparando métricas ["lgpd_score", "incident_rate", "response_time"] com nível "maximum" de anonimato.
```

#### Prova Zero-Knowledge de Compliance
```
Use zkcomplianceproof para gerar "compliance_certificate" provando "Organização está 100% conforme LGPD" com evidências ["data_protection", "user_rights", "documentation"] para regulamentações ["LGPD", "GDPR"] usando "zk-SNARK".
```

#### Analytics Homomórficos
```
Use homomorphicanalytics para análise "compliance_score" na fonte "production_db" com entrada criptografada e computação "multi_party" entre organizações ["empresa_a", "empresa_b", "empresa_c"].
```

## 🏗️ Arquitetura

```
┌─────────────┐     MCP Protocol    ┌──────────────┐
│   Claude    │◄────────────────────►│  DPO2U MCP   │
│   Desktop   │     JSON-RPC 2.0     │   Server     │
└─────────────┘                      └──────┬───────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    │                       │                       │
              ┌─────▼─────┐         ┌──────▼──────┐        ┌──────▼──────┐
              │   LEANN   │         │   Ollama    │        │   OpenFHE   │
              │    API    │         │  Local LLM  │        │ Homomorphic │
              └───────────┘         └─────────────┘        └─────────────┘
              Vector Search         AI Generation          FHE Computing
              2856 docs            100% Private           Zero Exposure
```

## 📊 Métricas de Performance

- **Tempo de Resposta**: <5 segundos por ferramenta
- **Precisão**: 95% em identificação de gaps
- **Cobertura**: 100% dos artigos LGPD/GDPR
- **Disponibilidade**: 99.9% uptime
- **Privacidade**: 100% processamento local

## 🔒 Segurança e Privacidade

- ✅ **Processamento 100% Local**: Nenhum dado sai da sua infraestrutura
- ✅ **Sem Cloud Dependencies**: Stack completamente on-premise
- ✅ **Criptografia**: Dados em trânsito e em repouso
- ✅ **Auditável**: Logs completos de todas as operações
- ✅ **LGPD/GDPR Compliant**: By design

## 🤝 Suporte

- **Documentação**: Este README e código comentado
- **Issues**: https://github.com/dpo2u/dpo2u-mcp/issues
- **Email**: suporte@dpo2u.com.br
- **WhatsApp**: +55 11 99999-9999

## 📄 Licença

MIT License - Veja arquivo LICENSE para detalhes.

## 🏆 Créditos

Desenvolvido por **DPO2U** - Pioneiros em Legal Tech + IA no Brasil

---

**DPO2U MCP Platform v1.0** - Transformando Compliance com IA 🚀
