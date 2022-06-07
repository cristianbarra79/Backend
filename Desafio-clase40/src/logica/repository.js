const productos = require("../daos/productosDao.js")
const ProductoDto = require("../dto/productosDto.js")
const cotizaciones = require ("../utils/cotizaciones.js")

class ProductosRepo {

    constructor() {
        this.dao = productos
    }

    async add(prod) {

        const guadardo = await this.dao.agregar(prod)        
        const dto = new ProductoDto(guadardo ,cotizaciones)
        return dto
    }
 
}

const repoProductos = new ProductosRepo
module.exports = repoProductos