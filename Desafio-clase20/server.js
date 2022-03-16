const express = require('express')

const routerProductos = require("./src/routers/productos")
const routerCarrito = require("./src/routers/carrito")

const app = express()


const PORT = 8080 || process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
 })
server.on("error", error => console.log(`Error en servidor ${error}`))