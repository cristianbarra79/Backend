# Desafío: GRAPHQL
### Coderhouse

Se refactorizo el código del proyecto para cambiar de API RESTful a GraphQL API. Se generaron tres endpoints para para cada uno de las clases.

### El schema para la ruta "/usuario" es:
```javascript
input UsuarioInput {
    email: String,
    password: String,
    nombre: String,
    direccion: String,
    edad: Int
    telefono: String
    avatar: String
  }
  type Usuario {    
    email: String,
    password: String,
    nombre: String,
    direccion: String,
    edad: Int
    telefono: String
    avatar: String
  }
  type Query {
    getPerfil(email: String): Usuario,    
  }
  type Mutation {
    createUsuario(datos: UsuarioInput): Usuario
    login(email: String, password: String) : String
  }
```
Ejemplo mutation:
```javascript
mutation{
  createUsuario(datos:{
    email: "xxxxxx@gmail.com",
    password: "123456",
    nombre: "Cristian",
    direccion: "Calle falsa 123",
    edad: 30,
    telefono: "12345678",
    avatar: "url"})
  {email}
}
```
Ejemplo query:
```javascript
query{
  getPerfil(email:"xxxxxx@gmail.com") {
    email
    nombre
    direccion
    edad
    telefono
    avatar
  }
}
```
### El schema para la ruta "/productos" es:
```javascript
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
```
Ejemplo mutation:
```javascript
mutation{
  createProducto(datos:{
    title: "Remera",
    description: "Manga larga",
    price: 122,
    image: "url",
    count:15
  }) {
    id, title
  }
}
```
Ejemplo query:
```javascript
query{
  getProducto(id:5) {
    id, title, price
  }
}
```
### El schema para la ruta "/carrito" es:
```javascript
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
```
Ejemplo mutation:
```javascript
mutation{
  createCarrito(datos:{
    productos:[]
  })
}
```
Ejemplo query:
```javascript
query{
  getCarrito(id:1) {
    id, title
  } 
}
```
### Correr el servidor:

Se incluye en el package.json un script de dev que corre el comando `nodemon server.js` que permite correr el servidor y reiniciarlo cada vez que se guarda algún cambio. Para iniciar el servidor de este modo hay que escribir en la terminal

```sh
npm run dev
```