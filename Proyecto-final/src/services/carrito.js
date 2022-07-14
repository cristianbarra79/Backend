const carritoDao = require("../daos/carritoDao")
const productosDao = require("../daos/productosDao")
const ordenDao = require("../daos/ordenDao")

const {enviarPedido} = require("../utils/nodemailer")

const carritoDto = require("../dto/carritoDto")

class carrito{

    async nuevoCarrito(email, direccion){        
        const doc = await carritoDao.crearCarrito(email, direccion)
        return doc
    }    

    async borrarCarrito(id){
        if (isNaN(id)) {
            return {error: "El id del carrito debe ser un numero"}
        }
        const respuesta = await carritoDao.deleteById(id)
        return respuesta
    }

    async agregarProducto(id, prod){
        if (isNaN(id)) {
            return {error: "El id del carrito debe ser un numero"}
        }
        let respuesta = await productosDao.listar(prod)        
        if (respuesta.error) {
            return respuesta
        }

        let resp = carritoDao.añadirAlCarrito(id, respuesta.id)
        return resp

    }

    async borrarProducto(id, idprod){
        if (isNaN(id)) {
            return {error: "El id del carrito debe ser un numero"}
        }
        let respuesta = await carritoDao.eliminarProducto(id, idprod)
        return respuesta
    }

    async mostrarProductos(id){
        if (isNaN(id)) {
            return {error: "El id del carrito debe ser un numero"}
        }
        let respuesta = await carritoDao.filtrarCarrito(id)        
        if (respuesta.error) {
            return respuesta            
        }
        const productos = []
        for (const e of respuesta){
            
            let producto = await productosDao.listar(e.idprod)
            let Dto = new carritoDto(producto, e.cantidad) // Uso de DTO para devolver productos y cantidades           
            productos.push(Dto)
        }
        return productos
    }

    async finalizar(user, id){
        if (isNaN(id)) {
            return {error: "El id del carrito debe ser un numero"}
        }
        const productosEnCarrito = await this.mostrarProductos(id)
        if (productosEnCarrito.error) {
            return productosEnCarrito
        }
        const generarOrden = await ordenDao.guardarOrden(productosEnCarrito, user.email)        
        const resp = await enviarPedido(generarOrden, user.nombre)
        await carritoDao.deleteById(id)        
        if (resp) {
            return "Pedido exitoso"
        }else
            return {error:"Falla en el pedido"}
    }
}

const carritoService = new carrito
module.exports = carritoService