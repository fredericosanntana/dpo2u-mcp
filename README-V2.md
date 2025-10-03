# DPO2U MCP v2.0 - Sistema de Compliance LGPD/GDPR

## 🚀 Novo Sistema com Dados Reais

O DPO2U MCP foi completamente refatorado para trabalhar apenas com **dados reais** e **evidências verificáveis**.

## ✨ Principais Mudanças

### 1. **Sem Dados Fictícios**
- ❌ Não gera dados simulados
- ✅ Busca evidências reais no sistema
- ✅ Retorna "Sem evidências" quando não encontra dados

### 2. **Sistema de Evidências**
- Rastreabilidade completa com paths dos arquivos
- Busca em múltiplas fontes (arquivos, Obsidian, logs, LEANN)
- Coleta de evidências durante o checklist

### 3. **Ferramentas Consolidadas**
Reduzido de 10 para 7 ferramentas principais:
- `setupCompany` - Configuração inicial e checklist LGPD (44 itens)
- `auditCompliance` - Auditoria unificada (antes: auditInfrastructure + checkCompliance)
- `riskAssessment` - Riscos consolidados (antes: assessRisk + simulateBreach)
- `privacyManagement` - Gestão unificada (antes: verifyConsent + generatePrivacyPolicy)
- `mapDataFlow` - Mapeamento de dados
- `createDPOReport` - Relatórios DPO
- `calculatePrivacyScore` - Score de maturidade

### 4. **Integração n8n Webhook**
Todos os relatórios são enviados automaticamente para:
```
https://www.n8n.dpo2u.com/webhook/mcp-report
```

### 5. **Checklist LGPD Completo**
44 questões organizadas em 6 categorias:
- Governança de Proteção de Dados
- Gestão de Dados Pessoais
- Segurança da Informação
- Gestão de Risco
- Terceiros
- Gestão de Incidentes

## 📦 Instalação

```bash
cd /opt/dpo2u-mcp
npm install
```

## 🏃 Como Usar

### Executar o Sistema Principal

```bash
node run-dpo2u-mcp.js
```

### Menu Principal
```
1. 📋 Executar Auditoria de Compliance
2. 🔍 Avaliar Riscos
3. 📊 Calcular Privacy Score
4. 🗺️ Mapear Fluxo de Dados
5. 📄 Gerar Relatório DPO
6. ✅ Verificar Consentimentos
7. 🔎 Buscar Evidências
8. 📤 Testar Webhook n8n
9. 🏢 Reconfigurar Empresa
0. Sair
```

## 🏢 Configuração Inicial

Na primeira execução, o sistema solicitará:

1. **Dados da Empresa**
   - Nome
   - CNPJ
   - Email corporativo
   - Telefone
   - Endereço
   - Website
   - Setor
   - Porte

2. **DPO/Encarregado** (se houver)
   - Nome
   - Email
   - Telefone
   - Status de formalização

3. **Checklist LGPD**
   - 44 questões de conformidade
   - Opções: Sim / Não / Parcial / Não Aplicável
   - Solicitação de evidências para respostas positivas

## 🔍 Sistema de Evidências

### Fontes de Busca
1. **Sistema de Arquivos**: `/opt`, `/var/log`, etc.
2. **Obsidian Vault**: Documentos markdown
3. **Logs do Sistema**: Últimos 7 dias
4. **LEANN**: Busca semântica (se disponível)

### Exemplo de Busca
```javascript
// Buscar evidências
const results = await evidenceCollector.searchEvidence("política privacidade");

// Verificar política específica
const policy = await evidenceCollector.checkPolicy("privacy");
if (!policy.exists) {
  console.log("Política de privacidade não encontrada");
}
```

## 📤 Webhook n8n

### Tipos de Relatórios Enviados
- `setup` - Configuração inicial
- `audit` - Auditoria de compliance
- `risk` - Avaliação de riscos
- `dpo` - Relatório DPO
- `consent` - Verificação de consentimentos
- `privacy_score` - Score de privacidade

### Estrutura do Payload
```json
{
  "timestamp": "2025-10-02T15:30:00Z",
  "report_type": "audit",
  "report_id": "AUDIT-123456",
  "company": {
    "name": "Empresa XYZ",
    "cnpj": "00.000.000/0001-00"
  },
  "data": {
    "score": 78,
    "status": "PARCIALMENTE CONFORME",
    "evidence_paths": [...]
  }
}
```

## 📁 Estrutura de Arquivos

```
/opt/dpo2u-mcp/
├── src/
│   ├── initialization/
│   │   ├── companySetup.js      # Setup inicial
│   │   └── evidenceCollector.js # Coleta de evidências
│   ├── integrations/
│   │   └── n8nWebhook.js        # Integração webhook
│   └── tools/                   # Ferramentas consolidadas
├── config/
│   ├── company.json             # Dados da empresa
│   └── webhook-logs.json        # Logs de envio
├── run-dpo2u-mcp.js            # Sistema principal
└── package.json
```

## 📊 Dados Salvos no Obsidian

```
/04-DPO2U-Compliance/
├── Setup/                # Configurações iniciais
├── Auditorias/          # Relatórios de auditoria
├── Relatorios/          # Relatórios DPO
├── Incidentes/          # Registros de incidentes
├── Consentimentos/      # Verificações
├── Contratos/           # Análises
└── Dashboard/           # Status atual
```

## 🔒 Segurança

- Não armazena senhas em texto claro
- Não expõe dados sensíveis em logs
- Validação rigorosa de inputs
- Rastreabilidade completa

## 🐛 Troubleshooting

### Erro: "Empresa não configurada"
Execute a opção 9 no menu para configurar a empresa.

### Erro: "Webhook não responde"
Verifique a conectividade com:
```bash
curl -X POST https://www.n8n.dpo2u.com/webhook/mcp-report \
  -H "Content-Type: application/json" \
  -d '{"type":"test"}'
```

### Erro: "Evidências não encontradas"
Normal quando não há dados. O sistema retorna mensagem apropriada.

## 📝 Notas Importantes

1. **Sempre busca dados reais** - Nunca inventa informações
2. **Requer configuração inicial** - Setup obrigatório na primeira execução
3. **Evidências rastreáveis** - Todos os dados têm origem identificada
4. **Webhook automático** - Todos os relatórios são enviados ao n8n

## 🤝 Suporte

Para dúvidas ou problemas:
- Email: suporte@dpo2u.com
- Docs: https://docs.dpo2u.com

---

**DPO2U MCP v2.0** - Sistema de Compliance com Dados Reais
*Sem dados fictícios, apenas evidências verificáveis*