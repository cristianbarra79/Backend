### Paso de argumentos

El primer argumento es el puerto que va a usar el servidor, el segundo el modo de uso que puede ser fork(por defecto) o cluster.
Ejemplo:
pm2 start server.js -- -- 8081 cluster