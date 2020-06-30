const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')
const cors = require('cors')
const morgan = require('morgan');


const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server) 


//conexão com banco mongoDB
mongoose.connect('mongodb://localhost/possedrive',{
    useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true,
}).then(()=>{ 
    console.log("Conectado ao MongoDB")
}).catch((err)=>{
    console.log("Erro de conexão: "+err)
});

const connectedUsers = {}
//conexão com socket
io.on('connection', socket => {
    const { user } = socket.handshake.query
    connectedUsers[user] = socket.id
    //console.log(user, socket.id)
});

//midleware que seta usuarios conectados ao controler
app.use((req, res, next)=>{
	req.io = io
	req.connectedUsers = connectedUsers

	return next()
})

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(routes)

server.listen(process.env.PORT || 3000)