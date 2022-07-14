const mongoose = require('mongoose')

const model = new mongoose.Schema({
    email: {type: String, require:true, max: 150},
    tipo : {type: String, require:true, max: 150},
    date: { type : Date, default: Date.now },
    mensaje: {type: String, require:true, max: 500}
}, { versionKey: false })

module.exports = model