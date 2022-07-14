class carritoDto {
    constructor(datos, cantidad) { ////DTO de salida
        this.id = datos.id,        
        this.description = datos.description,
        this.price = datos.price,
        this.image = datos.image,
        this.count = datos.count,
        this.title = datos.title,
        this.category = datos.category
        this.cantidad = cantidad
    }
}

module.exports = carritoDto