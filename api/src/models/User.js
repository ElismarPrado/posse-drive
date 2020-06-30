const {Schema, model} = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const UserSchema = new Schema({
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
    password:{
        type: String,
        required: true,
        select: false,
    },
    status:{
        type: Boolean,
        default: true,
    },
    createAt:{
        type: Date,
        default: Date.now,
    }, 
})

UserSchema.plugin(mongoosePaginate)
module.exports = model('User', UserSchema)