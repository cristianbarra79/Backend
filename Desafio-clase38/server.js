const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const handlebars = require("express-handlebars")
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const MongoStore = require("connect-mongo")

const minimist = require('minimist');
const options = { default: { puerto: 8080 , modo: "FORK"}}
const args =minimist(process.argv.slice(2), options)

require('dotenv').config()

const cluster = require('cluster')

const sesiones = process.env.SESIONES

const app = express();

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


const router = require("./src/routers/rutas.js");
const chats = require('./src/persistencia/chats.js');


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

if(modo=='CLUSTER' && !cluster.isWorker) {

    const numCPUs = os.cpus().length
    
    console.log(`Número de procesadores: ${numCPUs}`)
    console.log(`PID MASTER ${process.pid}`)
  
    for(let i=0; i<numCPUs; i++) {
        cluster.fork()
    }
  
    cluster.on('exit', worker => {
        console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
        cluster.fork()
    })
}else {
    app.use("/", router)

    httpServer.listen(PORT, () => console.log("SERVER ON"));
    httpServer.on("error", err=>console.log(err));
}