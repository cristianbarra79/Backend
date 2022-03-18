const mongoose = require('mongoose')
const {mongoDatos} = require("../../config")
ContenedorMongoDb = require("../../contenedores/ContenedorMongoDb");



class CarritoDaoMongoDb extends ContenedorMongoDb{

    constructor(){
        super("carritos",new mongoose.Schema({
            id: {type: Number, require:true},
            timestamp : {type: Date, default: Date.now},
            productos : {type: Array}
        }))
    }

    async crearCarrito(){
        await mongoose.connect(mongoDatos.URL, mongoDatos.option)
        
        let cantidad = await this.modelo.findOne({}, { "id": 1, "_id": 0}, { sort: { _id: -1 } })
        
        
        const nuevoProd = new this.modelo({
            id: cantidad ? cantidad.id +1 : 1,
            productos: []
        })
        let doc = await nuevoProd.save();
        
        return doc.id
        
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
}

module.exports = CarritoDaoMongoDb