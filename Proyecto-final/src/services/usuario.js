const usuarioDao = require("../daos/usuarioDao")
const bCrypt = require('bcrypt');
const {generateToken} = require("../utils/jwt")
const {enviar} = require("../utils/nodemailer")

class usuario{

    createHash(password) {
        return bCrypt.hashSync(
                password,
                bCrypt.genSaltSync(10),
                null);
    }

    isValidPassword(user, password) {        
        return bCrypt.compareSync(password, user.password);
    }
    async buscarUsuario(email){
        let consulta = await usuarioDao.user(email)
        if(consulta.length<1)
            return null
        return consulta[0]
    }

    async registrar(user){
        if (!user.email || !user.password || !user.nombre || !user.avatar || !user.telefono || !user.edad || !user.direccion) {
            return {error: "Envie email, password, nombre, direccion, edad, avatar y telefono"}
        }
        let respuesta = await this.buscarUsuario(user.email)        
        if(respuesta == null){
            let encrypt = await this.createHash(user.password.toString())
            user.password = encrypt
            let respuesta = await usuarioDao.guardar(user)
            enviar(respuesta)
            return respuesta
        }else{
            return {error: "Usuario ya registrado"}
        }
    }
    async login(data){
        const {email, password} = data
        if (!email || !password) {
            return {error: `Faltan enviar datos`}
        }
        const user = await this.buscarUsuario(email)
        if (!user) {
            return {error: `Usuario no registrado con este email: ${email}`}
        }
        if (!this.isValidPassword(user, password.toString())) {                        
            return {error :"Contraseña incorrecta"}
        }            
            let token = await generateToken(user)            
            return token        
    }
}

const usuarioService = new usuario
module.exports = usuarioService