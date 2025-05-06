// src/docs/swagger.js
const swaggerJsDoc = require('swagger-jsdoc');

// Importar definiciones de rutas
const userRoutes = require('./routes/users.routes');
const clientRoutes = require('./routes/clients.routes');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/projects.routes');
const albaranesRoutes = require('./routes/albaranes.routes');

// Importar esquemas/modelos
const schemas = require('./schemas');

// Configuración base de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gestion de Usuarios y Albaranes',
      version: '1.0.0',
      description: 'API para gestionar usuarios y albaranes',
      contact: {
        name: 'Ivan Aranda',
        email: 'ivan.aranda@live.u-tad.com',
        url: 'https://u-tad.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Servidor de desarrollo'
      }
    ],
    tags: [
      { name: 'Users', description: 'Operaciones con usuarios' },
      { name: 'Clients', description: 'Operaciones con clientes' },
      { name: 'Auth', description: 'Operaciones de autenticación' },
      { name : 'Projects', description: ' Operaciones con Project' },
      { name : 'Albaranes', description: 'Operaciones con Albaranes'}
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      ...schemas.components
    }
  },
  apis: [] // No incluimos archivos con anotaciones JSDoc
};

// Combinar todas las definiciones de rutas
const paths = {
  ...userRoutes,
  ...clientRoutes,
  ...authRoutes,
  ...projectRoutes,
  ...albaranesRoutes
};

// Agregar paths a las opciones de Swagger
swaggerOptions.definition.paths = paths;

// Generar especificaciones
const specs = swaggerJsDoc(swaggerOptions);

module.exports = { specs };