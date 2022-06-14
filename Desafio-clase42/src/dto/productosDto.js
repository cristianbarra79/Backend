class ProductoDto {
    constructor(datos, cotizaciones) {
        this.id = datos.id,
        this.title = datos.title,
        this.description = datos.description,
        this.price = datos.price,
        this.image = datos.image,
        this.count = datos.count
        for (const [ denominacion, valor ] of Object.entries(cotizaciones)) {
            this[denominacion] =  parseFloat(datos.price) *  parseFloat(valor)
        }
    }
}

module.exports = ProductoDto