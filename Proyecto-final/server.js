const express = require('express')
const cluster = require('cluster');
const os = require('os');
var cors = require('cors')
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const routerProductos = require('./src/routers/productos.js')
const routerCarrito = require('./src/routers/carrito.js')
const routerUsuario = require('./src/routers/usuario.js')
const logger = require("./src/utils/logger.js")
const {enviarTodo, recibir} = require("./src/utils/chat")
require('dotenv').config()

const app = express()
const port = process.env.PORT || 8080
const modo = process.env.MODO || "FORK"


const httpServer = new HttpServer(app);
const io = new IOServer(httpServer,{ 
  cors: {
    origin: "*"
  }
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({origin: "*",}))
app.use(express.static("./public"));

const onConnection = (socket) => {  
  recibir(io, socket);
  enviarTodo(io, socket);
}

io.on("connection", onConnection);

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
  app.use("/productos", routerProductos)
  app.use("/carrito", routerCarrito)
  app.use("/", routerUsuario)

  app.use("*", (req, res)=>{
    logger.warn("ruta equivocada")
    res.sendStatus(404)
  })

  
  httpServer.listen(port, () => {
    logger.info(`Example app listening on port ${port}`)
  })
}