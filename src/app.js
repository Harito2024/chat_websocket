const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const PORT = 8080
const viewsRouter = require('./routes/views.router.js')
const {Server} = require('socket.io')

const httpServer = app.listen(PORT, ()=>console.log(`Servidor el puerto: ${PORT}`))



app.use(express.json())
app.use(express.urlencoded({ extended: true}))
const socketServer = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use('/', viewsRouter)

let messages =[]

socketServer.on('connection', (socket) => {
    console.log('Nuevo cliente conectado')

    socket.on('message', data=>{
        messages.push(data)
        socketServer.emit('messageLogs', messages)
    })
})
