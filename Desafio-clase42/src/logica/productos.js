const productosDao = require("../daos/productosDao.js")
const productosDto = require ("../dto/productosDto.js")
const cotizaciones = require ("../utils/cotizaciones.js")


async function productoDao(id){
    const prod = await productosDao.listar(id)
    if (prod.error) {
        return prod.error
    }
    const prodDto = new productosDto(prod[0], cotizaciones)
    return prodDto
}

module.exports = productoDao