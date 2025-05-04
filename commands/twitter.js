const axios = require('axios');

const RSS_FEED_URL = 'https://rss.app/feeds/v1.1/74DhRLnSWttObl3P.json'; 

async function getUltimoPostTwitter() {
  try {
    const res = await axios.get(RSS_FEED_URL);
    const posts = res.data.items;
    

    if (!posts || posts.length === 0) {
      return 'Nenhuma postagem encontrada.';
    }

    const ultimo = posts[0];
    
    
    return `🕊️ Última postagem no Twitter:\n ${ultimo.title}\n 🔗${ultimo.url}`;
  } catch (err) {
    console.error(err);
    return 'Erro ao buscar a última postagem do Twitter.';
  }
}

module.exports = { getUltimoPostTwitter };
