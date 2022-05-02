const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const handlebars = require("express-handlebars")
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const mongoose = require("mongoose")
const normalizr = require("normalizr")
const normalize = normalizr.normalize
const schema = normalizr.schema

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bCrypt = require('bcrypt');
const MongoStore = require("connect-mongo")

const { faker } = require('@faker-js/faker');
const path = require('path');
faker.locale = 'es';

const minimist = require('minimist');
const options = { default: { puerto: 8080 , modo: "FORK"}}
const args =minimist(process.argv.slice(2), options)
require('dotenv').config()

const { fork } = require("child_process")

const numCPUs = require('os').cpus().length
const cluster = require('cluster')

const mensajes = process.env.MENSAJE
const sesiones = process.env.SESIONES

const app = express();

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const mongoDatos = {
    URL : mensajes,
    option: {
        useNewUrlParser: true,
        useUnifiedTopology : true
    }
}


const schemamongo = new mongoose.Schema({
    author:{
        mail: {type: String, require:true},
        nombre : {type: String, require:true},
        apellido : {type: String, require:true},
        edad:{type: Number, require:true},
        alias:{type: String, require:true},
        avatar:{type: String, require:true}
    },
    fyh:{type: String, require:true},
    text:{type: String, require:true}
})

class chat{
    constructor(){        
        this.modelo = mongoose.model("chats", schemamongo)
    }

    async pedirDatos(){
        await mongoose.connect(mongoDatos.URL, mongoDatos.option)
        const resp = await this.modelo.find()         
        
        
        const users = new schema.Entity('author')

        
        const text = new schema.Entity('text', {
            author: users
        })

        const normalizados = normalize(
            { id: 'mensajes', messages: resp },
            text
        );        

        return normalizados        
    }
 
    async guardarChat(datos){        
        await mongoose.connect(mongoDatos.URL, mongoDatos.option)
        const nuevoProd = new this.modelo(datos)
        let doc = await nuevoProd.save();
        
    }
}

const chats = new chat()

const productosAleatorios = () => {
    let productosAzar = []
    for (let i = 1; i < 6; i++) {
        productosAzar.push({
            id: i,
            title: faker.commerce.productName(),
            price: faker.commerce.price(),
            thumbnail: faker.image.food(256, 256, true)
        })
    }
    return productosAzar
}


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./public"));

