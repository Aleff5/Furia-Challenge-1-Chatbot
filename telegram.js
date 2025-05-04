require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { getEventos } = require('./commands/Events.js');
const { GetPastEvents } = require('./commands/PastEvents.js')
const { Info }  = require('./commands/TeamInfo.js')
const { getUltimoPostTwitter } = require('./commands/twitter.js');
const { UltimosResultados } = require('./commands/ultimosResultados.js');
const { gerarGrafico } = require('./commands/RankingDevelopment.js')
const { playersList, getPlayerStats } = require('./commands/nextmatch.js');  // Importe o módulo com as funções Info e getPlayerStats
const fs = require('fs');
const {HLTV} = require('hltv');
const { interpretarMensagemUsuario } = require('./IA/InterpretadorIA.js');
const { ProximosJogos } = require('./commands/jogos.js')


const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
    polling: {
      interval: 1000,  
      timeout: 10,     
      consecutive_errors_threshold: 5 
    }
});

bot.setMyCommands([
  { command: '/ranking', description: '📊 Ver ranking da HLTV' },
  { command: '/eventos', description: '📅 Ver eventos futuros' },
  { command: '/ultimos_eventos', description: '📁 Últimos eventos disputados' },
  { command: '/twitter', description: '📰 Último post do Twitter' },
  { command: '/info', description: '🔍 Info mais recente do roster' },
  { command: '/ultimos_resultados', description: '🎯 Últimos resultados em torneios' },
  { command: '/grafico_rank', description: '📈 Gráfico de evolução do time' },
  { command: '/player_stats', description: '📈 Estatísticas dos jogadores'},
  { command: '/proximojogos', description: '🎮 Busca os próximos jogos'},

]);

  

console.log("Bot iniciado...");


bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `🐺🔥 Bem-vindo ao Bot da FURIA! 🔥🐺

Eu sou seu assistente inteligente da FURIA!
Aqui você encontra notícias, resultados, eventos, estatísticas e muito mais!
Pode falar comigo de forma tranquila — entendo o que você escrever.  

Escolha uma opção abaixo para começarmos: 👇`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📊 Ranking', callback_data: 'inline_ranking' }],
        [{ text: '📅 Eventos', callback_data: 'inline_eventos' }],
        [{ text: '📁 Últimos eventos', callback_data: 'inline_ultimos_eventos' }],
        [{ text: '📰 Último post', callback_data: 'inline_ultimo_post' }],
        [{ text: '📈 Evolução no ranking', callback_data: 'inline_grafico_rank' }],
        [{ text: '🎯 Últimos resultados', callback_data: 'inline_ultimos_resultados' }],
        [{ text: '🔍 Info do time', callback_data: 'inline_info' }],
        [{ text: '⚽ Estatísticas dos Jogadores', callback_data: 'inline_player_stats' }],
        [{ text: '🎮 Próximos jogos', callback_data: 'inline_proximos_jogos' }]
      ]
    }
  });
});



