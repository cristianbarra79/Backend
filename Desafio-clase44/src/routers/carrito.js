const express = require('express')

const carritoDao = require("../daos/carritoDao")
const productosDao = require("../daos/productosDao")

const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

const schema = buildSchema(`
  input CarritoInput {
    productos: [String]
  }
  type Carrito {
    id: ID!
    productos: [String]
  }
  type Producto {
    id: ID!
    title: String,
    description: String,
    price: Float,
    image: String,
    count: Int
  }
  type Query {
    getCarrito(id: Int): [Producto],
  }
  type Mutation {
    createCarrito(datos: CarritoInput): Int,
    anadirACarrito(id: ID!, datos: Int) : String
    deleteCarrito(id:ID!): String
    deleteProducto(id:ID!, idprod:Int): String
  }
`);

async function createCarrito({datos}){
    const resp = await carritoDao.crearCarrito()
    
    return resp
}

async function anadirACarrito({id, datos}) {
    const resp = await productosDao.listar(datos)
    if(resp.error){
        return resp.error
    }
    const mandar = await carritoDao.añadirAlCarrito(id, resp)    
    return mandar
}

async function getCarrito({id}){
    const resp = await carritoDao.filtrarCarrito(id)
    if (typeof resp === "string") {
        return []
    }
    return resp
}

async function deleteCarrito({id}) {
    const resp = await carritoDao.deleteById(id)
    return resp.msg
}

async function deleteProducto({id, idprod}) {
    const resp = await carritoDao.eliminarProducto(id, idprod)
    return resp
}

const grapqhCarrito = graphqlHTTP({
    schema: schema,
    rootValue: {
        createCarrito,
        getCarrito,
        anadirACarrito,
        deleteCarrito,
        deleteProducto
    },
    graphiql: true,
})

module.exports = grapqhCarrito