app.use(cookieParser());
app.use(session({
    store: MongoStore.create({mongoUrl: sesiones,
        ttl: 15
        }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie:{        
        maxAge: 10 * 60000
    }
}));

app.engine("hbs", 
    handlebars.engine({
    extname:".hbs", 
    defaultLayout: "index.hbs"
    })
)

app.set('view engine', 'hbs')
app.set('views', './views')


class usuarios{
    constructor(collection, schema){
        this.url = "mongodb://localhost:27017/chats",
        this.option = {
            useNewUrlParser: true,
            useUnifiedTopology : true
        },
        this.modelo = mongoose.model(collection, schema)
    }
}


const usuario = new usuarios("usuarios",new mongoose.Schema({
    email: {type: String, require:true},
    password: {type: String, require:true}
    })
)

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
        
        usuario.modelo.findOne({ email: username }, (err, user) => {
        if (err)
          return done(err);
   
        if (!user) {
          console.log('User Not Found with username ' + username);
          
          return done(null, false);
        }
   
        if (!isValidPassword(user, password)) {
            console.log('Invalid Password');
            
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

    usuario.modelo.findOne({ 'email': username }, function (err, user) {

       if (err) {
            console.log('Error in SignUp: ' + err);
            return done(err);
        }

        if (user) {
            console.log('User already exists');
            return done(null, false)
        }

        const newUser = {            
            password: createHash(password),
            email: req.body.email,
            
        }
        
        
        usuario.modelo.create(newUser, (err, userWithId) => {
            if (err) {
                console.log('Error in Saving user: ' + err);
                return done(err);
            }
            console.log(user)
            console.log('User Registration succesful');
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

app.get("/api/productos-test", (req, res) => {    
    const resp = productosAleatorios()
    res.send(resp)
});



io.on("connection", (socket) => {
    console.log("Usuario conectado");

    chats.pedirDatos()
        .then(resp => io.sockets.emit("mensajes", resp))


    socket.on("envio", (data) => {
        async function asyncCallChat(data) {
            await chats.guardarChat(data);
            chats.pedirDatos().then(resp => io.sockets.emit("mensajes", resp))                
            
        }
        
        asyncCallChat(data)
    });


})



const PORT = parseInt(process.argv[2]) || 8080
const modo = process.argv[3]


if(modo == "cluster" || modo == "CLUSTER"){
    if (cluster.isMaster) {
        console.log(numCPUs)
        console.log(`PID MASTER ${process.pid}`)

        for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
        }

        cluster.on('exit', worker => {
            console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
            cluster.fork()
        })
    }
    /* --------------------------------------------------------------------------- */
    /* WORKERS */
    else {
        //console.log(parseInt(process.argv[2]))
        const PORT = parseInt(process.argv[2]) || 8080


        app.get("/login", (req,res) =>{

            if (req.session.email) {
                
                res.render("usuario", {usuario: req.session.email})
            }else
                res.render("login")
            
        })
    
        app.post("/login", passport.authenticate('login', { failureRedirect: '/faillogin' }), (req,res) =>{
            req.session.email = req.body.email
            //req.session.password = req.body.password
            res.render("usuario", {usuario: req.session.email})    
        })
    
        app.get("/register", (req,res) =>{    
            res.render("register")
        })
    
        app.post("/register", passport.authenticate('register', { failureRedirect: '/failregister' }),(req,res) =>{
            res.redirect("login")   
        })
    
    
        app.get("/logout", (req,res) =>{
            req.session.destroy( err => {
                if(!err) res.render("logout")
                else res.send({status: 'Logout ERROR', body: err})
            })
        })
    
        app.get("/faillogin", (req,res) =>{
            res.render("fail", {error: "LOGIN", accion: "login"})
        })
    
        app.get("/failregister", (req,res) =>{
            res.render("fail", {error: "REGISTER", accion: "register"})
        })
    
    
        app.get("/info", (req,res) =>{
            const datos = {
                argumento: process.argv.slice(2),
                plataforma: process.platform,
                version: process.version,
                memoria: process.memoryUsage().rss,        
                id: process.pid,
                carpeta: process.cwd(),
                cpus: numCPUs
            }
            res.render("info", datos)
        })
    
        app.get("/api/randoms", (req,res) =>{
            const forked = fork("./child.js")    
            forked.on("message", cantidad => {
                res.send(cantidad)
            })
            forked.send(req.query.cant || 100000000 )
        })
        
        app.get('/prueba', (req, res) => {
            res.send(`Servidor express en ${PORT} - <b>PID ${process.pid}</b> - ${new Date().toLocaleString()}`)
        })

        app.listen(PORT, err => {
            if (!err) console.log(`Servidor express escuchando en el puerto ${PORT} - PID WORKER ${process.pid}`)
        })
        
        app.get('/prueba', (req, res) => {
            res.send(`Servidor express en ${PORT} - <b>PID ${process.pid}</b> - ${new Date().toLocaleString()}`)
        })
    
    }
     
}else{
       
    app.get("/login", (req,res) =>{

        if (req.session.email) {
            
            res.render("usuario", {usuario: req.session.email})
        }else
            res.render("login")
        
    })

    app.post("/login", passport.authenticate('login', { failureRedirect: '/faillogin' }), (req,res) =>{
        req.session.email = req.body.email
        //req.session.password = req.body.password
        res.render("usuario", {usuario: req.session.email})    
    })

    app.get("/register", (req,res) =>{    
        res.render("register")
    })

    app.post("/register", passport.authenticate('register', { failureRedirect: '/failregister' }),(req,res) =>{
        res.redirect("login")   
    })


    app.get("/logout", (req,res) =>{
        req.session.destroy( err => {
            if(!err) res.render("logout")
            else res.send({status: 'Logout ERROR', body: err})
        })
    })

    app.get("/faillogin", (req,res) =>{
        res.render("fail", {error: "LOGIN", accion: "login"})
    })

    app.get("/failregister", (req,res) =>{
        res.render("fail", {error: "REGISTER", accion: "register"})
    })


    app.get("/info", (req,res) =>{
        const datos = {
            argumento: process.argv.slice(2),
            plataforma: process.platform,
            version: process.version,
            memoria: process.memoryUsage().rss,        
            id: process.pid,
            carpeta: process.cwd(),
            cpus: numCPUs
        }
        res.render("info", datos)
    })

    app.get("/api/randoms", (req,res) =>{
        const forked = fork("./child.js")    
        forked.on("message", cantidad => {
            res.send({Server: PORT, mensaje: cantidad})
        })
        forked.send(req.query.cant || 100000000 )
    })

    app.get('/prueba', (req, res) => {
        res.send(`Servidor express en ${PORT} - <b>PID ${process.pid}</b> - ${new Date().toLocaleString()}`)
    })


    httpServer.listen(PORT, () => console.log("SERVER ON"));
}