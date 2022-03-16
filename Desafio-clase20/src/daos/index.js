const ProductosDaoArchivo = require("./productos/ProductosDaoArchivo")
const CarritoDaoArchivo = require("./carrito/CarritoDaoArchivo")
const ProductosDaoMongoDb = require("./productos/ProductosDaoMongoDb.js")
const CarritoDaoMongoDb = require('./carrito/CarritoDaoMongoDb.js')
const ProductosDaoFirebase = require("./productos/ProductosDaoFirebase.js")
const CarritoDaoFirebase = require('./carrito/CarritoDaoFirebase.js')
const base = "archivo"

let productosDao
let carritoDao


switch (base) {
    case 'archivo':
        productosDao = new ProductosDaoArchivo()
        carritoDao = new CarritoDaoArchivo()
        break
    case 'firebase':        
        productosDao = new ProductosDaoFirebase()
        carritoDao = new CarritoDaoFirebase()
        break
    case 'mongo':
        productosDao = new ProductosDaoMongoDb()
        carritoDao = new CarritoDaoMongoDb()
        break    
}

module.exports = {productosDao, carritoDao}