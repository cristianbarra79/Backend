const mongoose = require("mongoose")
require('dotenv').config()
const mensajes = process.env.MENSAJE

const mongoDatos = {
    URL : mensajes,
    option: {
        useNewUrlParser: true,
        useUnifiedTopology : true
    }
}

class usuarios{
    constructor(collection, schema){
        this.url = "mongodb://localhost:27017/chats",
        this.option = {
            useNewUrlParser: true,
            useUnifiedTopology : true
        },
        this.modelo = mongoose.model(collection, schema)
    }
}


const usuario = new usuarios("usuarios",new mongoose.Schema({
    email: {type: String, require:true},
    password: {type: String, require:true}
    })
)
module.exports = usuario