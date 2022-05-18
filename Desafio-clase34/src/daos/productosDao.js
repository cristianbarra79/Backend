const mongoose = require('mongoose')
ContenedorMongoDb = require("../contenedores/MongoAtlas.js");
const mongoDatos = require("../config");
const logger = require('../utils/logger.js');

class Productos extends ContenedorMongoDb{

    constructor(){
        super("productos",new mongoose.Schema({
            id: {type: Number, require:true},
            title: {type: String, require:true, max: 100},
            price: {type: Number, require:true},
            description: {type: String, require:true, max: 250},
            image: {type: String, require:true, max: 200},
            count: {type: Number, require:true},
            codigo: {type: Number, require:true}
        }))
    }

    async listar(id){
        try {
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)
            let filtrado = await this.modelo.find({id : id})            
            
            if (Object.keys(filtrado).length === 0) {
                return { error : 'No encontrado' }
            }else
                return filtrado
        } catch (error) {
            logger.error(error);
        }
    }
    async agregar(datos){
        if( !datos.title || !datos.price || !datos.description || !datos.image || !datos.count){                
            return {"message" : "faltan datos"};
        }
        try {
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)

            let cantidad = await this.modelo.findOne({}, { "id": 1, "_id": 0}, { sort: { _id: -1 } })            
            if(!cantidad){                
                cantidad = {
                    id: 0
                }
            }
            const nuevoProd = new this.modelo({
                id: cantidad.id +1,
                title: datos.title,
                price: datos.price,
                description: datos.description,
                image: datos.image,
                count: datos.count,
                codigo: datos.codigo
            })
            let doc = await nuevoProd.save();
            
            return doc
        } catch (error) {
            logger.error(error);
        }
    }

    async modificar(datos, id){
        try {
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)
            let resultado = await this.modelo.findOneAndUpdate({id:id}, datos);
            if (!resultado) {
                return "Producto no encontrado"
            }
            return "Producto actualizado"
            
        } catch (error) {
            logger.error(error);
        }
    }

    async deleteById(id){
        try {
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)
            let resultado = await this.modelo.deleteOne({id:id})            
            if (resultado.deletedCount===0) {
                return {"msg":"No encontrado"}
            }else return {"msg":"Eliminado"}
        }catch (error) {
            logger.error(error);
        }

    }
}


const productos = new Productos()
module.exports = productos