require('dotenv').config()

const uri = process.env.URI


const mongoDatos = {
    URL : uri,
    option: {
        useNewUrlParser: true,
        useUnifiedTopology : true
    }
}

module.exports = mongoDatos