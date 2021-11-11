const Imap = require('imap')

let imap = null

module.exports = {
  async PegaEmails (usuario, senha, caixa) {
    let retorno = []
    try {
      imap = new Imap({
        user: usuario,
        password: senha,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { servername: 'imap.gmail.com' }
      })

      imap.connect()
      imap.on('error', (error) => { console.log(error.message) })
      await this.EsperaCarregarEmail()
      await this.AbrirCaixa(caixa)
      retorno = await this.PegaDadosHeader()
      return retorno
    } catch (error) {
      console.log(error.message)
      return []
    }
  },
  async PegaDadosHeader () {
    return new Promise((resolve, reject) => {
      let dados = []
      try {
        var f = imap.seq.fetch('1:*', { bodies: ['HEADER','TEXT'] })
        f.on('message', (msg, seqno) => {
          msg.on('body', (stream, info) => {
            var buffer = '', count = 0
            stream.on('data', (chunk) => {
              count += chunk.length
              buffer += chunk.toString('utf8')
            })
            stream.once('end', () => {
              if (info.which !== 'TEXT') {
                const headers = Imap.parseHeader(buffer)
                const messageIdInicial = headers['message-id'][0].substring(headers['message-id'][0].indexOf("<") + 1)
                const messageId = messageIdInicial.substring(0, messageIdInicial.indexOf(">"))
                const emailInicial = headers.received[1].substring(headers.received[1].indexOf("<") + 1)
                const emailComToken = emailInicial.substring(0, emailInicial.indexOf(">"))
                const data = new Date(headers.date[0])
                dados.push({
                  MessageID: messageId,
                  EmailComToken: emailComToken,
                  Data: data
                })
              }
            })
            stream.on('error', (error) => { console.log(error.message) })
          })
          msg.on('error', (error) => { console.log(error.message) })
        })
        f.once('end', () => {
          imap.end()
          resolve(dados)
        })
        f.on('error', (error) => { console.log(error.message) })
      } catch (error) {
        reject(error)
      }
    })
  },
  async AbrirCaixa (caixa) {
    return new Promise((resolve, reject) => {
      imap.openBox(caixa, true, (err, box) => {
        try {
          resolve(box)
        } catch (error) {
          reject(error)
        }
      })
    })
  },
  async EsperaCarregarEmail () {
    return new Promise((resolve, reject) => {
      imap.on('ready', () => {
        try {
          resolve()
        } catch (error) {
          reject(error)
        }
      })  
    })
  }
}