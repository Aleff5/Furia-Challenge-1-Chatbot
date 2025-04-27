// ai/interpretadorIA.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `
Você é um assistente de um chatbot da torcida FURIA.
Sua missão é receber mensagens dos fãs e descobrir o que eles estão querendo saber.

Existem dois tipos de respostas que você pode dar:

1. Se a mensagem for um pedido de informação, classifique com apenas **uma palavra-chave** das opções abaixo (sem explicação).
2. Se a mensagem for apenas casual (um cumprimento, brincadeira, ou papo solto), responda como se você fosse um torcedor da FURIA — de forma descontraída, amigável, e respeitosa. Use emojis se quiser (ex: 🐺🔥😎).

**Opções válidas para intenção (caso o usuário peça alguma informação):**
- ranking
- eventos_futuros
- eventos_passados
- ultimo_post
- grafico_rank
- ultimos_resultados
- info_time
- player_stats
- proximos_jogos
- desconhecido

**Formato obrigatório da resposta se for intenção reconhecida:**

intenção_detectada
Mensagem amigável para o usuário

(exemplo)
ultimo_post
Claro, já mostro o último post da FURIA pra você! 📰🐺

**Formato se for conversa casual:**
Mensagem amigável no estilo da torcida da FURIA (não envie nenhuma palavra-chave, apenas a frase casual)

---

Nunca diga que você é um assistente de IA.  
Fale como se você fosse parte da torcida FURIA, sempre animado, mas respeitoso.
`;


async function interpretarMensagemUsuario(mensagemUsuario) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    console.log(`📝 [IA-ENVIO] Mensagem recebida do usuário: "${mensagemUsuario}"`);

    const prompt = `
${systemPrompt}

Mensagem do usuário:
"${mensagemUsuario}"
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    console.log(`📥 [IA-RESPOSTA] Resposta bruta da IA: "${response}"`);

    const [intencaoRaw, ...mensagemArray] = response.split('\n');
    const intencao = intencaoRaw.toLowerCase().trim();
    const mensagem = mensagemArray.join('\n').trim();

    const intencoesValidas = [
        'ranking',
        'eventos_futuros',
        'eventos_passados',
        'ultimo_post',
        'grafico_rank',
        'ultimos_resultados',
        'info_time',
        'player_stats',
        'proximos_jogos'
    ];
      

    if (intencoesValidas.includes(intencao)) {
      console.log(`🎯 [IA-TRADUZIDO] Intenção detectada: "${intencao}" | Mensagem para usuário: "${mensagem}"`);
      return {
        intencao,
        mensagem: mensagem || null
      };
    } else {
      console.log(`🎯 [IA-TRADUZIDO] Conversa casual detectada. Mensagem: "${response}"`);
      return {
        intencao: 'desconhecido',
        mensagem: response
      };
    }
  } catch (err) {
    if (err.status === 429) {
      console.warn('⚠️ Limite de requisições excedido, aguardando...');
      return { intencao: 'desconhecido', mensagem: 'Tô um pouco ocupado agora 🛠️. Manda de novo daqui a pouquinho, beleza?' };
    } else {
      console.error("Erro na IA:", err);
      return { intencao: 'desconhecido', mensagem: '❌ Deu ruim pra entender. Manda de novo?' };
    }
  }
}

module.exports = { interpretarMensagemUsuario };
