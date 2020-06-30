const {Schema, model} = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const UserDriveSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        lowercase: true,
        unique: true,
    },
    fone:{
        type: String,
        required: true,
    },
    cpf:{
        type: String,
        required: true,
    },
    cnh:{
        type: String,
        required: true,
    },
    carro:{
        type: String,
        required: true,
    },
    placa:{
        type: String,
        required: true,
    },
    renavam:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
        select: false,
    },
    createAt:{
        type: Date,
        default: Date.now,
    }, 
    nota:{
        type: Number,
        required: true,
        default: 5,
    },
    status:{
        type: Boolean,
        default: false,
    },
})


UserDriveSchema.plugin(mongoosePaginate)
module.exports = model('UserDrive', UserDriveSchema)