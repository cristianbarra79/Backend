const mongoose = require("mongoose")
const {mongoDatos} = require("../config.js")



class ContenedorMongoDb{
    constructor(collection, schema){        
        this.modelo = mongoose.model(collection, schema)
    }

    async listarAll(){        
        try {            
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)            
            return await this.modelo.find()            
        } catch (error) {
            console.log(error);
        }
        
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
            console.log(error);
        }
    }

    async agregar(datos){
        if( !datos.title || !datos.price || !datos.description || !datos.image || !datos.count || !datos.codigo){                
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
        }

    }
}


module.exports =  ContenedorMongoDb