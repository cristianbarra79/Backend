const express = require('express')
const { Router } = express
const {carritoDao, productosDao} = require("../daos/index.js")

const routerCarrito = Router()

routerCarrito.post("/", async (req,res)=> {
    let respuesta = await carritoDao.crearCarrito()
    res.send({"id": respuesta})
})

routerCarrito.delete("/:id", async (req,res)=> {
    let respuesta = await carritoDao.deleteById(req.params.id)    
    res.send(respuesta)
})

routerCarrito.get("/:id/productos", async (req,res)=>{
    let respuesta = await carritoDao.filtrarCarrito(req.params.id)
    res.send(respuesta)
})

routerCarrito.post("/:id/productos", async (req,res)=>{    
    let producto = await productosDao.listar(req.body.id)
    producto.error? res.send(producto) : res.send(await carritoDao.añadirAlCarrito(req.params.id, producto))
})

routerCarrito.delete('/:id/productos/:id_prod', async (req, res) =>{
    let respuesta = await carritoDao.eliminarProducto(req.params.id, req.params.id_prod)
    res.send(respuesta)
})

module.exports = routerCarrito