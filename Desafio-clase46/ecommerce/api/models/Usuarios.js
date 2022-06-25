/**
 * Usuarios.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    
    email: {type: "String", required:true},
    password: {type: "String", required:true},
    nombre: {type: "String", required:true},
    direccion: {type: "String", required:true},
    edad: {type: "Number", required:true},
    telefono: {type: "Number", required:true},
    avatar: {type: "String", required:true}

  },

};

