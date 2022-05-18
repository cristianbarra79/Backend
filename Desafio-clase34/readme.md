# Desafío: Tercera entrega del Proyecto Final
### Coderhouse

Para esta entrega se añadieron endpoints para el registro, logueo y deslogueo de usuarios a los endpoints de la anterior entrega, si no esta realizado el logueo los demas endpoints no funcionaran. Ademas se creo un ednpoint a la ruta de carrito para finalizar la compra, el cual enviara un mail al administrador con el pedido y un whatsapp avisando del pedido. Para la estrategia de guardado se uso passport y bcrypt para encriptar la contraseña, se uso winston reemplazar los console.log y guardar los error en un archivo. Se uso cluster para mejorar el balanceo de carga y se probo con Artillery. De base de datos se uso Mongo Atlas.

Los endpoint para usuarios son:

- POST: '/login' -Se debe enviar el mail y la contraseña para autenticar, devuelve un token de la sesion
- POST: '/register' - Se debe enviar email, password, nombre, direccion, edad, telefono y avatar
- POST: '/logout' - Realiza el cierre de sesion
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
- POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto
- DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto
- POST: '/:id/finalizar' - Finaliza la compra

Para la prueba de los distintos endpoints se usó el sofware [Postman]

## Tecnologías usadas

- express
- express-session
- mongoose
- dotenv
- nodemon
- bcrypt
- cookie-parser
- nodemailer
- twilio
- winston
- passport

### Correr el servidor:

Se incluye en el package.json un script de dev que corre el comando `nodemon server.js` que permite correr el servidor y reiniciarlo cada vez que se guarda algún cambio. Para iniciar el servidor de este modo hay que escribir en la terminal


```sh
npm run dev
```
[postman]: <https://www.postman.com/>