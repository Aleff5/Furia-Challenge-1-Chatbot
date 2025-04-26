const express = require('express');
// const router = require('./router');
const HLTV = require('hltv-api').default


const app = express();
app.use(express.json());

// app.use('/chatbot', router )

app.get('/', async (req, res) => {
  const matches = await HLTV.getResults()
  res.json(matches)
})

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
  });
