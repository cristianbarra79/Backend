const mongoose = require('mongoose')

const model = new mongoose.Schema({
    id: {type: Number, require:true},    
    price: {type: Number, require:true},
    count: {type: Number, require:true},
    title: {type: String, require:true, max: 100},
    description: {type: String, require:true, max: 250},
    image: {type: String, require:true, max: 200},
    category:{type: String, require:true, max: 200}
}, { versionKey: false })

module.exports = model