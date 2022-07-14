const mongoose = require('mongoose')

const model = new mongoose.Schema({
    numeroOrden: {type: Number, require:true},
    productos : {type: Array},
    date: { type : Date, default: Date.now },
    estado: {type: String, require:true, max: 150, default: "generada"},
    email: {type: String, require:true, max: 100}
}, { versionKey: false })

module.exports = model