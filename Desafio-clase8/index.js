const express = require('express')
const fs = require('fs')
const { Router } = express

const app = express()
const router = Router()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

async function pedirArchivos(req, res, next){    
        try {
          const contenido = await fs.promises.readFile(`./productos.txt`, "utf-8")
          const datos = JSON.parse(contenido)
          req.datos = datos
        } catch (err) {
          console.log(err);
        }
    next()
}

function filtrar(req,res,next) {
    const datos = req.datos    
    const producto = datos.find(prod => prod.id == req.params.id)
    if (!producto) {
        req.filtrado = { error : 'producto no encontrado' }
    }else
        req.filtrado = producto
    next()
}

async function agregar(req,res,next){
    try{
        const contenido = req.datos

        let indice = contenido.length>0 ? contenido[contenido.length-1].id+1 : 1
        let object = req.body
        object = {...object, id : indice}        
        req.agregado = object
        contenido.push(object)
        
        try{
            await fs.promises.writeFile(`./productos.txt`, JSON.stringify(contenido))
            next()
        }
        catch(err){
            console.log(`Error al escribir: ${err}`);
        }
    }
    catch(err){            
        console.log(`Error al leer: ${err}`);        
    }
}

async function modificar(req,res,next) {
    const datos = req.datos
    
    let indexProducto = datos.findIndex(x => x.id == req.params.id);    
    if (!datos[indexProducto]) {
        res.end("No se encuntra producto")
    }else{
        const cambio = Object.assign(datos[indexProducto], req.body);
        datos[indexProducto]= cambio
        await fs.promises.writeFile(`./productos.txt`, JSON.stringify(datos))
        next()
    }    
    
}

async function deleteById(req,res,next){

    const contenido = req.datos      
    const indice = contenido.findIndex(x => x.id == req.params.id)      
    if (indice >= 0) {
        contenido.splice(indice,1)
        try {
            await fs.promises.writeFile(`./productos.txt`, JSON.stringify(contenido))        
            
        } catch (err) {
            console.log("error al escribir" + err);
        }
    }else
     res.end("No se encuentra el articulo")
    next()
      
    
}

router.get('/', pedirArchivos, (req, res) => {
    res.send(req.datos)    
})

router.post('/', pedirArchivos, agregar,(req, res) => {
    res.send(req.agregado)
})


router.get('/:id', pedirArchivos, filtrar, (req, res) => {
    res.send(req.filtrado)    
})

router.put('/:id', pedirArchivos, modificar, (req, res) => {
    res.send("Articulo actualizado")    
})

router.delete('/:id', pedirArchivos, deleteById,(req,res) =>{
    res.send("Articulo eliminado")
})

app.use('/static', express.static('public'));

app.use('/api/productos', router)
app.listen(8080)