bot.onText(/\/player_stats/, async (msg) => {
  const chatId = msg.chat.id;

  try {
      // Buscando a lista de jogadores da FURIA (ID 8297)
      const players = await playersList();  // Obtém a lista de jogadores (nome e id)

      // Cria os botões inline para os jogadores
      const playerButtons = players.map(player => {
          return {
              text: player.name,  // Nome do jogador
              callback_data: `player_${player.id}`  // ID do jogador
          };
      });

      // Estrutura do teclado inline
      const keyboard = {
          reply_markup: {
              inline_keyboard: [playerButtons]  // Adiciona os botões ao teclado
          }
      };

      // Envia a mensagem para o usuário com os botões para selecionar o jogador
      bot.sendMessage(chatId, "Escolha um jogador para ver as estatísticas:", keyboard);
  } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, "Erro ao buscar jogadores.");
  }
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const callbackData = query.data;

  if (callbackData.startsWith('player_')) {
    const playerId = callbackData.split('_')[1];

    try {
      const statsMessage = await getPlayerStats(playerId);
      await bot.sendMessage(chatId, statsMessage);
    } catch (err) {
      console.error(err);
      await bot.sendMessage(chatId, "Erro ao buscar estatísticas.");
    }
  } 
  
  else if (callbackData === 'inline_ranking') {
    bot.sendMessage(chatId, '/ranking (Em breve atualizado com botão 😎)');
  } else if (callbackData === 'inline_eventos') {
    const evento = await getEventos();
    bot.sendMessage(chatId, evento);
  } else if (callbackData === 'inline_ultimos_eventos') {
    const ultimos = await GetPastEvents();
    bot.sendMessage(chatId, ultimos || 'Nenhum evento passado encontrado!');
  } else if (callbackData === 'inline_ultimo_post') {
    const post = await getUltimoPostTwitter();
    bot.sendMessage(chatId, post);
  }else if (callbackData === 'inline_proximos_jogos') {
    const jogos = await ProximosJogos(); 
    bot.sendMessage(chatId, jogos);
  }else if (callbackData === 'inline_grafico_rank') {
    await gerarGrafico();
    await bot.sendPhoto(chatId, fs.createReadStream('grafico-furia.png'));
    fs.unlink('grafico-furia.png', () => {});
  } else if (callbackData === 'inline_ultimos_resultados') {
    const res = await UltimosResultados();
    bot.sendMessage(chatId, res || 'Nenhum resultado disponível!');
  } else if (callbackData === 'inline_info') {
    const info = await Info(1);
    bot.sendMessage(chatId, info);
  } else if (callbackData === 'inline_player_stats') {
    try {
      const players = await playersList();
      const playerButtons = players.map(player => [{
        text: player.name,
        callback_data: `player_${player.id}`
      }]);

      await bot.sendMessage(chatId, "Escolha um jogador para ver as estatísticas:", {
        reply_markup: {
          inline_keyboard: playerButtons
        }
      });
    } catch (err) {
      console.error(err);
      await bot.sendMessage(chatId, "Erro ao buscar jogadores.");
    }
  }
});

bot.onText(/\/eventos/, async (msg) => {
  const chatId = msg.chat.id;
  const evento = await getEventos();

  bot.sendMessage(chatId, evento);
});

bot.onText(/\/proximosjogos/, async (msg) => {
  const chatId = msg.chat.id
  const resposta = await ProximosJogos();
  bot.sendMessage(chatId, resposta);
})

//OK
bot.onText(/\/ultimos_eventos/, async (msg) => {
    const chatId = msg.chat.id;
    const ultimos = await GetPastEvents();



    if (!ultimos || ultimos.trim() === '') {
        bot.sendMessage(chatId, 'Desculpe, não há eventos passados para exibir no momento.');
    } else {
        bot.sendMessage(chatId, ultimos);
    }
});

//OK
bot.onText(/\/info/, async (msg) => {
    const chatId = msg.chat.id;
    const info = await Info(1);
    bot.sendMessage(chatId, info)
})

//OK
bot.onText(/\/ultimos_resultados/, async (msg) => {
  const chatId = msg.chat.id;
  const infos = await UltimosResultados();

  if (!infos || infos.trim() === '') {
    bot.sendMessage(chatId, "❌ Nenhum resultado encontrado no momento.");
  } else {
    bot.sendMessage(chatId, infos);
  }
});

//OK
bot.onText(/\/grafico_rank/, async (msg) => {
  const chatId = msg.chat.id;
  const path = 'grafico-furia.png';

  try {
    await gerarGrafico(); 

    await bot.sendPhoto(chatId, fs.createReadStream(path));

    fs.unlink(path, (err) => {
      if (err) {
        console.error('Erro ao deletar o gráfico:', err);
      } else {
        console.log('🧹 Gráfico deletado após envio!');
      }
    });
  } catch (err) {
    console.error('Erro ao gerar ou enviar o gráfico:', err);
    bot.sendMessage(chatId, '❌ Ocorreu um erro ao gerar o gráfico.');
  }
});



