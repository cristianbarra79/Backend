const express = require('express')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 8080;

class Contenedor {
    async datos(){
        try {
          const contenido = await fs.promises.readFile(`./productos.txt`, "utf-8")
          const datos = JSON.parse(contenido)
          return datos
        } catch (err) {
          console.log(err);
        }
    }

    async getById(Number){
        try {
          const contenido = await fs.promises.readFile(`./productos.txt`, "utf-8")
          const datos = JSON.parse(contenido)
          const producto = datos.find(prod => prod.id == Number)
          return producto          
        } catch (err) {
          console.log(`Error: ${err}`);
        }
    }    
}

const productos = new Contenedor()

app.get('/', (req, res) => {
    res.send("<h1 style='color:blue'>Bienvenidos al servidor express</h1>")
})

app.get('/productos', (req, res) => {
    async function pedirDatos() {
        const recibo = await productos.datos()
        res.send(recibo)
        
    }
    pedirDatos()
})


app.get('/productoRandom', (req, res) => {    
    async function pedirDatos() {
        const recibo = await productos.getById(Math.floor(Math.random() * (3 - 1 + 1) ) + 1)        
        res.send(recibo)        
    }
    pedirDatos()
})
 
const server = app.listen(PORT, () => {
   console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))