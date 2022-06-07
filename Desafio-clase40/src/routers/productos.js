const express = require('express')
const { Router } = express
const productosDao = require("../daos/productosDao.js")
const productoDao = require("../logica/productos.js")
const {login} = require("../utils/utils.js")
const repoProductos = require("../logica/repository.js")


const routerProductos = Router()


routerProductos.get('/', login, async (req, res) => {
    let respuesta = await productosDao.listarAll()
    res.send(respuesta)
})

routerProductos.get('/:id', login, async (req, res) => {    
    //let respuesta = await productosDao.listar(req.params.id)
    let respuesta = await productoDao(req.params.id)
    res.send(respuesta)
})

routerProductos.post('/', login, async (req, res) => {
    let respuesta = await repoProductos.add(req.body)    
    //let respuesta = await productosDao.agregar(req.body)    
    res.send(respuesta)
})

routerProductos.put('/:id', login, async (req, res) => {
    let respuesta = await productosDao.modificar(req.body, req.params.id)
    res.send(respuesta)
})

routerProductos.delete('/:id', login, async (req, res) => {
    let respuesta = await productosDao.deleteById(req.params.id)    
    res.send(respuesta)
})

module.exports = routerProductos