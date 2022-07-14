const mongoose = require("mongoose")
require('dotenv').config()
const model = require("../models/usuario")
const modelo = mongoose.model("usuarios", model)
const usuariosDao = require("../daos/usuarioDao")

const time = process.env.TIME || "60s"

const registro = async (req,res,next) =>{
    const {email, password, nombre, direccion, edad, telefono, avatar} = req.body
    let consulta = await usuariosDao.user(email)
    if (consulta.length > 0){
        res.status(401).end("Usuario ya registrado")
    }else{
        const nuevoUser = new modelo({
        email: email, 
        password: password,
        nombre:nombre ,
        direccion:direccion ,
        edad:edad,
        avatar:avatar,
        telefono:telefono
    })
    let doc = await nuevoUser.save();
    next()
    }

}

/* --------- LOGIN ---------- */

const jwt = require("jsonwebtoken")
const PRIVATE_KEY = '1234567890!@#$%^&*()';

function generateToken(user) {
    const token = jwt.sign(user.toJSON(), PRIVATE_KEY, {expiresIn: time})
    return token;
}

/* --------- AUTH ---------- */

function auth(req, res, next) {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"] || '';    
    
    if (!authHeader) {      
      return res.status(401).json({
        error: 'se requiere autenticacion para acceder a este recurso',
        detalle: 'no se encontró token de autenticación'
      })
    }
    let token
    if (/\s/.test(authHeader)) {
      token = authHeader.split(' ')[1]
    }else{
      token = authHeader
    }
    
  
    if (!token) {      
      return res.status(401).json({
        error: 'se requiere autenticacion para acceder a este recurso',
        detalle: 'formato de token invalido!'
      })
    }
  
    try {
      req.user = jwt.verify(token, PRIVATE_KEY);
    } catch (ex) {      
      return res.status(403).json({
        error: 'token invalido',
        detalle: 'nivel de acceso insuficiente para el recurso solicitado'
      })
    }
  
    next();
}

module.exports = {auth, generateToken, registro}