const { createTransport } = require ('nodemailer');
const twilio = require ('twilio')
require('dotenv').config()
const logger = require("./logger")

const email = process.env.EMAIL

const accountSid = process.env.WAID
const authToken = process.env.WATOKEN

const client = twilio(accountSid, authToken)

const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'cristianbarra79@gmail.com',
        pass: 'mnlhgghpiqtlwdtr'
    }
});

let mailOptions = {
    from: 'Cristian', // sender address
    to: email, // list of receivers
    subject: "", // Subject line
    text: "Hello world?", // plain text body
    html: "", // html body    
}


async function enviar(text) { 
    mailOptions.subject = "Nuevo registro"
    const entries = Object.entries(text);
    const bien = entries.map(e => `<tr><td>${e[0]}:${e[1]} </td></tr>`)
    mailOptions.html = "<table>"
    mailOptions.html +=  bien.join("")
    mailOptions.html += "</table>"
    
    try {
        const info = await transporter.sendMail(mailOptions)
        logger.info("Registro exitoso");
    } catch (err) {
        logger.error(err);
    }
}

async function enviarPedido(text, nombre, email){    
    let datos ="<table>"   
   text.forEach(e => {
      datos +=  `
      <tr><td>id:${e.id}</td></tr>
      <tr><td>title:${e.title}</td></tr>
      <tr><td>price:${e.price}</td></tr>
      <tr><td>description:${e.description}</td></tr>
      <tr><td>image:${e.image}</td></tr>
      <tr><td>count:${e.count} </td></tr>
      <tr><td>&nbsp</td></tr>
      `      
   });
   datos += "</table>"
   mailOptions.subject = `Nuevo pedido de ${nombre}, ${email}`
   mailOptions.html = datos
    try {
        const info = await transporter.sendMail(mailOptions)
        logger.info("Pedido enviado");
    } catch (err) {
        logger.error(err)
    }
    try {
        const message = await client.messages.create({
           body:  `Nuevo pedido de ${nombre}, ${email}`,
           from: 'whatsapp:+14155238886',
            to: 'whatsapp:+5492245511594'
        })
        logger.info("whatsapp enviado");
     } catch (error) {
        logger.error(error)
     }
}

module.exports = {enviar, enviarPedido}