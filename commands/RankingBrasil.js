const {HLTV} = require('hltv');





HLTV.getTeamRanking({ country: 'Brazil'}).then((res) => {
  console.log(res)
})