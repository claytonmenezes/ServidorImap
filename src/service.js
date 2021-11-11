var Service = require('node-windows').Service

var svc = new Service({
	name:'Servidor Imap',
	description: 'Servidor Imap para o AgilusCrm',
	script: __dirname + '/index.js'
})

svc.on('install', () => {
	svc.start()
});

svc.install()