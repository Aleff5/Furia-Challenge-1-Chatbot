// ./chatbot/index.js
const express = require('express');
const { getRankingBrasil } = require('./commands/RankingBrasil.js');
const { getEventos } = require('./commands/Events.js');
const { GetPastEvents } = require('./commands/PastEvents.js')
const { Info }  = require('./commands/TeamInfo.js')
const { getUltimoPostTwitter } = require('./commands/twitter.js');

const router = express.Router();

//ranking n funciona ainda - cloudflare
// router.post('/ranking', async (req, res) => {
//   const rankingMsg = await getRankingBrasil();
//   res.json({ message: rankingMsg });
// });

//OK
// router.get('/info', async (req, res) =>{
//     const infos = await Info();
//     res.json(infos)
// })

router.get('/matches', async (req, res) => {
  const matches = await HLTV.getMatches()
  res.json(matches)
})

// //OK
// router.get('/past-events', async (req, res) => {
//     const eventos = await GetPastEvents();
//     res.json({eventos: eventos})
// })

// //OK
// router.post('/eventos', async (req, res) => {
//   const msg = await getEventos();
//   res.json({ message: msg });
// });


// //OK
// router.post('/twitter', async (req, res) => {
//   const msg = await getUltimoPostTwitter();
//   res.json({ message: msg });
// });


module.exports = router;
