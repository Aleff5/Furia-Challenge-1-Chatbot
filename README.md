
# 🐺 Furia Challenge 1 - Chatbot

Este projeto é um **chatbot interativo para fãs da FURIA** (equipe de CS:GO e eSports), desenvolvido como parte do **Challenge 1**. Ele permite que torcedores acompanhem o time de maneira inteligente e prática pelo Telegram.

O bot responde a comandos e interpreta linguagem natural com auxílio de IA, oferecendo informações sobre o time, resultados, rankings, eventos, estatísticas e muito mais.

🔗 **Landing page do projeto**: [https://vermillion-cendol-d2e76f.netlify.app](https://vermillion-cendol-d2e76f.netlify.app)

---

## 🚀 Funcionalidades

- 📈 Ver o ranking atual da FURIA (HLTV).
- 📅 Consultar próximos eventos e campeonatos.
- 📁 Ver os últimos eventos disputados.
- 📰 Ver o último post oficial do Twitter da FURIA.
- 📊 Gráfico de evolução do time no ranking.
- 🎯 Ver resultados recentes em campeonatos.
- 🔍 Consultar informações atualizadas do elenco.
- ⚽ Estatísticas individuais dos jogadores.
- 🎮 Visualizar próximos jogos da FURIA.
- 🤖 Interagir em linguagem natural com IA (Google Gemini).

---

## 🛠️ Tecnologias Utilizadas

- **Node.js**
- **node-telegram-bot-api** (Telegram Bot API)
- **HLTV (via biblioteca não oficial)**
- **Google Gemini API (IA para interpretação)**
- **Axios**
- **dotenv**
- **fs**
- **RSS Feed parsing**
- **Render (backend do bot)**
- **Netlify (landing page)**

---

## 📲 Como rodar o projeto localmente

1. **Clone o repositório**:

```bash
git clone https://github.com/Aleff5/Furia-Challenge-1-chatbot.git
cd Furia-Challenge-1-chatbot
```

2. **Instale as dependências**:

```bash
npm install
```

3. **Configure o arquivo `.env`**:

Crie um arquivo chamado `.env` com o seguinte conteúdo:

```env
TELEGRAM_TOKEN=SEU_TOKEN_DO_TELEGRAM
GEMINI_API_KEY=SEU_TOKEN_DA_IA_GEMINI
```

4. **Execute o bot**:

```bash
node telegram.js
```

> O bot usará **long polling** para se conectar ao Telegram e estará pronto para responder aos usuários.

---

## 📄 Objetivo do Projeto

- Criar uma plataforma interativa que aproxime os fãs da FURIA.
- Centralizar informações atualizadas do time e dos campeonatos em um único canal.
- Utilizar IA para interpretar comandos com linguagem natural e tornar o bot mais intuitivo.

---

## ⚠️ Observações Técnicas

- A biblioteca da HLTV utilizada realiza scraping direto no site, o que pode ser bloqueado pelo **Cloudflare** quando o bot está hospedado no Render.
- Em ambiente local, as funções HLTV funcionam normalmente.
- Para produção, recomenda-se **armazenar os dados coletados localmente ou usar serviços como Supabase** para evitar bloqueios.

---

## 👨‍💻 Autor

Desenvolvido por [@Aleff5](https://github.com/Aleff5) 🤘🐺
