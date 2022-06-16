const productosDao = require("../daos/productosDao.js")

const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const schemaProducto = buildSchema(`
  input ProductoInput {
    title: String,
    description: String,
    price: Float,
    image: String,
    count: Int
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
    getProductos(campo: String, valor: String): [Producto],
    getProducto(id: ID!): Producto
  }
  type Mutation {
    createProducto(datos: ProductoInput): Producto,
    updateProducto(id: ID!, datos: ProductoInput): Producto,
    deleteProducto(id: ID!): String
  }
`);

async function getProductos({ campo, valor }) {
    const resp = await productosDao.listarAll()
   return resp
 }
 

async function getProducto({ id }) {
    const resp = await productosDao.listar(id)    
    if (resp.error) {
        throw new Error('Producto not found.');
    }
    return resp[0]    
}
 
 
async function createProducto({ datos }) {
    const resp = await productosDao.agregar(datos)    
    return resp
}

async function updateProducto({id, datos}) {
    const resp = await productosDao.modificar(datos, id)    
    return resp
}

async function deleteProducto({id}) {
    const resp = await productosDao.deleteById(id)
    return resp.msg
}

const grapqhProducto = graphqlHTTP({
  schema: schemaProducto,
  rootValue: {
      getProductos,
      getProducto,
      createProducto,
      updateProducto,
      deleteProducto
  },
  graphiql: true,
})
    

module.exports = grapqhProducto