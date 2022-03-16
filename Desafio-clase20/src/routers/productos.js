const express = require('express')
const { Router } = express
const {productosDao} = require("../daos/index.js")

const routerProductos = Router()

routerProductos.get('/', async (req, res) => {
    let respuesta = await productosDao.listarAll()
    res.send(respuesta)
})

routerProductos.get('/:id', async (req, res) => {    
    let respuesta = await productosDao.listar(req.params.id)
    res.send(respuesta)
})

routerProductos.post('/', async (req, res) => {
    let respuesta = await productosDao.agregar(req.body)    
    res.send(respuesta)
})

routerProductos.put('/:id', async (req, res) => {
    let respuesta = await productosDao.modificar(req.body, req.params.id)
    res.send(respuesta)
})

routerProductos.delete('/:id', async (req, res) => {
    let respuesta = await productosDao.deleteById(req.params.id)    
    res.send(respuesta)
})

module.exports = routerProductos