const Call = require('../models/Call')
const Marker = require('../models/Marker')
const fetch = require('node-fetch')

module.exports = {
	async usersConnected(req, res){
		res.json(req.connectedUsers)
	}
}

//logica para mudar raioRange
async function callDate(){
const calls = await Call.find()

calls.map(date=>(
verify(date._id, date.cont, date.latitude, date.longitude, date.status, date.idUser)
))
}

async function verify(id, cont, latitude, longitude, status, idUser){
var maxlat = null
var minlat = null
var maxlgt = null
var minlgt = null

var latitudeF = Number(latitude).toFixed(4)
var longitudeF = Number(longitude).toFixed(4)

if(status == 'AGUARDANDO' && cont == 0){
	maxlat = latitudeF - 0.0050
	minlat = (latitudeF) - (-0.0050)
	maxlgt = longitudeF - 0.0050
	minlgt = (longitudeF) - (-0.0050)

	await Call.findByIdAndUpdate(id ,{ 
		cont: 1,
		maxLatitude: Number(maxlat).toFixed(4),
		minLatitude: Number(minlat).toFixed(4),
		maxLongitude: Number(maxlgt).toFixed(4),
		minLongitude: Number(minlgt).toFixed(4),
	})
	await fetch('http://3.23.146.65:3000/canal/all-drivers/newcall')
	}

	else if(status == 'AGUARDANDO' && cont == 1){
		maxlat = latitudeF - 0.0100
		minlat = (latitudeF) - (-0.0100)
		maxlgt = longitudeF - 0.0100
		minlgt = (longitudeF) - (-0.0100)

		await Call.findByIdAndUpdate(id ,{ 
			cont: 2,
			maxLatitude: Number(maxlat).toFixed(4),
			minLatitude: Number(minlat).toFixed(4),
			maxLongitude: Number(maxlgt).toFixed(4),
			minLongitude: Number(minlgt).toFixed(4),
		})
		await fetch('http://3.23.146.65:3000/canal/all-drivers/newcall')
	}

	else if(status == 'AGUARDANDO' && cont == 2){
		maxlat = latitudeF - 0.0150
		minlat = (latitudeF) - (-0.0150)
		maxlgt = longitudeF - 0.0150
		minlgt = (longitudeF) - (-0.0150)

		await Call.findByIdAndUpdate(id ,{ 
			cont: 3,
			maxLatitude: Number(maxlat).toFixed(4),
			minLatitude: Number(minlat).toFixed(4),
			maxLongitude: Number(maxlgt).toFixed(4),
			minLongitude: Number(minlgt).toFixed(4),
		})
		await fetch('http://3.23.146.65:3000/canal/all-drivers/newcall')
	}

	else if(status == 'AGUARDANDO' && cont == 3){
		maxlat = latitudeF - 0.0200
		minlat = (latitudeF) - (-0.0200)
		maxlgt = longitudeF - 0.0200
		minlgt = (longitudeF) - (-0.0200)

		await Call.findByIdAndUpdate(id ,{ 
			cont: 4,
			maxLatitude: Number(maxlat).toFixed(4),
			minLatitude: Number(minlat).toFixed(4),
			maxLongitude: Number(maxlgt).toFixed(4),
			minLongitude: Number(minlgt).toFixed(4),
		})
		await fetch('http://3.23.146.65:3000/canal/all-drivers/newcall')
	}

	else if(status == 'AGUARDANDO' && cont == 4){
		maxlat = latitudeF - 0.0400
		minlat = (latitudeF) - (-0.0400)
		maxlgt = longitudeF - 0.0400
		minlgt = (longitudeF) - (-0.0400)

		await Call.findByIdAndUpdate(id ,{ 
			cont: 5,
			maxLatitude: Number(maxlat).toFixed(4),
			minLatitude: Number(minlat).toFixed(4),
			maxLongitude: Number(maxlgt).toFixed(4),
			minLongitude: Number(minlgt).toFixed(4), 
		})
		await fetch('http://3.23.146.65:3000/canal/all-drivers/newcall')
	}

	else if(status == 'AGUARDANDO' && cont == 5){
		maxlat = latitudeF - 0.0600
		minlat = (latitudeF) - (-0.0600)
		maxlgt = longitudeF - 0.0600
		minlgt = (longitudeF) - (-0.0600)

		await Call.findByIdAndUpdate(id ,{ 
			cont: 6,
			maxLatitude: Number(maxlat).toFixed(4),
			minLatitude: Number(minlat).toFixed(4),
			maxLongitude: Number(maxlgt).toFixed(4),
			minLongitude: Number(minlgt).toFixed(4), 
		})
		await fetch('http://3.23.146.65:3000/canal/all-drivers/newcall')
	}

	else if(status == 'AGUARDANDO' && cont == 6){
		maxlat = latitudeF - 0.1000
		minlat = (latitudeF) - (-0.1000)
		maxlgt = longitudeF - 0.1000
		minlgt = (longitudeF) - (-0.1000)

		await Call.findByIdAndUpdate(id ,{ 
			cont: 7,
			maxLatitude: Number(maxlat).toFixed(4),
			minLatitude: Number(minlat).toFixed(4),
			maxLongitude: Number(maxlgt).toFixed(4),
			minLongitude: Number(minlgt).toFixed(4),
		 })
		await fetch('http://3.23.146.65:3000/canal/all-drivers/newcall')
	}

	else if(status == 'AGUARDANDO' && cont == 7){
		await Call.findByIdAndUpdate(id ,{ status: "NO-DRIVER" })
		await fetch(`http://3.23.146.65:3000/canal/${idUser}/no-driver`)
		await fetch(`http://3.23.146.65:3000/canal/all-drivers/atualiza`)
	}

}


async function setPosition(){
await fetch(`http://3.23.146.65:3000/refresh`)
}

async function clear(){
	const marker = await Marker.find()
	await Marker.findByIdAndUpdate(marker[0]._id, {
	date: []
	})
}

setInterval(()=>{setPosition()},1000)

setInterval(()=>{clear()},10000)

setInterval(()=>{callDate()},10000)

