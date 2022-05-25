const mongoose = require("mongoose")
require('dotenv').config()
const mensajes = process.env.MENSAJE

const normalizr = require("normalizr")
const normalize = normalizr.normalize
const schema = normalizr.schema

const mongoDatos = {
    URL : mensajes,
    option: {
        useNewUrlParser: true,
        useUnifiedTopology : true
    }
}


const schemamongo = new mongoose.Schema({
    author:{
        mail: {type: String, require:true},
        nombre : {type: String, require:true},
        apellido : {type: String, require:true},
        edad:{type: Number, require:true},
        alias:{type: String, require:true},
        avatar:{type: String, require:true}
    },
    fyh:{type: String, require:true},
    text:{type: String, require:true}
})

class chat{
    constructor(){        
        this.modelo = mongoose.model("chats", schemamongo)
    }

    async pedirDatos(){
        await mongoose.connect(mongoDatos.URL, mongoDatos.option)
        const resp = await this.modelo.find()         
        
        
        const users = new schema.Entity('author')

        
        const text = new schema.Entity('text', {
            author: users
        })

        const normalizados = normalize(
            { id: 'mensajes', messages: resp },
            text
        );        

        return normalizados        
    }
 
    async guardarChat(datos){        
        await mongoose.connect(mongoDatos.URL, mongoDatos.option)
        const nuevoProd = new this.modelo(datos)
        let doc = await nuevoProd.save();
        
    }
}

const chats = new chat()

module.exports = chats