const express = require('express')
const { Router } = express
const {productosDao} = require("../daos/index.js")

const routerProductos = Router()

const admin = true

const isAdmin = (req,res,next) => { 
    admin ? next() : 
    res.send({ "error" : -1, "descripcion": "ruta o método no autorizado" }) 
    
}

routerProductos.get('/', async (req, res) => {
    let respuesta = await productosDao.listarAll()
    res.send(respuesta)
})

routerProductos.get('/:id', async (req, res) => {    
    let respuesta = await productosDao.listar(req.params.id)
    res.send(respuesta)
})

routerProductos.post('/', isAdmin, async (req, res) => {
    let respuesta = await productosDao.agregar(req.body)    
    res.send(respuesta)
})

routerProductos.put('/:id', isAdmin, async (req, res) => {
    let respuesta = await productosDao.modificar(req.body, req.params.id)
    res.send(respuesta)
})

routerProductos.delete('/:id', isAdmin, async (req, res) => {
    let respuesta = await productosDao.deleteById(req.params.id)    
    res.send(respuesta)
})

module.exports = routerProductos