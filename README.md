# 🧠 Agente de Saúde com IA

Este é um projeto simples de um **Agente de Saúde Inteligente** desenvolvido com **ReactJS** no frontend e **n8n** no backend (plataforma de automação no-code/low-code).

O agente recebe sintomas informados pelo usuário, envia esses dados para um fluxo automatizado no n8n, e retorna recomendações personalizadas com base no que foi processado.

> ⚠️ **Este projeto está integrado a uma instância do n8n em ambiente gratuito, que oferece apenas 14 dias de teste grátis. Após esse período, as rotas de backend utilizadas podem parar de funcionar, a menos que seja feita uma assinatura paga do serviço.**

---

## 🚀 Tecnologias Utilizadas

- [ReactJS](https://react.dev/)
- [Vite](https://vitejs.dev/) (para build rápido)
- [n8n](https://n8n.io/)

---

## ⚙️ Funcionalidades

- Formulário para envio de sintomas.
- Validação de email (@gmail.com).
- Envio assíncrono dos dados via API para o n8n.
- Resposta formatada com recomendações médicas simuladas.
- Opção de finalizar o atendimento.
