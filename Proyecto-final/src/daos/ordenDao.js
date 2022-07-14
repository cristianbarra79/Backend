const mongoose = require('mongoose')
const ContenedorMongoDb = require("../contenedor/mongodb.js")
const model = require("../models/orden")
const mongoDatos = require("../config.js")
const logger = require("../utils/logger")

class OrdenDao extends ContenedorMongoDb{
    constructor(){
        super("ordenes",model)
    }
    
    async guardarOrden(prods, email){
        try {
            
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)
            let cantidad = await this.modelo.findOne({}, { "numeroOrden": 1, "_id": 0}, { sort: { _id: -1 } })        
            if(!cantidad){                
                cantidad = {
                    numeroOrden: 0
                }
            }        
            const nuevaOrden = new this.modelo({
                numeroOrden: cantidad.numeroOrden +1,                
                productos: prods,
                email: email
            })
            let doc = await nuevaOrden.save();            
            return doc
        } catch (error) {
            logger.warn(`Error al guardar orden: ${error}`);
        }
    }
}

const nuevaOrden = new OrdenDao()
module.exports = nuevaOrden