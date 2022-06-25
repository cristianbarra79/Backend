module.exports = {


  friendlyName: 'Eliminar prod',


  description: '',


  inputs: {
    id: {type: "string", required:true},    
    idcarrito: {type: "string", required:true},
  },


  exits: {

  },


  fn: async function (inputs) {
    const carrito = await sails.models.carrito.find({id: inputs.idcarrito})
    if(carrito.length == 0 )
      return "No se encuentra carrito"
    const carritoProd = carrito[0].productos    
    let indexProd = carritoProd.findIndex(x => x.id == inputs.id);    
    if(indexProd < 0 )
      return "No se encuentra producto en carrito"
    const carritoAct = carritoProd.splice(indexProd,1)
    //console.log("🚀 ~ file: eliminar-prod.js ~ line 30 ~ carritoAct", carritoProd)
    
    await sails.models.carrito.update({ id: inputs.idcarrito})
      .set({
        productos: carritoProd
      });
    return;

  }


};
