const express = require('express')
const fs = require('fs')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

async function pedirArchivos(req, res, next){    
    try {
      const contenido = await fs.promises.readFile(`../productos.txt`, "utf-8")
      const datos = JSON.parse(contenido)
      req.datos = datos
    } catch (err) {
      console.log(err);
    }
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
            await fs.promises.writeFile(`../productos.txt`, JSON.stringify(contenido))
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

app.set('views','./views');
app.set('view engine', 'pug');

app.get('/', pedirArchivos, (req, res) => {
    res.render("formulario")
})

app.get('/productos', pedirArchivos, (req, res) => {
    res.render("tabla.pug", {productos : req.datos})
})

app.post('/productos', pedirArchivos, agregar,(req, res) => {
    res.redirect("/productos")
})

app.listen(8080)