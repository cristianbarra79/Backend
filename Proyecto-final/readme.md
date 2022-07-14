# Proyecto Final - Backend
### Coderhouse

Link: [heroku][heroku]

Servidor Ecommerce basado en node js, express, mongo. 
El servidor cuenta con la posibilidad de crear y loguear usuarios; añadir, modificar y eliminar productos y crear, eliminar y añadir productos a un carrito de compras en el cual se podrá realizar la finalización de la compra.
Al crear el usuario se usara la dependencia bcrypt para encriptar la contraseña y al loguear el servidor devolverá un token necesario para poder realizar las demás tareas.
Las tecnologías que se usaron fueron jsonwebtoken para crear y autenticar el token, mongoose para la conexión de la base de datos, nodemailer para el envió de un mail al administrador al registro de un nuevo usuario o la generación de una orden de compra, winston para la generación de un archivo con los errores del servidor y websocket con socket.io para realizar un chat para el frontend. Se configuro el servidor para poder funcionar en modo cluster para mejorar el balanceo de carga de ser necesario

Los endpoint para usuarios son:

- POST: '/login' -Se debe enviar el mail y la contraseña para autenticar, devuelve un token de la sesion
- POST: '/register' - Se debe enviar email, password, nombre, direccion, edad, telefono y avatar
- GET: '/perfil' - Devuelve los datos del usuario logueado

Los endpoint para la ruta "/productos" son:

- GET: '/:id?' - Me permite listar todos los productos disponibles ó un producto por su id
- POST: '/' - Para incorporar productos al listado
- PUT: '/:id' - Actualiza un producto por su id
- DELETE: '/:id' - Borra un producto por su id

Y para la ruta "/carrito" son:

- POST: '/' - Crea un carrito y devuelve su id.
- DELETE: '/:id' - Vacía un carrito y lo elimina.
- GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
- POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto el cual se enviará en el body
- DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto
- POST: '/:id/finalizar' - Finaliza la compra

Para la prueba de los distintos endpoints se usó el sofware [Postman]

La aplicación cuenta con un frontend generado en react para una visualización de como funcionaria el servidor y para la prueba del chat

## Tecnologías usadas

- express
- mongoose
- dotenv
- nodemon
- bcrypt
- websocket
- socket.io
- nodemailer
- jsonwebtoken
- winston


### Correr el servidor:

Se incluye en el package.json un script de dev que corre el comando `nodemon server.js` que permite correr el servidor y reiniciarlo cada vez que se guarda algún cambio. Para iniciar el servidor de este modo hay que escribir en la terminal


```sh
npm run dev
```
[postman]: <https://www.postman.com/>
[heroku]: <https://barragan-proyecto-final.herokuapp.com/>
