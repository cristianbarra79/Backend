const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const {options} = require("./options/mariaDB")
const knex= require("knex")(options)

class conexion{
    constructor(tabla){        
        this.tabla = tabla
    }

    pedirDatos(){
        return  knex.select().table(this.tabla).then()        
    }

    guardarProducto(data){        
        knex('productos')
            .insert({ title: data.title, price:data.price, thumbnail:data.thumbnail})
            .then(console.log("productos agregado"))
        return knex.select().table(this.tabla).then()
    }

    guardarChat(data){
        knex("chat")
            .insert({email: data.email, fyh : data.fyh, mensaje: data.mensaje})
            .then(console.log("mensaje agregado"))
        return knex.select().table(this.tabla).then()
    }
}

const productos = new conexion("productos")
const chat = new conexion("chat")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static("./public"));
app.get("/", (req, res) => {
  res.sendFile("index.html");
});


io.on("connection", (socket) => {
    console.log("Usuario conectado");

    productos.pedirDatos().then(resp => socket.emit("productos", resp))
    
    chat.pedirDatos() .then(resp => socket.emit("mensajes", resp))

    socket.on('new-product',data => {        
        async function asyncCallProd(data) {
            const result = await productos.guardarProducto(data);
            productos.pedirDatos().then(resp => io.sockets.emit("productos", resp))            
        }

        asyncCallProd(data)
    });

    socket.on("envio", (data) => {
        async function asyncCallChat(data) {            
            const result = await chat.guardarChat(data);
            chat.pedirDatos().then(resp => io.sockets.emit("mensajes", resp))
            
        }

        asyncCallChat(data)
    });
});

httpServer.listen(8080, () => console.log("SERVER ON"));