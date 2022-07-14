const mongoose = require("mongoose")


class ContenedorMongoDb{
    constructor(collection, schema){
        this.modelo = mongoose.model(collection, schema)        
    }

}

module.exports = ContenedorMongoDb