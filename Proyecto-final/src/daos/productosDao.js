const mongoose = require('mongoose')
const ContenedorMongoDb = require("../contenedor/mongodb.js")
const model = require("../models/productos")
const mongoDatos = require("../config.js")
const logger = require("../utils/logger")

class ProductosDao extends ContenedorMongoDb{

    constructor(){
        super("productos", model)
    }

    async listarAll(){
        try {
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)
            let filtrado = await this.modelo.find({},{ "_id": 0})            
            
            return filtrado
        } catch (error) {
            logger.warn(error);
        }
    }

    async listar(id){
        try {
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)
            let filtrado = await this.modelo.find({id : id},{"_id": 0})            
            
            if (Object.keys(filtrado).length === 0) {
                return { error : 'No encontrado' }
            }else
                return filtrado[0]
        } catch (error) {
            logger.warn(error);
        }
    }

    async agregar(datos){
        
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
                price: datos.price,
                title: datos.title,
                description: datos.description,
                count: datos.count,
                image: datos.image,
                category: datos.category
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
            let resultado = await this.modelo.findOneAndUpdate({id:id}, datos)            
            return {"msg":"actualizado"}
            
        } catch (error) {
            logger.warn(error);
        }
    }

    async deleteById(id){
        try {
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)
            let resultado = await this.modelo.deleteOne({id:id})            
            return {"msg":"Eliminado"}
        }catch (error) {
            logger.error(error);
        }

    }
}


const productos = new ProductosDao()
module.exports = productos