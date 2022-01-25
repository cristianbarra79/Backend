const fs = require('fs')

class Contenedor {
  constructor(archivo){
    this.archivo = archivo
  }
  
  async save(Object){
    try{
      const contenido = await fs.promises.readFile(`./${this.archivo}.txt`, "utf-8")      
      const datos = JSON.parse(contenido)
      
      let indice = datos.length>0 ? datos[datos.length-1].id+1 : 1
      Object = {...Object, id : indice}
      datos.push(Object)
      
      try{
        await fs.promises.writeFile(`./${this.archivo}.txt`, JSON.stringify(datos))
        return Object.id
      }
      catch(err){
        console.log(`Error: ${err}`);
      }

    }
    catch(err){
      console.log(`Error: ${err}`);      
      await fs.promises.writeFile(`./${this.archivo}.txt`, "[]")
      Object = [{...Object, id : 1}]            
      try{
        await fs.promises.writeFile(`./${this.archivo}.txt`, JSON.stringify(Object))
        return Object[0].id
      }
      catch(err){
        console.log(`Error: ${err}`);
      }
    }
  }

  async getById(Number){
    try {
      const contenido = await fs.promises.readFile(`./${this.archivo}.txt`, "utf-8")
      const datos = JSON.parse(contenido)
      const producto = datos.filter(prod => prod.id == Number)      
      if (producto.length > 0) {        
        return producto[0]
      }else
        return null    
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }

  async getAll(){
    try {
      const contenido = await fs.promises.readFile(`./${this.archivo}.txt`, "utf-8")
      const datos = JSON.parse(contenido)
      return datos
    } catch (err) {
      
    }
  }

  async deleteById(Number){
    try {
      const contenido = await fs.promises.readFile(`./${this.archivo}.txt`, "utf-8")
      const datos = JSON.parse(contenido)
      const indice = datos.findIndex(x => x.id == Number)      
      if (indice >= 0) {
        datos.splice(indice,1)
        await fs.promises.writeFile(`./${this.archivo}.txt`, JSON.stringify(datos))        
      }else
        console.log("No se encuentra producto")
    } catch (err) {
      
    }
  }

  async deleteAll(){
    try {
      await fs.promises.writeFile(`./${this.archivo}.txt`, "[]")
    } catch (error) {
      
    }
  }
}


const productos = new Contenedor("productos")

const leche = {
  title: "leche",
  precio: 150,
  url : "https://images.vexels.com/media/users/3/160371/isolated/lists/6c40e6ebea6870c673bc72d8f215724d-ilustracion-de-vaca-de-leche-de-caja-de-leche.png"
}

productos.save(leche).then(resp => console.log(resp))

productos.getById(2).then(resp => console.log(resp))

productos.getAll().then(resp => console.log(resp))

productos.deleteById(2)

productos.deleteAll()
