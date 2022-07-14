const express = require('express')
const { Router } = express
const usuarioService = require("../services/usuario")
const { auth } = require("../utils/jwt.js")

const routerUsuario = Router()

routerUsuario.get('/login', (req, res) => {    
    res.send("envie email y password")
})

routerUsuario.post("/login", async (req,res) =>{    
    let respuesta = await usuarioService.login(req.body)    
    res.send(respuesta)
})

routerUsuario.get("/register",  (req,res) =>{
    res.send("envie email, password, nombre, direccion, edad, avatar y telefono")
})

routerUsuario.post("/register", async  (req,res) =>{
    let respuesta = await usuarioService.registrar(req.body)
    res.send(respuesta)
})

routerUsuario.get('/perfil', auth, async (req, res) => {    
    const {email, nombre, direccion, edad, avatar, telefono } = req.user    
    res.send({
        email:email,
        nombre: nombre, 
        direccion: direccion, 
        edad: edad, 
        avatar: avatar, 
        telefono: telefono
    })
})

module.exports = routerUsuario