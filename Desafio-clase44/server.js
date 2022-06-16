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

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const grapqhProducto = require("./src/routers/productos")
const grapqhUsuario = require("./src/routers/usuario")
const grapqhCarrito = require("./src/routers/carrito")

app.use('/productos',grapqhProducto);
app.use('/usuario', grapqhUsuario);
app.use('/carrito', grapqhCarrito);

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
    app.use('/productos',grapqhProducto);
    app.use('/usuario', grapqhUsuario);
    app.use('/carrito', grapqhCarrito);
    
    app.listen(port, () => {
        logger.info(`Example app listening on port ${port}`)
    })
}