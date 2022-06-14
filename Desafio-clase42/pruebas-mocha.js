const request = require('supertest')('http://localhost:8080')
const expect = require('chai').expect

const { faker } = require('@faker-js/faker')
faker.locale = 'es';

const productosAleatorios = () => {
    let productosAzar = {}
    
    productosAzar = {        
        title: faker.commerce.productName(),
        price: faker.datatype.number({
            'min': 10,
            'max': 50
        }),
        description: faker.lorem.paragraph(),
        image: faker.image.food(256, 256, true),
        count: faker.datatype.number({
            'min': 10,
            'max': 50
        })
    }
    
    return productosAzar
}

let id
let producto

describe('Test de la API productos', () => {

    describe('GET', () => {        
        it('Deberia retornar un array con datos', async () => {
            const response = await request.get('/productos')
            expect(response.body).to.not.eql([])
        })
    })

    describe('POST', () => {
        it('Deberia retornar un status 200', async () => {
            producto = productosAleatorios()
            const response = await request.post('/productos').send(producto)
            id = response.body.id
            expect(response.status).to.eql(200)
        })

    })

    describe('GET', () => {
        it('Deberia retornar el producto añadido anteriormente', async () => {
            const response = await request.get(`/productos/${id}`)            
            const prod = response.body

            expect(prod).to.include.keys('title', 'price', 'description', 'image', 'count')

            expect(prod.title).to.eql(producto.title)
            expect(prod.price).to.eql(producto.price)
            expect(prod.description).to.eql(producto.description)
            expect(prod.image).to.eql(producto.image)
            expect(prod.count).to.eql(producto.count)            
        })
    })

    describe('PUT', () => {
        it('Deberia retornar un status 200', async () => {
            const dataToUpdate = {
                "count": 10
            }

            const response = await request.put(`/productos/${id}`).send(dataToUpdate)
            expect(response.status).to.eql(200)
        })
    })

    describe('GET', () => {
        it('Deberia devolver el producto con la propiedad actualizada', async () => {
            const response = await request.get(`/productos/${id}`)
            const prod = response.body

            expect(prod.count).to.eql(10)
        })
    })

    describe('POST', () => {
        it('Deberia retornar un status 200', async () => {
            producto = productosAleatorios()
            const response = await request.post('/productos').send(producto)
            id = response.body.id
            expect(response.status).to.eql(200)
        })
        it('Deberia retornar el producto añadido anteriormente', async () => {
            const response = await request.get(`/productos/${id}`)            
            const prod = response.body

            expect(prod).to.include.keys('title', 'price', 'description', 'image', 'count')

            expect(prod.title).to.eql(producto.title)
            expect(prod.price).to.eql(producto.price)
            expect(prod.description).to.eql(producto.description)
            expect(prod.image).to.eql(producto.image)
            expect(prod.count).to.eql(producto.count)            
        })
    })

    describe('DELETE', () => {
        it('Deberia mensaje de eliminado', async () => {
            const response = await request.delete(`/productos/${id}`)
            expect(response.body.msg).to.eql("Eliminado")
        })
    })
})