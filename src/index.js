const express = require('express'),
cors = require('cors'),
Imap = require('./metodos/Imap')

let app = express()
app.use(express.json())
app.set('port', 2510)
app.use(cors())

async function start () {
  app.post('/', async (req, res) => {
    const emails = await Imap.PegaEmails(req.body.usuario, req.body.senha, req.body.caixa)
		res.status(200).send(emails);
    console.log('Request Ok, ' + emails.length + ' Emails enviados')
	})
	app.listen(app.get('port'), async () => {
		console.log('Servidor rodando na porta', app.get('port'))
	})
}

start()