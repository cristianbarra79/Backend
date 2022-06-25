module.exports = {


  friendlyName: 'Register',


  description: 'Register something.',


  inputs: {
    email: {type: "string", required:true},
    password: {type: "string", required:true},
    nombre: {type: "string", required:true},
    direccion: {type: "string", required:true},
    edad: {type: "number", required:true},
    telefono: {type: "number", required:true},
    avatar: {type: "string", required:true}

  },


  exits: {

  },


  fn: async function (inputs) {
    const filter = await sails.models.usuarios
      .find({email:inputs.email})
    if(filter.length > 0) 
      return "Usuario ya existe"
    const newRegister = await sails.models.usuarios
      .create(inputs)
      .intercept(err => {
        if (err) console.log(err)
      })
      .fetch()      
    return "Usuario creado";

  }


};
