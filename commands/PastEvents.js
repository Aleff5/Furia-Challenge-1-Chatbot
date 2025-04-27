const { HLTV } = require('hltv')



async function GetPastEvents() {
    try {
        const today = new Date().toISOString().split('T')[0];

        const res = await HLTV.getPastEvents({
            attendingTeamIds: [9565],
            delayBetweenPageRequests: 1500,
            startDate: '2024-06-01',
            endDate: today
        });

        if (res.length === 0) {
            return "Sem eventos anteriores";
        }

        const eventos = res.map(evento => {
            const nome = evento.name;
            const data = new Date(evento.dateStart).toLocaleDateString('pt-BR');
            const local = evento.location?.code || "desconhecido";
            return `🏆Nome: ${nome}\n 📅Data: ${data}\n 📍Local: ${local}\n`;
        });

        return eventos.join("\n");
    } 
    catch (err) {
        console.error(err);
        return 'Erro ao buscar eventos';
    }
}

module.exports = { GetPastEvents }