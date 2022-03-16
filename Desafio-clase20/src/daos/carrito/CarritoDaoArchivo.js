const fs = require('fs')
ContenedorArchivo = require("../../contenedores/ContenedorArchivo");

class CarritoDaoArchivo extends ContenedorArchivo{

    constructor(){
        super("./carrito.txt")
    }

    async crearCarrito() {
        const datos = await this.listarAll()
        let indice = datos.length > 0 ? datos[datos.length-1].id+1 : 1
        let fecha = new Date()
        let carrito = {id : indice, timestamp: fecha, productos : []}
        datos.push(carrito)        
        await this.saveAll(datos)
        return indice        
    }

    async filtrarCarrito(id){
        const datos = await this.listarAll()   
        const carrito = datos.find(prod => prod.id == id)
        if (!carrito) {
            return { "error" : `carrito no encontrado` }
        }else
            return carrito
        
    }

    async añadirAlCarrito(id, producto){

        if (producto.Error) {
            return producto
        }
        const datos = await this.listarAll() 
        const indice = datos.findIndex(x => x.id == id) 
        if (indice >= 0){
            datos[indice].productos.push(producto)
            await this.saveAll(datos)
            return "Producto añadido"
        }else{
            return "Carrito no encontrado"
        }    
    } 

    async eliminarProducto(id, idProd){
        const carrito = await this.listarAll()
        const indice = carrito.findIndex(x => x.id == id)    
        if (indice >= 0) {
            const productosEnCarrito = carrito[indice].productos        
            const indiceProd = productosEnCarrito.findIndex(x => x.id == idProd)
            if  (indiceProd >= 0){            
                carrito[indice].productos.splice(indiceProd,1)
                await this.saveAll(carrito)
                return "producto eliminado"
            }else{
                return{"mensaje":"No se encuentra producto"}         
            }
        }else{
            return {"mensaje":"No se encuentra carrito"}            
        }    
    }

}

module.exports =  CarritoDaoArchivo 