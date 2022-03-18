# Desafío: Segunda entrega del Proyecto Final
### Coderhouse

Consigna: Basándose en los contenedores ya desarrollados (memoria, archivos) desarrollar dos contenedores más (que cumplan con la misma interfaz) que permitan realizar las operaciones básicas de CRUD en MongoDb (ya sea local o remoto) y en Firebase. Luego, para cada contenedor, crear dos clases derivadas, una para trabajar con Productos, y otra para trabajar con Carritos.

Para esta entrega se crearon 3 contenedores (archivo, mongo y firebase) ubicados en la carpeta contenedores, en la carpeta daos se encuentran en sus respectivas carpetas las clases de productos y carrito los cuales tienen un archivo para cada sistema de persistencia y un archivo index.js que las importa y exporta la adecuada según el método de persistencia elegido; la elección del método de persistencia se hace con un archivo .env en la raíz del proyecto. En la carpeta router se encuentran los endpoints para productos y carrito.  

Los endpoint para la ruta "/productos" son:

- GET: '/:id?' - Me permite listar todos los productos disponibles ó un producto por su id
- POST: '/' - Para incorporar productos al listado
- PUT: '/:id' - Actualiza un producto por su id
- DELETE: '/:id' - Borra un producto por su id

Y para la ruta "/carrito" son:
- POST: '/' - Crea un carrito y devuelve su id.
- DELETE: '/:id' - Vacía un carrito y lo elimina.
- GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
- POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto
- DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto

Para la prueba de los distintos endpoints se usó el sofware [Postman]

## Tecnologías usadas

- [Express]
- [firebase-admin]
- [mongoose]
- [dotenv]
- [nodemon]

## Método de persistencia

Se usa un archivo .env para elegir el método de persistencia el cual contendrá el siguiente comando según el método

| Método | Comando |
| ------ | ------ |
| Archivo | DB="archivo" |
| MongoDB | DB="mongo" |
| Firebase | DB="firebase"|

### Correr el servidor:

Se incluye en el package.json un script de start que corre el comando `nodemon server.js` que permite correr el servidor y reiniciarlo cada vez que se guarda algún cambio. Para iniciar el servidor de este modo hay que escribir en la terminal


```sh
npm start
```
[postman]: <https://www.postman.com/>
[Express]: <https://expressjs.com/es/>
[firebase-admin]: <https://firebase.google.com/docs/admin/setup?hl=es-419>
[mongoose]: <https://mongoosejs.com/>
[dotenv]: <https://www.npmjs.com/package/dotenv>
[nodemon]: <https://www.npmjs.com/package/nodemon>