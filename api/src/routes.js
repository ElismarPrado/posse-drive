const express = require('express')
const User = require('./controllers/User')
const UserDrive = require('./controllers/UserDrive')
const Socket = require('./controllers/Socket')
const Control = require('./controllers/Control')
const Call = require('./controllers/Call')
const Price = require('./controllers/Price')
const Marker = require('./controllers/Marker')
const routes = express.Router()

//Welcome---------------------------------
routes.get('/', (req,res)=>{ res.send("Welcome to Posse-Drive")})


//User-----------------------------------
routes.post('/user/create', User.create)
routes.post('/user/login', User.login)
routes.get('/user/get', User.getAll)
routes.get('/user/get/:id', User.getOne)
routes.delete('/user/delete/:id', User.delete)
routes.put('/user/update/:id', User.update)
routes.put('/user/updateStatus/:id', User.updateStatus)

//UserDrive-----------------------------------
routes.post('/userDrive/create', UserDrive.create)
routes.post('/userDrive/login', UserDrive.login)
routes.get('/userDrive/get', UserDrive.getAll)
routes.get('/userDrive/get/:id', UserDrive.getOne)
routes.delete('/userDrive/delete/:id', UserDrive.delete)
routes.put('/userDrive/update/:id', UserDrive.update)
routes.put('/userDrive/updateStatus/:id', UserDrive.updateStatus)

//call------------------------------------
routes.post('/call/create', Call.create)
routes.get('/call/get', Call.getAll)
routes.get('/call/get/:id', Call.getOne)
routes.get('/call/getIdDriver', Call.getIdDriver)
routes.get('/call/getIdUser', Call.getIdUser)
routes.get('/call/getStatus', Call.getStatus)
routes.put('/call/updateStatus/:id', Call.updateStatus)
routes.put('/call/updateIdUser/:id', Call.updateIdUser)
routes.put('/call/updateIdDriver/:id', Call.updateIdDriver)
routes.put('/call/updateDriver/:id', Call.updateDriver)
routes.put('/call/updateNota/:id', Call.updateNota)
routes.put('/call/updateReceiveCall/:id', Call.updateReceiveCall)
routes.delete('/call/delete/:id', Call.delete)
routes.delete('/call/delete', Call.deleteMany)

//Socket-----------------------------------
routes.get('/connected', Socket.connected)
routes.get('/canal/:id/:msg', Socket.canal)
routes.get('/refresh', Socket.refresh)

//Control-----------------------------------
routes.get('/control', Control.usersConnected)

//Price
routes.get('/price/get', Price.get)
routes.post('/price/create', Price.create)
routes.put('/price/update/:id', Price.update)
routes.delete('/price/delete/:id', Price.delete)


//Marker
routes.get('/marker/get', Marker.get)
routes.post('/marker/create', Marker.create)
routes.put('/marker/update/:id', Marker.update)
routes.delete('/marker/delete/:id', Marker.delete)


module.exports = routes