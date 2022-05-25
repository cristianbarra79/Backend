const express = require('express')
const { Router } = express

const numCPUs = require('os').cpus().length

const { fork } = require("child_process");
const productosAleatorios = require('../servicios/productos');
const passport = require('passport');

const cookieParser = require('cookie-parser');
const session = require('express-session');

const sesiones = process.env.SESIONES

const MongoStore = require("connect-mongo")

const LocalStrategy = require('passport-local').Strategy;
const bCrypt = require('bcrypt');
const app = express();


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
const mensajes = process.env.MENSAJE
const usuario = require("../persistencia/usuarios")
const mongoose = require("mongoose")
const mongoDatos = {
    URL : mensajes,
    option: {
        useNewUrlParser: true,
        useUnifiedTopology : true
    }
}
mongoose.connect(mongoDatos.URL, mongoDatos.option)

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

const router = Router()

router.get("/login", (req,res) =>{    
    if (req.session.email) {
        
        res.render("usuario", {usuario: req.session.email})
    }else
        res.render("login")
    
})

router.post("/login", passport.authenticate('login', { failureRedirect: '/faillogin' }), (req,res) =>{
    req.session.email = req.body.email    
    res.render("usuario", {usuario: req.session.email})    
})

router.get("/register", (req,res) =>{    
    res.render("register")
})

router.post("/register", passport.authenticate('register', { failureRedirect: '/failregister' }),(req,res) =>{
    res.redirect("login")   
})


router.get("/logout", (req,res) =>{
    req.session.destroy( err => {
        if(!err) res.render("logout")
        else res.send({status: 'Logout ERROR', body: err})
    })
})

router.get("/faillogin", (req,res) =>{
    res.render("fail", {error: "LOGIN", accion: "login"})
})

router.get("/failregister", (req,res) =>{
    res.render("fail", {error: "REGISTER", accion: "register"})
})


router.get("/info", (req,res) =>{
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

router.get("/api/randoms", (req,res) =>{
    const forked = fork("./child.js")    
    forked.on("message", cantidad => {
        res.send(cantidad)
    })
    forked.send(req.query.cant || 100000000 )
})

router.get('/prueba', (req, res) => {
    res.send(`Servidor express en ${process.PORT} - <b>PID ${process.pid}</b> - ${new Date().toLocaleString()}`)
})

router.get("/api/productos-test", (req, res) => {    
    const resp = productosAleatorios()
    res.send(resp)
});

module.exports = router