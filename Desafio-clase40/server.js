const express = require('express')

const MongoStore = require("connect-mongo")
const cookieParser = require('cookie-parser');
const session = require('express-session');

const cluster = require('cluster');
const os = require('os');

const app = express()
const port = process.env.PORT || 8080

const logger = require("./src/utils/logger")
const mongoDatos = require("./src/config.js")

const routerProductos = require("./src/routers/productos")
const routerCarrito = require("./src/routers/carrito");
const routerUsuario = require('./src/routers/usuario.js');

const modo = "FORK"

app.use(cookieParser());
app.use(session({
    store: MongoStore.create({mongoUrl: mongoDatos.URL,
        ttl: 15
        }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie:{        
        maxAge: 60000 * 10
    }
}));


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/productos', routerProductos)
app.use('/carrito', routerCarrito)
app.use('/', routerUsuario)


app.get("/*", (req, res) => {
    logger.warn("Ruta equivocada")
    res.status(404).send('Not found');
})

if(modo=='CLUSTER' && !cluster.isWorker) {

    const numCPUs = os.cpus().length
    
    logger.info(`Número de procesadores: ${numCPUs}`)
    logger.info(`PID MASTER ${process.pid}`)
  
    for(let i=0; i<numCPUs; i++) {
        cluster.fork()
    }
  
    cluster.on('exit', worker => {
        logger.info('Worker', worker.process.pid, 'died', new Date().toLocaleString())
        cluster.fork()
    })
}else {
    app.use('/productos', routerProductos)
    app.use('/carrito', routerCarrito)
    app.use('/', routerUsuario)
    
    app.listen(port, () => {
        logger.info(`Example app listening on port ${port}`)
    })
}

