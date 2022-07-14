const {createLogger, format, transports} = require("winston")
require('dotenv').config()

const env = process.env.NODE_ENV || "PROD"

let logger

if (env == "PROD") {
    logger = createLogger({
       format: format.combine(
           format.simple(),
           format.timestamp(),
           format.printf(info => `[${info.timestamp}] [${info.level}] [${info.message}]`)
        ),
       transports: [          
          new transports.Console()
       ]
    })
}else{
    logger = createLogger({
       format: format.combine(
           format.simple(),
           format.timestamp(),
           format.printf(info => `[${info.timestamp}] [${info.level}] [${info.message}]`)
        ),
       transports: [
          new transports.File({
             filename : "./logs/log.log",
             level: "warn"
          }),
          new transports.Console({
             level: "info"
          })
       ]
    })
}


module.exports = logger