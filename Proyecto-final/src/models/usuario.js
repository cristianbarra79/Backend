const mongoose = require('mongoose')

const model = new mongoose.Schema({
    email: {type: String, require:true, max: 250},    
    password: {type: String, require:true, max: 250},
    nombre: {type: String, require:true, max: 250},
    direccion: {type: String, require:true, max: 200},
    edad:{type: Number, require:true},
    avatar:{type: String, require:true, max: 200},
    telefono:{type: String, require:true, max: 200}
}, { versionKey: false })

module.exports = model