const { HLTV } = require('hltv');


async function getEventos(){
    try{
        const res = await HLTV.getEvents({attendingTeamIds:[9565]})
        if(res.length === 0){
            return "Sem eventos próximos."
        }
        
        const eventos = (await res).map(evento => {
            const nomeEvento = evento.name;
            const data = new Date (evento.dateStart).toLocaleDateString('pt-BR');
            const local = evento.location?.code || "desconhecido";
            return `🏆Nome: ${nomeEvento}\n 📅Data: ${data}\n 📍Local: ${local}\n`;
            
        });
        
        return eventos.join(' \n ');
    }
    catch(err) {
        console.error(err);
        return 'Erro ao buscar eventos';
    }
}




module.exports = { getEventos };