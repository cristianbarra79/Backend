const ChatDao = require("../daos/chatDao")

const enviarTodo = (io, socket) => { 
    ChatDao.leerMensajes().then(resp => socket.emit("mensajes", resp))
}

const recibir = (io, socket) => { 
    socket.on("envio", (data) => {        
        ChatDao.guardarMensaje(data). then(resp =>io.sockets.emit("mensajes", resp))
        
    });
}

module.exports = {enviarTodo, recibir}