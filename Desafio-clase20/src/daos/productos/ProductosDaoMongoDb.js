const mongoose = require('mongoose')
ContenedorMongoDb = require("../../contenedores/ContenedorMongoDb");


class ProductosDaoMongoDb extends ContenedorMongoDb{

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
}

module.exports = ProductosDaoMongoDb