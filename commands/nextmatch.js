const { HLTV } = require('hltv');

async function playersList() {
    try {
        const res = await HLTV.getTeam({ id: 8297 });
        const players = res.players;  // Mantemos a lista de jogadores com id e nome

        // Retorna a lista de jogadores com nome e id
        return players.map(player => ({
            name: player.name,
            id: player.id
        }));

    } catch (err) {
        console.log(err);
        return err;
    }
}

async function getPlayerStats(playerId) {
    try {
        const res = await HLTV.getPlayerStats({ id: playerId });

        // Verificar se a resposta contém os dados esperados
        if (!res || !res.overviewStatistics) {
            return "Erro ao obter estatísticas, resposta inválida.";
        }

        const nome = res.name;
        const idade = res.age;
        const kd = res.overviewStatistics.kdRatio;
        const kills = res.overviewStatistics.kills;
        const headshots = res.overviewStatistics.headshots;
        const rating1 = res.overviewStatistics.rating1;
        const rating2 = res.overviewStatistics.rating2;
        const pais = res.country;

        return `
        🏆 Estatísticas do Jogador: ${nome}
        🔢 Idade: ${idade} anos
        🌍 País: ${pais}
        🎯 Kills: ${kills}
        📊 K/D: ${kd}
        💥 Headshots: ${headshots}
        ⭐ Rating: ${rating1} | ${rating2}
        `;
    } catch (err) {
        console.log(err);
        return "Erro ao buscar as estatísticas do jogador.";
    }
}

module.exports = { playersList, getPlayerStats };
