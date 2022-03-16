var admin = require("firebase-admin");
ContenedorFirebase = require("../../contenedores/ContenedorFirebase");

class CarritoDaoFirebase extends ContenedorFirebase{
    constructor(){
        super("carritos")
    }

    async crearCarrito(){
        try {
            let respuesta = await this.base.orderBy('timestamp', 'desc').limit(1).get()
                .then((resp)=>{                    
                    if(!resp.docs[0])
                      return 0 
                    return resp.docs[0].id
                })
            let fecha = new Date()
            const doc = this.base.doc(`${parseInt(respuesta)+1}`)
            doc.create(
                {                    
                    "timestamp": fecha,
                    "id": parseInt(respuesta)+1,
                    "productos": []
                })            
            return parseInt(respuesta)+1
        } catch (error) {
            console.log(error);
        }
    }

    async filtrarCarrito(id){
        try {        
            try {
                id/2
            } catch (error) {
                return {"error": "Escriba un id valido"}
            }
            const resultado = await this.base.doc(`${id}`).get()        
            const response = resultado.data();
            if(!response)
                return {"error": "No se encuentra"}
            if(response.productos.length >0)            
                return response.productos
            return {"msg":"Carrito vacio"}
            
        } catch (error) {
            console.log(error);
        }
    }

    async añadirAlCarrito(id,data){
        try {
            if(data.Error)
                return {"Error":data.Error}
            const carrito = await this.filtrarCarrito(id)            
            if (carrito.Error) {
                return {"Error": "Carrito no existe"}
            }
            if(carrito.msg){
                const doc = this.base.doc(`${id}`);
                let item = await doc.update({
                    "productos": [data]
                });
                return {"msg":"Producto añadido"}
            }
            const doc = this.base.doc(`${id}`);
            let item = await doc.update({
                "productos": [...carrito ,data]
            });
            return {"msg":"Producto añadido"}            
            
            
        } catch (error) {
            console.log(error);
        }
    }


    async eliminarProducto(id, idProd){
        try {
            const carrito = await this.filtrarCarrito(id)            
            if (carrito.error) {
                return {"Error": "Carrito no existe"}
            }
            if (carrito.msg) {
                return {"Error": "Carrito vacio"}
            }

            const indiceProd = carrito.findIndex(x => x.id == idProd)
            if (indiceProd < 0) {
                return {"Error": "Producto no esta en carrito"}
            }
            carrito.splice(indiceProd,1)
            await this.base.doc(`${id}`).update({

                
                "productos": [...carrito]
            });
            return {"msg": "Producto eliminado con exito"}
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = CarritoDaoFirebase