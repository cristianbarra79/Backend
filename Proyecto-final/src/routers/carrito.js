const express = require('express')
const { Router } = express
const carrito = require("../services/carrito")
const {auth} = require("../utils/jwt")

const routerCarrito = Router()

routerCarrito.post("/", auth, async (req,res)=> {    
    let respuesta = await carrito.nuevoCarrito(req.user.email, req.user.direccion)
    res.send({"id": respuesta})
})

routerCarrito.delete("/:id", auth, async (req,res)=> {
    let respuesta = await carrito.borrarCarrito(req.params.id)    
    res.send(respuesta)
})

routerCarrito.get("/:id/productos", auth, async (req,res)=>{
    let respuesta = await carrito.mostrarProductos(req.params.id)
    res.send(respuesta)
})

routerCarrito.post("/:id/productos", auth, async (req,res)=>{
    let respuesta = await carrito.agregarProducto(req.params.id, req.body.id)
    res.send(respuesta)    
})

routerCarrito.delete('/:id/productos/:id_prod', auth, async (req, res) =>{
    let respuesta = await carrito.borrarProducto(req.params.id, req.params.id_prod)
    res.send(respuesta)
})

routerCarrito.post("/:id/finalizar", auth, async (req,res)=>{
    let respuesta = await carrito.finalizar(req.user, req.params.id)
    res.send(respuesta)
})

module.exports = routerCarrito