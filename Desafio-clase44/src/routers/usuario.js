const usuarioDao = require("../daos/usuariosDao");

const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

const schema = buildSchema(`
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
`);


async function getPerfil({email}) {    
    const resp = await usuarioDao.user(email)
    return resp[0]
}

async function createUsuario({datos}) {    
    const resp = await usuarioDao.guardar(datos)    
    return resp
}

async function login({email, password}) {
    const lgo = await passport.authenticate('login')
    console.log(lgo);
    const resp = await usuarioDao.user(email)    
    if (resp.length < 1 ){
        return "No encontrado"
    }
    if (resp[0].password == password ){
        return "logueado"
    }
    return "Contraseña incorrecta"
}

const grapqhUsuario = graphqlHTTP({
    schema: schema,
    rootValue: {
        getPerfil,
        createUsuario,
        login
    },
    graphiql: true,
});

module.exports = grapqhUsuario