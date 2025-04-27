const { HLTV } = require('hltv');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');



const width = 800;
const height = 400;

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });



async function gerarGrafico() {
    const res = await HLTV.getTeam({id: 8297})

    const data = res.rankingDevelopment;

  const config = {
    type: 'line',
    data: {
      labels: data.map((_, i) => `T${i + 1}`), 
      datasets: [{
        label: 'Ranking da FURIA 🐆',
        data: data,
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.2,
        pointRadius: 1,
      }]
    },
    options: {
      scales: {
        y: {
          reverse: true, 
          title: {
            display: true,
            text: 'Posição no ranking'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Período'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Histórico de Ranking da FURIA'
        }
      }
    }
  };

  const image = await chartJSNodeCanvas.renderToBuffer(config);
  fs.writeFileSync('./grafico-furia.png', image);
  console.log('🎉 Gráfico gerado: grafico-furia.png');
}

module.exports = { gerarGrafico };

 
