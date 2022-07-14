const express = require('express')
const { Router } = express
const productos = require("../services/productos")
const {auth} = require("../utils/jwt")

const routerProductos = Router()

routerProductos.get('/',  auth, async (req, res) => {    
    let respuesta = await productos.listar()
    if (respuesta.error) {
        res.status(404).send(respuesta.error)
    }else
        res.send(respuesta)        
})

routerProductos.get('/:id', auth, async (req, res) => {    
    let respuesta = await productos.listar(req.params.id)
    if (respuesta.error) {
        res.status(404).send(respuesta.error)
    }else
        res.send(respuesta)
})
routerProductos.get('/:categoria', auth, async (req, res) => {    
    let respuesta = await productos.listarCategoria(req.params.categoria)
    if (respuesta.error) {
        res.status(404).send(respuesta.error)
    }else
        res.send(respuesta)
})

routerProductos.post('/', auth, async (req, res) => {
    let respuesta = await productos.agregar(req.body)
    res.send(respuesta)
})

routerProductos.put('/:id', auth, async (req, res) => {
    let respuesta = await productos.modificar(req.body, req.params.id)    
    if (respuesta.error) {
        res.status(404).send(respuesta.error)
    }else
        res.send(respuesta)
})

routerProductos.delete('/:id', auth, async (req, res) => {
    let respuesta = await productos.borrar(req.params.id)    
    if (respuesta.error) {
        res.status(404).send(respuesta.error)
    }else
        res.send(respuesta)
})

module.exports = routerProductos