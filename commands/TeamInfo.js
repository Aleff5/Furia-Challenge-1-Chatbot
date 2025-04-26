const { HLTV } = require('hltv');


async function Info(op) {
    try{
        const res = await HLTV.getTeam({id: 8297})
        const nome = res.name;
        const players = res.players.map(players => players.name).join(", ");
        const rank = res.rank;
        const country = res.country.name;
        if (op === 0){
            return {nome, players, rank, country};
        }
        if(op === 1){
            return `
            🏆 Equipe: ${nome}
            🔢 Ranking: #${rank}
            🌍 País: ${country}
            👥 Jogadores: ${players}
            `;
        }

    }
    catch(err){
        console.log(err);
        return err;
    }
    
}

module.exports = { Info };