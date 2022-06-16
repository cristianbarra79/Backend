const Usuarios = require("../daos/usuariosDao.js")
const productos = require("../daos/productosDao.js")
const carrito = require("../daos/carritoDao.js")


class factorydao{

    crearDao(data){
        if(data == "usuarios") return Usuarios
        if(data == "productos") return productos
        if(data == "carrito") return carrito
    }
}



const fabrica = new factorydao()
const user = fabrica.crearDao("usuarios")
const producto = fabrica.crearDao("productos")
const carro = fabrica.crearDao("carrito")


module.exports = {user, producto, carro}