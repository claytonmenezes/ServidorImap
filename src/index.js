import express from 'express'
import router from './rotas'
import cors from 'cors'

let app = express()
app.set('port', 2510)
app.use(express.json({ limit: '50mb' }))
app.use(cors())

async function start () {
  router.setaRota(app)
  app.listen(app.get('port'), async () => {
    console.log('Servidor rodando na porta', app.get('port'))
  })
}

start()