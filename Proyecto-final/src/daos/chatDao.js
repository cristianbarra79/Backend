const mongoose = require('mongoose')
const ContenedorMongoDb = require("../contenedor/mongodb.js")
const model = require("../models/chat")
const mongoDatos = require("../config.js")
const logger = require("../utils/logger")

class ChatDao extends ContenedorMongoDb{
    constructor(){
        super("chat",model)
    }
    
    async leerMensajes(){
        try {
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)
            let filtrado = await this.modelo.find({},{ "_id": 0})            
            return filtrado            
          } catch (err) {
            logger.warn(err);
          }
    }
    
    
    async guardarMensaje  (data)  { 
        
        try{
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)
            const nuevoMensaje = new this.modelo({
                email: data.email,
                tipo: data.tipo,
                mensaje: data.mensaje                
            })
            let doc = await nuevoMensaje.save();
            return await this.leerMensajes()
        }
        catch(err){
            logger.warn(`Error al escribir: ${err}`);
        }
    }
}

const chat = new ChatDao()
module.exports = chat