# DPO2U MCP v2.0 - Guia do Usuário

## 🚀 Introdução

O DPO2U MCP v2.0 é um sistema de compliance LGPD/GDPR que trabalha **exclusivamente com dados reais**. Não gera informações fictícias e sempre apresenta evidências rastreáveis.

## 📋 Diferenças da v1.0 para v2.0

| Aspecto | v1.0 (Antiga) | v2.0 (Nova) |
|---------|---------------|-------------|
| **Dados** | Gerava dados simulados | Apenas dados reais |
| **Evidências** | Opcional | Obrigatório com rastreabilidade |
| **Ferramentas** | 10 ferramentas | 7 ferramentas consolidadas |
| **Setup** | Manual | Wizard interativo |
| **Webhook** | Não tinha | Integrado automaticamente |
| **Checklist** | Parcial | 44 itens LGPD completo |

## 🎯 Como Começar

### 1. Instalação

```bash
cd /opt/dpo2u-mcp
npm install
```

### 2. Primeira Execução

```bash
node run-dpo2u-mcp.js
```

Na primeira vez, o sistema irá:
1. Detectar que não há empresa configurada
2. Iniciar o wizard de configuração
3. Coletar dados da empresa
4. Executar checklist LGPD de 44 perguntas
5. Calcular score de compliance
6. Enviar dados para webhook n8n

## 🏢 Configuração Inicial da Empresa

### Dados Solicitados

```
Nome da Empresa: [Digite o nome]
CNPJ: [00.000.000/0001-00]
Email Corporativo: [email@empresa.com]
Telefone: [(11) 0000-0000]
Endereço: [Endereço completo]
Website: [https://empresa.com]
Setor de Atuação: [Ex: Tecnologia]
Porte da Empresa:
  1 - Micro
  2 - Pequena
  3 - Média
  4 - Grande
```

### DPO/Encarregado

```
A empresa possui DPO/Encarregado designado? (s/n):
  Se SIM:
    Nome do DPO: [Nome completo]
    Email do DPO: [dpo@empresa.com]
    Telefone do DPO: [(11) 0000-0000]
    O DPO está formalizado internamente? (s/n):
```

## 📝 Checklist LGPD (44 Itens)

### Como Responder

Para cada pergunta, responda:
- **s** = Sim (Conforme)
- **n** = Não (Não conforme)
- **p** = Parcial (Parcialmente conforme)
- **na** = Não Aplicável

### Exemplo de Pergunta

```
[Governança de Proteção de Dados]
A EMPRESA tem uma pessoa encarregada da proteção de dados pessoais (DPO)?
Ref: LGPD Art. 41, § 2º | GDPR Art. 50
Resposta (s/n/p/na): s
Localização da evidência (caminho ou descrição): /opt/documentos/nomeacao-dpo.pdf
```

### Categorias do Checklist

1. **Governança de Proteção de Dados** (8 questões)
2. **Gestão de Dados Pessoais** (10 questões)
3. **Segurança da Informação** (10 questões)
4. **Gestão de Risco** (5 questões)
5. **Terceiros** (4 questões)
6. **Gestão de Incidentes** (4 questões)

## 📊 Menu Principal

Após a configuração inicial:

```
📊 DPO2U MCP - Sistema de Compliance v2.0
==========================================

Empresa: Nome da Empresa
Score LGPD: 75%

Escolha uma opção:

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

## 🔍 Funcionalidades Detalhadas

### 1. Executar Auditoria de Compliance

**O que faz:**
- Analisa respostas do checklist
- Busca políticas no sistema (privacidade, termos, DPO)
- Coleta métricas reais (containers, serviços, disco)
- Calcula score de compliance
- Salva relatório no Obsidian
- Envia para webhook n8n

**Dados Reais Coletados:**
- Containers Docker em execução
- Serviços ativos
- Uso de disco
- Políticas encontradas no Obsidian
- Evidências do checklist

### 2. Avaliar Riscos

**O que faz:**
- Busca vulnerabilidades reais no sistema
- Analisa logs de segurança
- Verifica configurações
- Identifica gaps de compliance
- Gera matriz de risco

**Evidências Buscadas:**
- Logs de erro/warning
- Configurações inseguras
- APIs expostas
- Dados sem criptografia

### 3. Calcular Privacy Score

**O que faz:**
- Avalia 10 dimensões de privacidade
- Usa apenas dados verificáveis
- Compara com benchmarks
- Gera roadmap de melhorias

**Dimensões Avaliadas:**
1. Governança
2. Direitos dos Titulares
3. Consentimento
4. Segurança
5. Privacy by Design
6. Transparência
7. Gestão de Dados
8. Conformidade Legal
9. Treinamento
10. Monitoramento

### 7. Buscar Evidências

**Interface de Busca:**
```
Digite o termo de busca: política privacidade

Buscando...

📁 Arquivos encontrados: 3
  - /opt/dpo2u-mcp/docs/privacy-policy.md
  - /opt/company/policies/lgpd.pdf
  - /var/log/privacy-audit.log

📝 Documentos no Obsidian: 5
  - /Privacy-Policy-LGPD-GDPR-2025.md
  - /Politicas/privacy-v1.md
  ...

📜 Logs encontrados: 2
  - /var/log/dpo2u-mcp/audit-2025.log
  ...

🧠 LEANN (busca semântica): 4 resultados

📊 Total de evidências encontradas: 14
```

### 8. Testar Webhook n8n

**O que faz:**
- Envia payload de teste
- Verifica conectividade
- Mostra estatísticas de envio
- Exibe logs de comunicação

**Estatísticas Mostradas:**
```
📊 Estatísticas de envio:
  Total: 25
  Sucesso: 23 (92%)
  Erros: 2
  Último sucesso: 2025-10-02 15:30
  Último erro: 2025-10-01 10:15
