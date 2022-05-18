const express = require('express')
const { Router } = express
const carritoDao = require("../daos/carritoDao")
const productosDao = require("../daos/productosDao")

const {login, miCarrito} = require("../utils/utils.js")

const routerCarrito = Router()

routerCarrito.post("/", login, async (req,res)=> {    
    let respuesta = await carritoDao.crearCarrito(req.session.id)
    res.send({"id": respuesta})
})

routerCarrito.delete("/:id", login, miCarrito, async (req,res)=> {
    let respuesta = await carritoDao.deleteById(req.params.id)    
    res.send(respuesta)
})

routerCarrito.get("/:id/productos", login, miCarrito, async (req,res)=>{
    let respuesta = await carritoDao.filtrarCarrito(req.params.id)
    res.send(respuesta)
})

routerCarrito.post("/:id/productos", login, miCarrito, async (req,res)=>{    
    let producto = await productosDao.listar(req.body.id)
    producto.error? res.send(producto) : res.send(await carritoDao.añadirAlCarrito(req.params.id, producto))
})

routerCarrito.delete('/:id/productos/:id_prod', login, miCarrito, async (req, res) =>{
    let respuesta = await carritoDao.eliminarProducto(req.params.id, req.params.id_prod)
    res.send(respuesta)
})

routerCarrito.post("/:id/finalizar", login, miCarrito, async (req,res)=>{    
    let respuesta = await carritoDao.finalizar(req.session.email, req.params.id )
    res.send(respuesta)
})

module.exports = routerCarrito