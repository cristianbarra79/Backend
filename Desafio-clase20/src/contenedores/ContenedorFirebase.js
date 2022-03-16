var admin = require("firebase-admin");
const firestore = require("../config")

class ContenedorFirebase{
    constructor(base){        
        this.base = admin.firestore().collection(base)
    }

    async listarAll(){
        try {
            let resultado = await this.base.get()
            let docs = resultado.docs;

            const response = docs.map((doc)=>({
                id: doc.id,
                title: doc.data().title,
                price: doc.data().price,    
                description: doc.data().description,    
                image: doc.data().image,    
                count: doc.data().count,    
                codigo: doc.data().codigo,                
                timestamp: doc.data().timestamp                
            }))
            return response
        } catch (error) {
            console.log(error);
        }
    }

    async listar(id){
        try {
            if (id=="") {
                return {"Error": "Ingrese un ID valido"}
            }
            const resultado = await this.base.doc(`${id}`).get()            
            const response = resultado.data();
            if(!response)
                return {"error": "No se encuentra producto"}
            return response
            
        } catch (error) {
            console.log(error);
        }
    }

    async agregar(datos){
        
        if( !datos.title || !datos.price || !datos.description || !datos.image || !datos.count || !datos.codigo){                
            return {"message" : "faltan datos"};
        }
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
                    "id":parseInt(respuesta)+1,
                    "timestamp": fecha,
                    "title": datos.title,
                    "price": datos.price,
                    "description": datos.description,
                    "count": datos.count,
                    "image": datos.image,
                    "codigo": datos.codigo
                })            
            return await this.listar(parseInt(respuesta)+1)
        }
        catch (error) {
            console.log(error);
        }
    }

    async modificar(datos,id){
        if( !datos.title || !datos.price || !datos.description || !datos.image || !datos.count || !datos.codigo){                
            return {"message" : "faltan datos"};
        }
        const consulta = await this.base.doc(`${id}`).get() 
        if(consulta.data() == undefined){
            return {"Error": "No existe"}
        }
        const doc = this.base.doc(`${id}`);
        let item = await doc.update({

            "title": datos.title,
            "price": datos.price,
            "description": datos.description,
            "count": datos.count,
            "image": datos.image,
            "codigo": datos.codigo
        });
        return await this.listar(id)
    }
    
    async deleteById(id){
        try {            
            const doc = await this.base.doc(`${id}`).get()            
            if(doc.data() == undefined){
                return {"Error": "No existe"}
            }            
            await this.base.doc(`${id}`).delete();
            return {"msg": "Eliminado con exito"}
            
        } catch (error) {
            console.error(error);
        }    
    }
}

module.exports =  ContenedorFirebase