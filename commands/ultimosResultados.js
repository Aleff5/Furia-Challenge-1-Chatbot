const { HLTV } = require('hltv');

async function UltimosResultados() {
    try {
        const res = await HLTV.getTeamStats({ id: 9565, currentRosterOnly: true });
        const eventos = res.events;

        let resultadoFinal = '';

        for (const evento of eventos) {
            const idEvento = evento.event.id;
            const nome = evento.event.name;
            const place = evento.place;

            const event = await HLTV.getEvent({ id: idEvento });

            const dataEvento = new Date(event.dateStart).toLocaleDateString('pt-BR');
            const local = event.location?.code || "desconhecido";

            resultadoFinal += `🏆 Nome: ${nome}\n🎖️ Colocação: ${place}\n📅 Data: ${dataEvento}\n📍 Local: ${local}\n\n`;
        }

        return resultadoFinal.trim();
    } catch (err) {
        console.error(err);
        return "Erro ao buscar resultados.";
    }
}

module.exports = { UltimosResultados };
