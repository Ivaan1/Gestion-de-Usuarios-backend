// Importa el módulo http que viene preinstalado en Node.js
const http = require('http');

// Crea el servidor HTTP
const server = http.createServer((req, res) => {
  // Configura el código de estado HTTP y los encabezados
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Envia la respuesta al cliente
  res.end('¡Hola, mundo! Este es un servidor con Node.js\n');
});

// Configura el servidor para que escuche en el puerto 3000
server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
