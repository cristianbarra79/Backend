module.exports = {


  friendlyName: 'Login',


  description: 'Login something.',


  inputs: {
    email: {type: "string", required:true},
    password: {type: "string", required:true}

  },


  exits: {

  },


  fn: async function (inputs) {

    const filter = await sails.models.usuarios
      .find({email:inputs.email})    
    if (filter.length == 0) {      
      return "Usuario no existe";
    }else{
      if (filter[0].password == inputs.password) {
        return "Acceso concedido"
      }else{
        return "Error de contraseña"
      }
    }    

  }


};
