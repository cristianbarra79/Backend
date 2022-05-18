const mongoose = require("mongoose")
const mongoDatos = require("../config")
const logger = require("../utils/logger")

class ContenedorMongoDb{
    constructor(collection, schema){
        this.modelo = mongoose.model(collection, schema)        
    }

    async listarAll(){
        try {
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)
            let filtrado = await this.modelo.find({}) 
            return filtrado
        } catch (error) {
            logger.error(error)
        }
    }

    async findOne(id){
        try {            
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)
            let filtrado = await this.modelo.find({email : id})            
            
            if (Object.keys(filtrado).length === 0) {
                return { error : 'No encontrado' }
            }else
                return filtrado
        } catch (error) {
            logger.error(error)
        }
    }

    
}
module.exports = ContenedorMongoDb