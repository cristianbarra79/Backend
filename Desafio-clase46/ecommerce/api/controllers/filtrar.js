module.exports = {


  friendlyName: 'Filtrar',


  description: 'Filtrar something.',


  inputs: {
    idcarrito: {type: "string", required:true},

  },


  exits: {

  },


  fn: async function (inputs) {

    const carrito = await sails.models.carrito.find({id: inputs.idcarrito})
    const carritoProd = carrito[0].productos
    return carritoProd;

  }


};
