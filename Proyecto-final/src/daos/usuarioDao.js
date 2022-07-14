const mongoose = require('mongoose')
const ContenedorMongoDb = require("../contenedor/mongodb.js")
const model = require("../models/usuario")
const mongoDatos = require("../config.js")

class UsuarioDao extends ContenedorMongoDb{
    constructor(){
        super("usuarios", model)
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
            logger.warn(error);
        }
    }
}


const usuarios = new UsuarioDao()
module.exports = usuarios