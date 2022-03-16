var admin = require("firebase-admin");


const mongoDatos = {
    URL : "mongodb://localhost:27017/ecommerce",
    option: {
        useNewUrlParser: true,
        useUnifiedTopology : true
    }
}


var serviceAccount = require("../node-924c7-firebase-adminsdk-swgdd-8840fdb163.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const firestore = admin.firestore()



module.exports =  mongoDatos

