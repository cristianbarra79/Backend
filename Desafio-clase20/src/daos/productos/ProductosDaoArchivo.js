const fs = require('fs')
ContenedorArchivo = require("../../contenedores/ContenedorArchivo");


class ProductosDaoArchivo extends ContenedorArchivo{

    constructor(){
        super("./productos.txt")
    }

    async agregar(datos){
        try{            
            let contenido = await this.listarAll()            
            const time = new Date()
            let indice = contenido.length > 0 ? contenido[contenido.length-1].id+1 : 1
            let object = datos        
            if( !object.title || !object.price || !object.description || !object.image || !object.count || !object.codigo){                
                return {"message" : "faltan datos"};
            }
            object = {...object, id : indice, timestamp : time}            
            contenido.push(object)            
            await this.saveAll(contenido)
            return object
        }
        catch(err){            
            console.log(`Error al agregar: ${err}`);        
        }
    }

    async modificar(datos, id){
        const contenido = await this.listarAll()        
        let indexProducto = contenido.findIndex(x => x.id == id);    
        if (!contenido[indexProducto]) {
            return "No se encuntra producto"
        }else{
            const cambio = Object.assign(contenido[indexProducto], datos);
            contenido[indexProducto]= cambio
            await this.saveAll(contenido)
            return {"msg": "Producto actualizado"}
            
        }
    }    
}


module.exports =  ProductosDaoArchivo 