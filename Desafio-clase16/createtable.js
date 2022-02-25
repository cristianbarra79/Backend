const {options: mariaDB} = require("./options/mariaDB")
const {options: sqlite3} = require("./options/sqlite3")
const knex = require("knex")

knex(sqlite3).schema.createTable('chat', (table) => {
    
    table.string('email',250)
    table.string('fyh',250)
    table.string('mensaje',250)
  })
  .then(() => console.log("tabla creada"))

knex(mariaDB).schema.createTable('productos', (table) => {

    table.increments('id')
    table.string('title',250)
    table.integer('price')
    table.string('thumbnail',250)
  })
  .then(() => console.log("tabla creada"))