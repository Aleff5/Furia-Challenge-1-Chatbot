const Parser = require('rss-parser');
const parser = new Parser();

const FEED_URL = 'https://rss.app/feeds/RBToieE9mRPjBxTz.xml'; 


async function ProximosJogos() {
    try {
      const timeDesejado = 'FURIA'; 
      const feed = await parser.parseURL(FEED_URL);
      const jogos = [];
  
      feed.items.forEach((item) => {
        if (item.title.toLowerCase().includes(timeDesejado.toLowerCase())) {
          jogos.push(`🏆 *${item.title}*\n🔗 [Ver jogo](${item.link})`);
        }
      });
  
      if (jogos.length === 0) {
        return `❌ O time ${timeDesejado} não tem jogos marcados no momento. 😞`;
      }
    
      return jogos.join('\n\n');
    } catch (error) {
      console.error('❌ Erro ao buscar jogos:', error.message);
      return 'Erro ao buscar os próximos jogos.';
    }
  }
  

module.exports = { ProximosJogos };
