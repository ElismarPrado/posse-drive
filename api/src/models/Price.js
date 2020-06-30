const {Schema, model} = require('mongoose')

const PriceSchema = new Schema({
    valor: Number
})

module.exports = model('Price', PriceSchema)