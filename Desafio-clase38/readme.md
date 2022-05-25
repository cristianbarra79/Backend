### Analisis del servidor

Se realizó un análisis de performance del servidor usando varias herramientas, el mismo se encuentra en el pdf Analisis de performance del servidor - Cristian Barragan


### Paso de argumentos

El primer argumento es el puerto que va a usar el servidor, el segundo el modo de uso que puede ser fork(por defecto) o cluster.
Ejemplo:
pm2 start server.js -- -- 8081 cluster