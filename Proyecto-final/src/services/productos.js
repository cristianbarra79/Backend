const productosDao = require("../daos/productosDao")

class productos{

    async listar(id){
        if (id){            
            if (!isNaN(id)) {
                let resp = await productosDao.listar(id)
                return resp
                
            }else{
                let resp = await productosDao.listarAll()
                let catalogo = resp.filter( e => e.category == id)
                if (catalogo.length < 1) {
                    return {"error":"No encontrado"}
                }
                return catalogo
            }
        }else{
            let resp = await productosDao.listarAll()
            return resp
        }
    }

    async agregar(datos){
        if( !datos.price || !datos.description || !datos.image || !datos.category || !datos.count || !datos.title){                
            return {"message" : "faltan datos"};
        }else{
            let resp = await productosDao.agregar(datos)
            return resp
        }
    }

    async modificar(datos, id){
        let resp = await this.listar(id)
        if (resp.error) {
            return resp
        }
        let act = await productosDao.modificar(datos, id)
        return act
    }

    async borrar(id){
        let resp = await this.listar(id)
        if (resp.error) {
            return resp
        }
        let del = await productosDao.deleteById(id)
        return del
    }
}

const productosService = new productos
module.exports = productosService