const fs = require('fs')


class ContenedorArchivos{
    constructor(ruta){
        this.ruta = ruta
    }

    async listar(id){
        const todo = await this.listarAll()
        const filtrado = todo.find(prod => prod.id == id)
        if (!filtrado) {
            return { "Error" : 'No encontrado' }
        }else
            return filtrado
    }

    async listarAll(){
        try {
            const contenido = await fs.promises.readFile(this.ruta, "utf-8")            
            const datos = JSON.parse(contenido)
            return datos
          } catch (err) {
            console.log(err);
          }
    }

    async saveAll(datos){
        try {
            await fs.promises.writeFile(this.ruta, JSON.stringify(datos))
            return true
        } catch (error) {
            console.log(error);
        }
    }

    async deleteById(id){
        const contenido = await this.listarAll()        
        const indice = contenido.findIndex(x => x.id == id)
        if (indice >= 0) {
            contenido.splice(indice,1)
            try {
                await this.saveAll(contenido)
                return {"msg": "Eliminado con exito"}               
            } catch (err) {
                console.log("error al escribir" + err);
            }
        }else{
            return {"Error":"No se encuentra"}
        }
    }
}


module.exports =  ContenedorArchivos