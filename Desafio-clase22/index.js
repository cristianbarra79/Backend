const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const mongoose = require("mongoose")
const util = require("util")
const normalizr = require("normalizr")
const normalize = normalizr.normalize
const schema = normalizr.schema

const { faker } = require('@faker-js/faker');
faker.locale = 'es';

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const mongoDatos = {
    URL : "mongodb://localhost:27017/mensajes",
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

app.get("/", (req,res) =>{
    res.send("index.html")
})

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

httpServer.listen(8080, () => console.log("SERVER ON"));