const {Schema, model} = require('mongoose')

const MarkerSchema = new Schema({
    date: []
})

module.exports = model('Marker', MarkerSchema)