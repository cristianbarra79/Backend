const mongoose = require('mongoose')

const model = new mongoose.Schema({
    id: {type: Number, require:true},
    email: {type: String, require:true, max: 100},
    date: { type: Date, default: Date.now },            
    productos : {type: Array},    
    direccion: {type: String, require:true, max: 100}
}, { versionKey: false })

module.exports = model