```

## 📤 Integração Webhook n8n

### URL do Webhook
```
https://www.n8n.dpo2u.com/webhook/mcp-report
```

### Tipos de Relatórios

| Tipo | Descrição | Quando é Enviado |
|------|-----------|------------------|
| `setup` | Configuração inicial | Após setup da empresa |
| `audit` | Auditoria compliance | Ao executar auditoria |
| `risk` | Avaliação de riscos | Ao avaliar riscos |
| `dpo` | Relatório DPO | Ao gerar relatório |
| `consent` | Verificação consentimentos | Ao verificar consentimentos |
| `privacy_score` | Score de privacidade | Ao calcular score |
| `test` | Teste de conexão | Ao testar webhook |

### Estrutura do Payload

```json
{
  "timestamp": "2025-10-02T15:30:00Z",
  "report_type": "audit",
  "report_id": "AUDIT-1234567890",
  "company": {
    "name": "Nome da Empresa",
    "cnpj": "00.000.000/0001-00",
    "email": "email@empresa.com"
  },
  "data": {
    "compliance_score": 75,
    "status": "PARCIALMENTE CONFORME",
    "conformities": [...],
    "issues": [...],
    "evidence_paths": [
      "/opt/policies/privacy.pdf",
      "/obsidian/Politicas/LGPD.md"
    ]
  },
  "metadata": {
    "source": "DPO2U MCP",
    "version": "2.0.0",
    "environment": "production"
  }
}
```

## 🔍 Sistema de Evidências

### Fontes de Busca

1. **Sistema de Arquivos**
   - `/opt/dpo2u-mcp`
   - `/opt/docker-compose`
   - `/var/log`
   - Outros diretórios configurados

2. **Obsidian Vault**
   - `/04-DPO2U-Compliance/*`
   - Todos os arquivos `.md`

3. **Logs do Sistema**
   - Últimos 7 dias por padrão
   - `/var/log/dpo2u-mcp`
   - `/var/log/activity-agent`

4. **LEANN (se disponível)**
   - Busca semântica
   - API em `http://localhost:3001`

### Quando Não Encontra Evidências

```
⚠️ Nenhuma evidência encontrada para o termo pesquisado

Possíveis razões:
- O arquivo/documento não existe
- O termo está escrito diferente
- A funcionalidade não está implementada
- Os logs foram rotacionados
```

## 📁 Estrutura de Arquivos

### Configuração
```
/opt/dpo2u-mcp/config/
├── company.json         # Dados da empresa e checklist
└── webhook-logs.json    # Logs de comunicação
```

### Obsidian
```
/04-DPO2U-Compliance/
├── Setup/               # Configurações iniciais
│   └── Company-Setup-[timestamp].md
├── Auditorias/         # Relatórios de auditoria
│   └── Audit-Real-[timestamp].md
├── Relatorios/         # Relatórios DPO
├── Incidentes/         # Registros de incidentes
├── Consentimentos/     # Verificações
└── Dashboard/          # Status atual
```

## 🔐 Segurança e Privacidade

### O que o Sistema NÃO Faz
- ❌ Não inventa dados
- ❌ Não armazena senhas em texto claro
- ❌ Não expõe dados sensíveis em logs
- ❌ Não envia dados sem criptografia

### O que o Sistema FAZ
- ✅ Valida todos os inputs
- ✅ Rastreia origem de todas as evidências
- ✅ Usa HTTPS para webhook
- ✅ Mantém logs de auditoria

## 🐛 Troubleshooting

### Problema: "Empresa não configurada"
**Solução:** Execute opção 9 no menu principal

### Problema: "Webhook não responde"
**Verificar conectividade:**
```bash
curl -X POST https://www.n8n.dpo2u.com/webhook/mcp-report \
  -H "Content-Type: application/json" \
  -d '{"type":"test","message":"Teste de conexão"}'
```

### Problema: "Nenhuma evidência encontrada"
**Possíveis causas:**
1. Arquivo realmente não existe
2. Termo de busca muito específico
3. Permissões de leitura insuficientes

**Solução:**
- Use termos mais genéricos
- Verifique se os arquivos existem manualmente
- Execute com permissões adequadas

### Problema: "Score de compliance baixo"
**Ações:**
1. Revise respostas do checklist
2. Adicione evidências faltantes
3. Implemente controles ausentes
4. Execute nova auditoria

## 📚 Referências Importantes

### Arquivos Legais LGPD
- Art. 41 - Encarregado (DPO)
- Art. 46-49 - Segurança e Sigilo
- Art. 48 - Comunicação de Incidentes
- Art. 50 - Boas Práticas e Governança

### Documentação Relacionada
- `/opt/dpo2u-mcp/README-V2.md` - Overview técnico
- `/opt/dpo2u-mcp/docs/USER_GUIDE_V2.md` - Este documento
- Obsidian: `04-DPO2U-Compliance/00-DPO2U-Hub.md`

## 💡 Dicas de Uso

1. **Sempre forneça evidências** quando responder "Sim" no checklist
2. **Execute auditorias regulares** (mensal recomendado)
3. **Monitore o webhook** para garantir envio dos relatórios
4. **Mantenha documentação atualizada** no Obsidian
5. **Use busca de evidências** antes de marcar como "não conforme"

## 🆘 Suporte

- **Email:** suporte@dpo2u.com
- **Documentação:** Este guia
- **Logs:** `/opt/dpo2u-mcp/config/webhook-logs.json`

---

**DPO2U MCP v2.0** - Sistema de Compliance com Dados Reais
*Última atualização: 02/10/2025*