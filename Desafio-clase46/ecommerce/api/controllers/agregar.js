module.exports = {


  friendlyName: 'Agregar',


  description: 'Agregar something.',


  inputs: {
    id: {type: "string", required:true},    
    idcarrito: {type: "string", required:true},    
  },


  exits: {

  },


  fn: async function (inputs) {

    const producto = await sails.models.productos.find({id: inputs.id})
    
    
    const carrito = await sails.models.carrito.find({id: inputs.idcarrito})
    const carritoProd = carrito[0].productos
    
    carritoProd.push(producto[0])
    
    
    await sails.models.carrito.update({ id: inputs.idcarrito})
      .set({
        productos: carritoProd
      });      
    return;

  }


};
