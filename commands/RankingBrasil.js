const {HLTV} = require('hltv');


// async function getRankingBrasil() {
//   try {
//     const res = await HLTV.getTeamRanking({ country: 'Brazil' });

//     const ranking = res.map(equipe => {
//       const time = equipe.team?.name;
//       const rank = equipe.place;
//       return `Equipe: ${time} - Rank: ${rank}`;
//     });

//     return ranking.join('\n');
//   } catch (err) {
//     console.error(err);
//     return 'Erro ao buscar ranking do Brasil.';
//   }
// };

// getRankingBrasil();

// module.exports = { getRankingBrasil };



HLTV.getTeamRanking({ country: 'Brazil'}).then((res) => {
  console.log(res)
})