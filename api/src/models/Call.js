const {Schema, model} = require('mongoose')

const CallSchema = new Schema({
    idUser: String,
    name: String,
    fone: String,
    latitude: String,
    longitude: String,
    minLatitude: Number,
    maxLatitude: Number,
    minLongitude: Number,
    maxLongitude: Number,
    hour: Number,
    min: Number,
    sec: Number,
    
    cont:{
        type: Number,
        default: 0,
    },

    status: String,
    distance:Number,
    enderecoDestino: String,
    latitudeDestino: String,
    longitudeDestino: String,
    titleDestino: String,
    valor: String,
    idDriver:{
        type: String,
        default: null,
    },
    nameDriver:{
        type: String,
        default: null,
    },
    foneDriver:{
        type: String,
        default: null,
    },
    latDriver:{
        type: String,
        default: null,
    },
    lgtDriver:{
        type: String,
        default: null,
    },
    notaDriver:{
        type: Number,
        default: 5,
    },
    placa:{
        type: String,
        default: null,
    },
    carro:{
        type: String,
        default: null,
    },

    receiveCall: []

})

module.exports = model('Call', CallSchema)
