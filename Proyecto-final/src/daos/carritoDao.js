const mongoose = require('mongoose')
const ContenedorMongoDb = require("../contenedor/mongodb.js")
const model = require("../models/carrito")
const mongoDatos = require("../config.js")
const logger = require("../utils/logger")

class Carrito extends ContenedorMongoDb{
    constructor(){
        super("carrito",model)
    }

    async crearCarrito(email, direccion){
        try {
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)
            
            let cantidad = await this.modelo.findOne({}, { "id": 1, "_id": 0}, { sort: { _id: -1 } })
            
            if(!cantidad){                
                cantidad = {
                    id: 0
                }
            }
            const nuevoProd = new this.modelo({
                id: cantidad ? cantidad.id +1 : 1,
                email: email,            
                productos: [],
                direccion: direccion
            })
            let doc = await nuevoProd.save();            
            mongoose.connection.close()
            return doc.id
            
        } catch (error) {
            logger.warn(error);            
        }        
    }

    async añadirAlCarrito(id, idprod){
        try {
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)
            let carrito = await this.modelo.find({id:id})        
            if(Object.keys(carrito).length === 0){
                return {error:"No se encuentra carrito"}
            }       
            let prodsCarrito = carrito[0].productos
            let filter = prodsCarrito.findIndex(e => e.idprod === idprod)        
            if (filter > -1) {
                prodsCarrito[filter].cantidad++
            }else{
    
                prodsCarrito.push({
                    idprod: idprod,
                    cantidad: 1
                })
            }
            
            await this.modelo.updateOne({id: id}, {$set: {productos: prodsCarrito }})
            return "producto agregado"
            
        } catch (error) {
            logger.warn(error);
        }

    }

    async filtrarCarrito(id){
        try {
            
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)
            
            let consulta = await this.modelo.find({id: id})            
            if(Object.keys(consulta).length === 0){
                return {error:"No se encuentra carrito"}
            } 
            
            if(Object.keys(consulta[0].productos).length === 0){
                 return {error: "carrito vacio"}
            }
            return consulta[0].productos
        } catch (error) {
            logger.warn(error);
        }
    }

    async eliminarProducto(id,idProd){
        try {
            
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)
            let consulta = await this.modelo.find({id:id})
            
            if(Object.keys(consulta).length === 0){
                return {error:"No se encuentra carrito"}
            }
            let prodCarrito = await this.modelo.find({id:id, productos: {$elemMatch: {idprod:parseInt(idProd)}}})
            
            if(Object.keys(prodCarrito).length === 0){
                return {"error": "No se encuentra producto en carrito"}
            }
            const productosEnCarrito = prodCarrito[0].productos;
            
            const filter = productosEnCarrito.findIndex(e => e.idprod == idProd)
            
            if (filter > -1) {
                if(productosEnCarrito[filter].cantidad > 1){
                    productosEnCarrito[filter].cantidad--
                }else{
                    productosEnCarrito.splice(filter,1)
                }
            }
    
            await this.modelo.updateOne({id:id},{$set: {productos: productosEnCarrito}})
            return "producto eliminado"
        } catch (error) {
            logger.warn(error);   
        }
    }

    async deleteById(id){
        try {
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)

            let resultado = await this.modelo.deleteOne({id: id})
            
            if (resultado.deletedCount < 1) {
                return {"error":"No encontrado"}
            }else return {"msg":"Eliminado"}
        }catch (error) {
            logger.warn("catch ", error);
        }
    }    
}

const carrito = new Carrito()
module.exports = carrito