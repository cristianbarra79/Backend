const socket = io.connect();

const chat = document.querySelector("#chat");
const input = document.querySelector("#mi-mensaje");
const boton = document.querySelector("#enviar");

const btnMail = document.querySelector("#btnNombre");
const mail = document.querySelector("#mail");

document.getElementById("chat").style.display = "none";
input.style.display = "none";
boton.style.display = "none";

var d = new Date();

socket.on("productos", (data) => {
    fetch("./plantilla.txt")
    .then(response => response.text())
    .then(datos => {
        let theTemplateScript = datos;        
        let theTemplate = Handlebars.compile(theTemplateScript);
        
        let context = {
          productos : data
        };
        let theCompiledHtml = theTemplate(context);
        
        $("#tabla").html(theCompiledHtml);
    })
});

socket.on("mensajes", (data) => {
    const todo = data
      .map(
        (e) =>
          `<div>
              <b style="color:#0051FF">${e.email}</b> <span style="color:#C95200">[${e.fyh}]</span>: <i style="color:#28FF01">${e.mensaje}</i> 
          </div>`
      )
      .join(" ");
  
    chat.innerHTML = todo;
});


const first = () => {
    let d = new Date();
    const mensaje = { email: mail.value, fyh: d.getDate() + "/" + (d.getMonth() +1) + "/" + d.getFullYear() +" " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(), mensaje: input.value };
    if (mensaje.mensaje != "") {
      socket.emit("envio", mensaje);
      input.value = "";
    } else {
      console.log("no hay nada");
    }
  };
  
  
const addProduct = (e) => {
    
    const producto = {
        title: document.querySelector('input[name="title"]').value,
        price: document.querySelector('input[name="price"]').value,
        thumbnail: document.querySelector('input[name="thumbnail"]').value
    }
    socket.emit('new-product', producto);
    return false;
};
    
boton.addEventListener("click", first);

btnMail.addEventListener("click", () => {
    if (mail.value == "") {
      alert("Escribi tu nombre");
    } else {
      mail.disabled = true;
      input.disabled = false;
      document.getElementById("chat").style.display = "block";
      document.getElementById("login").style.display = "none";
      input.style.display = "block";
      boton.style.display = "block";
    }
  });