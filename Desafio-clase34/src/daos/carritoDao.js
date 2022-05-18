const mongoose = require('mongoose')
ContenedorMongoDb = require("../contenedores/MongoAtlas.js");
const mongoDatos = require("../config");

const user = require('./usuariosDao.js');
const {enviarPedido} = require("../utils/nodemailer");
const logger = require('../utils/logger.js');

class Carrito extends ContenedorMongoDb{
    constructor(){
        super("carrito",new mongoose.Schema({
            id: {type: Number, require:true},
            idSesion: {type: String, require:true, max: 100},            
            productos : {type: Array}
        }))
    }

    async crearCarrito(id){
        await mongoose.connect(mongoDatos.URL, mongoDatos.option)
        
        let cantidad = await this.modelo.findOne({}, { "id": 1, "_id": 0}, { sort: { _id: -1 } })
        
        
        const nuevoProd = new this.modelo({
            id: cantidad ? cantidad.id +1 : 1,
            idSesion: id,
            productos: []
        })
        let doc = await nuevoProd.save();
        mongoose.connection.close()
        return doc.id
        
    }

    async añadirAlCarrito(id, datos){
        await mongoose.connect(mongoDatos.URL, mongoDatos.option)
        let carrito = await this.modelo.find({id:id})        
        if(Object.keys(carrito).length === 0){
            return "No se encuentra carrito"
        }        
        let prodsCarrito = carrito[0].productos
        prodsCarrito.push(datos[0])
        
        await this.modelo.updateOne({id: id}, {$set: {productos: prodsCarrito }})
        return "producto agregado"

    }

    async filtrarCarrito(id){
        
        await mongoose.connect(mongoDatos.URL, mongoDatos.option)
        
        let consulta = await this.modelo.find({id: id})
        if(Object.keys(consulta).length === 0){
            return "No se encuentra carrito"
        } 
        
        if(Object.keys(consulta[0].productos).length === 0){
             return "carrito vacio"
        }
        return consulta[0].productos
    }

    async eliminarProducto(id,idProd){
        
        await mongoose.connect(mongoDatos.URL, mongoDatos.option)
        let carrito = await this.modelo.find({id:id})
        
        if(Object.keys(carrito).length === 0){
            return "No se encuentra carrito"
        }
        let prodCarrito = await this.modelo.find({id:id, productos: {$elemMatch: {id:parseInt(idProd)}}})
        if(Object.keys(prodCarrito).length === 0){
            return "No se encuentra producto en carrito"
        }
        await this.modelo.updateOne({id:id},{$pull: {productos: {id:parseInt(idProd)}}})
        return "producto eliminado"
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

    async finalizar(email, id){
        const usuario = await user.findOne(email)        
        const productos = await this.filtrarCarrito(id)
        productos.forEach(element => {
            delete element._id
            delete element.__v
            
       })
        const resp = enviarPedido(productos, usuario[0].nombre, usuario[0].email)
        if (resp) {
            return "Pedido exitoso"
        }else
            return "Falla en el pedido"
        
    }
}

const carrito = new Carrito()
module.exports = carrito