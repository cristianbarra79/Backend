const express = require('express')
const { Router } = express

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bCrypt = require('bcrypt');

const mongoose = require("mongoose")
const mongoDatos = require("../config.js")


const { validar } = require('../utils/utils');
const {enviar} = require("../utils/nodemailer")
const usuario = require("../daos/usuariosDao");
const logger = require('../utils/logger.js');

const routerUsuario = Router()

 
function isValidPassword(user, password) {
    return bCrypt.compareSync(password, user.password);
}

passport.use('login', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        session: false
    },
    (username, password, done) => {
        mongoose.connect(mongoDatos.URL, mongoDatos.option)
        usuario.modelo.findOne({ email: username }, (err, user) => {
        if (err)
          return done(err);
   
        if (!user) {
          logger.error('User Not Found with username ' + username);
          
          return done(null, false);
        }
   
        if (!isValidPassword(user, password)) {
            logger.warn('Invalid Password');
            
            return done(null, false);
        }     
        
        return done(null, user);
        
      });
    })
);

passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password',
    session: false
   },
   (req, username, password, done) => {
    mongoose.connect(mongoDatos.URL, mongoDatos.option)
    usuario.modelo.findOne({ 'email': username }, function (err, user) {

       if (err) {
            logger.error('Error in SignUp: ' + err);
            return done(err);
        }

        if (user) {
            logger.warn('User already exists');
            return done(null, false)
        }

        const newUser = {            
            password: createHash(password),
            email: req.body.email,
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            edad: req.body.edad,
            telefono: req.body.telefono,
            avatar: req.body.avatar
        }
        
        
        usuario.modelo.create(newUser, (err, userWithId) => {
            if (err) {
                logger.error('Error in Saving user: ' + err);
                return done(err);
            }
            enviar(newUser)
            logger.info('User Registration succesful');
            return done(null, userWithId);
            });
        });
    })
)
     
function createHash(password) {
    return bCrypt.hashSync(
            password,
            bCrypt.genSaltSync(10),
            null);
}

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    usuario.modelo.findById(id, done);
});


const perfil = async(email) => {
    mongoose.connect(mongoDatos.URL, mongoDatos.option)
    const datos = await usuario.modelo.findOne({ email: email })
    return datos
}


routerUsuario.get('/login', (req, res) => {
    if (req.session.email) {
        res.send(req.session.id)
    }else
        res.send("envie email y password")
})

routerUsuario.post("/login", passport.authenticate('login', { failureRedirect: '/faillogin' }), (req,res) =>{
    req.session.email = req.body.email
    res.send(req.session.id);
})

routerUsuario.get('/faillogin', (req, res) => {
    res.send("Error al loguearse")
})

routerUsuario.get("/register", (req,res) =>{    
    res.send("envie email, password, nombre, direccion, edad, telefono, avatar ")
})

routerUsuario.post("/register", validar ,passport.authenticate('register', { failureRedirect: '/failregister' }),(req,res) =>{

    res.send("Registro exitoso")
    
})

routerUsuario.get('/failregister', (req, res) => {
    res.send("Error al registrarse")
})

routerUsuario.get('/perfil', async (req, res) => {
    if (req.session.email) {
        const datos = await perfil(req.session.email)
        const {email, nombre, direccion, edad, telefono, avatar} = datos
        res.send({email: email, nombre:nombre, direccion: direccion, edad:edad, telefono: telefono, avatar: avatar})
    }else
        res.send("No esta logueado")
})

routerUsuario.post('/logout', (req, res) => {
    req.session.destroy( err => {
        if(!err) res.send("deslogueado")
        else res.send({status: 'Logout ERROR', body: err})
    })
})

module.exports = routerUsuario