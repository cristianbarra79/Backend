const { createTransport } = require ('nodemailer');
require('dotenv').config()
const logger = require("./logger")

const email = process.env.EMAIL
const user = process.env.NODEMAILERUSER
const pass = process.env.NODEMAILERPASS

const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: user,
        pass: pass
    }
});

let mailOptions = {
    from: 'Cristian',
    to: email,
    subject: "",
    text: "Hello world?",
    html: "",
}


async function enviar(text) {
    mailOptions.subject = "Nuevo registro"

    let datos =`<table border="1">
    <tr>
        <th>email</th>
        <th>nombre</th>
        <th>direccion</th>
        <th>edad</th>
        <th>telefono</th>
        <th>avatar</th>
    </tr>
    <tr>
        <th>${text.email}</th>
        <th>${text.nombre}</th>
        <th>${text.direccion}</th>
        <th>${text.edad}</th>
        <th>${text.telefono}</th>
        <th><img src="${text.avatar}" alt="avatar"></th>
    </tr>
    </table>
    `  

    mailOptions.html = datos
    try {
        const info = await transporter.sendMail(mailOptions)
    } catch (err) {
        logger.warn(err);
    }
}

async function enviarPedido(data, nombre){
    const {numeroOrden, productos, email} = data
    let datos =`
    <h1>Orden numero: ${numeroOrden}</h1>
    <table border="1">
    <tr>
        <th>id</th>
        <th>title</th>
        <th>price</th>
        <th>image</th>
        <th>category</th>
        <th>cantidad</th>
    </tr>
    `  
    productos.forEach(e => {
        datos +=  `
        <tr>
            <td>${e.id}</td>
            <td>${e.title}</td>
            <td>${e.price}</td>
            <td><img src="${e.image}" alt="producto"></td>
            <td>${e.category} </td>            
            <td>${e.cantidad} </td>            
        </tr>
        `      
    });
    datos += "</table>"
    mailOptions.subject = `Nuevo pedido de ${nombre}, ${email}`
    mailOptions.html = datos
    try {
        const info = await transporter.sendMail(mailOptions)
        return info        
    } catch (err) {
        logger.warn(err)
    }
    
}

module.exports = {enviar, enviarPedido}