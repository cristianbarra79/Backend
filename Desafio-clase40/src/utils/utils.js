const mongoose = require('mongoose')

ContenedorMongoDb = require("../contenedores/MongoAtlas.js");
const mongoDatos = require("../config")
const carritoDao = require("../daos/carritoDao")

const login = (req,res,next) => {
    if (req.session?.email) {
        next()
    }else
        res.send({ "error" : -1, "descripcion": "ruta o método no autorizado" })
}

const miCarrito = async (req,res,next) => {
    await mongoose.connect(mongoDatos.URL, mongoDatos.option)
    let carrito = await carritoDao.modelo.find({id:req.params.id, idSesion: req.session.id})
    if(Object.keys(carrito).length === 0){
        res.end("Cree su propio carrito")
    }else
        next()
}

const validar = (req, res, next) => { 
    if( !req.body.email || !req.body.nombre || !req.body.direccion || !req.body.edad || !req.body.telefono || !req.body.avatar){                
        res.end("faltan datos")
    }
    next()
}


module.exports = {login, miCarrito, validar}