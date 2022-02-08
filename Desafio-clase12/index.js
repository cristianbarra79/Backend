const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const fs = require('fs')

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let datos = []
let mensajes = [];

async function pedirArchivos(){    
    try {
      const contenido = await fs.promises.readFile(`./productos.txt`, "utf-8")
      datos = JSON.parse(contenido)
      return datos
    } catch (err) {
      console.log(err);
    }

}

async function agregar(data){
    
    let indice = datos.length>0 ? datos[datos.length-1].id+1 : 1
    let object = data
    object = {...data, id : indice}
    datos.push(object)
    
    try{
        await fs.promises.writeFile(`./productos.txt`, JSON.stringify(datos))
        return datos
    }
    catch(err){
        console.log(`Error al escribir: ${err}`);
    }
}

async function guardarMensaje(data){
    mensajes.push(data)
    try{
        await fs.promises.writeFile(`./mensajes.txt`, JSON.stringify(mensajes))
        return mensajes
    }
    catch(err){
        console.log(`Error al escribir: ${err}`);
    }
}

async function leerMensajes(){
    try {
        const contenido = await fs.promises.readFile(`./mensajes.txt`, "utf-8")
        mensajes = JSON.parse(contenido)

        return mensajes
      } catch (err) {
        console.log(err);
      }
}

app.use(express.static("./public"));
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

io.on("connection", (socket) => {
    console.log("Usuario conectado");

    pedirArchivos().then(resp => socket.emit("productos", resp))
    
    leerMensajes().then(resp => socket.emit("mensajes", resp))
    
    
    socket.on('new-product',data => {
        agregar(data).then(resp => io.sockets.emit("productos", resp))
    });

    socket.on("envio", (data) => {
        guardarMensaje(data). then(resp =>io.sockets.emit("mensajes", resp))
        
    });
});

httpServer.listen(8080, () => console.log("SERVER ON"));