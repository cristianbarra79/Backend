// const options = {
//     client : "sqlite3",
//     connection: {
//         filename: "./DB/mydb.sqlite"
//     },
//     useNullAsDefault: true
// }

// module.exports = {
//     options
// }


const options = {
    client: 'sqlite3',
    connection: {
        filename: `${__dirname}/DB/mydb.sqlite`
    },
        useNullAsDefault: true
}

module.exports = {options}