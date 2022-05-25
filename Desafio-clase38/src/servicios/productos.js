const { faker } = require('@faker-js/faker');
faker.locale = 'es';


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

module.exports = productosAleatorios