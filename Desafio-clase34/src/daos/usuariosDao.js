const mongoose = require('mongoose')
ContenedorMongoDb = require("../contenedores/MongoAtlas.js");
const mongoDatos = require("../config");
const logger = require('../utils/logger.js');

class Usuarios extends ContenedorMongoDb{
    constructor(){
        super("usuarios",new mongoose.Schema({
            email: {type: String, require:true, max: 100},
            password: {type: String, require:true, max: 300},
            nombre: {type: String, require:true, max: 250},
            direccion: {type: String, require:true, max: 200},
            edad: {type: Number, require:true},
            telefono: {type: Number, require:true},
            avatar: {type: String, require:true, max: 250}
        }))
    }

    async guardar(datos){
        try {
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)
            const nuevoUser= new this.modelo({
                email: datos.email,
                password: datos.password,
                nombre: datos.nombre,
                direccion: datos.direccion,
                edad: datos.edad,
                telefono: datos.telefono,
                avatar: datos.avatar
            })
            return await nuevoUser.save();
            
        } catch (error) {
            logger.error(error);
        }
    }

    async user(email){
        try {
            await mongoose.connect(mongoDatos.URL, mongoDatos.option)
            let filtrado = await this.modelo.find({email : email})
            return filtrado
        } catch (error) {
            logger.error(error);
        }
    }
}

const user = new Usuarios()
module.exports = user