bot.onText(/\/twitter/, async (msg) => {
    const chatId = msg.chat.id;
    const twitte = await getUltimoPostTwitter();
    bot.sendMessage(chatId, twitte)
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith('/')) return;

  switch (text) {
    case '📊 Ranking':
      bot.sendMessage(chatId, '/ranking (Em breve atualizado com botão 😎)');
      break;

    case '📅 Eventos':
      const evento = await getEventos();
      bot.sendMessage(chatId, evento);
      break;

    case '📁 Últimos eventos':
      const ultimos = await GetPastEvents();
      bot.sendMessage(chatId, ultimos || 'Nenhum evento passado encontrado!');
      break;

    case '📰 Último post':
      const post = await getUltimoPostTwitter();
      bot.sendMessage(chatId, post);
      break;

    case '📈 Evolução no ranking':
      await gerarGrafico();
      await bot.sendPhoto(chatId, fs.createReadStream('grafico-furia.png'));
      fs.unlink('grafico-furia.png', () => {});
      break;

    case '🎯 Últimos resultados':
      const res = await UltimosResultados();
      bot.sendMessage(chatId, res || 'Nenhum resultado disponível!');
      break;

    case '🔍 Info do time':
      const info = await Info(1);
      bot.sendMessage(chatId, info);
      break;

    case '🎮 Estatísticas dos Jogadores': 
      const players = await playersList();

      const playerButtons = players.map(player => {
          return {
              text: player.name,  
              callback_data: `player_${player.id}`  
          };
      });

    
      const keyboard = {
          reply_markup: {
              inline_keyboard: [playerButtons] 
          }
      };
    bot.sendMessage(chatId, 'Escolha um jogador para ver as estatísticas:', keyboard);
    break;
    case '🎮 Próximos jogos':
      await bot.sendMessage(chatId, '⏳ Buscando jogos...');
      const proximos = await ProximosJogos();
      bot.sendMessage(chatId, proximos);
    break;

    default:
      try {
        const { intencao, mensagem } = await interpretarMensagemUsuario(text);
    
        switch (intencao) {
          case 'ranking':
            await bot.sendMessage(chatId, '⏳ Pensando...');
            await bot.sendMessage(chatId, '/ranking (em breve com botão 😎)');
            break;
    
          case 'eventos_futuros':
            await bot.sendMessage(chatId, '⏳ Pensando...');
            const evento = await getEventos();
            await bot.sendMessage(chatId, evento);
            break;
    
          case 'eventos_passados':
            await bot.sendMessage(chatId, '⏳ Pensando...');
            const ultimos = await GetPastEvents();
            await bot.sendMessage(chatId, ultimos || 'Nenhum evento passado encontrado.');
            break;
    
          case 'ultimo_post':
            await bot.sendMessage(chatId, '⏳ Pensando...');
            const post = await getUltimoPostTwitter();
            await bot.sendMessage(chatId, post);
            break;
    
          case 'grafico_rank':
            await bot.sendMessage(chatId, '⏳ Pensando...');
            await gerarGrafico();
            await bot.sendPhoto(chatId, fs.createReadStream('grafico-furia.png'));
            fs.unlink('grafico-furia.png', () => {});
            break;
    
          case 'ultimos_resultados':
            await bot.sendMessage(chatId, '⏳ Pensando...');
            const res = await UltimosResultados();
            await bot.sendMessage(chatId, res || 'Nenhum resultado disponível.');
            break;
    
          case 'info_time':
            await bot.sendMessage(chatId, '⏳ Pensando...');
            const info = await Info(1);
            await bot.sendMessage(chatId, info);
            break;
    
          case 'player_stats':
            await bot.sendMessage(chatId, '⏳ Pensando...');
            const players = await playersList();
            const playerButtons = players.map(player => [{
              text: player.name,
              callback_data: `player_${player.id}`
            }]);
            await bot.sendMessage(chatId, "Escolha um jogador para ver as estatísticas:", {
              reply_markup: { inline_keyboard: playerButtons }
            });
            break;
    
          case 'proximos_jogos':
            await bot.sendMessage(chatId, '🎮 Buscando os próximos jogos da FURIA...');
            const jogos = await ProximosJogos();
            await bot.sendMessage(chatId, jogos);
            break;
    
          case 'desconhecido':
          default:
            if (mensagem) {
              await bot.sendMessage(chatId, mensagem);
            } else {
              await bot.sendMessage(chatId, 'Não entendi muito bem, mas bora trocar uma ideia! 😎');
            }
            break;
        }
      } catch (err) {
        console.error("Erro ao usar a IA:", err);
        bot.sendMessage(chatId, '❌ Tive um problema para entender o que você disse. Tenta de novo?');
      }
      break;
    
}
});

const http = require('http');
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running\n');
}).listen(PORT, () => {
  console.log(`Fake server listening on port ${PORT}`);
});

