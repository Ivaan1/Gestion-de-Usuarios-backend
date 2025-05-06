
// src/docs/schemas/user.schema.js
module.exports = {
    Albaran: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'ID único del albarán'
          },
          userId: {
            type: 'string',
            description: 'ID del usuario que creó el albarán'
          },
          companyId: {
            type: 'string',
            description: 'ID de la empresa asociada (opcional)'
          },
          clientId: {
            type: 'string',
            description: 'ID del cliente asociado'
          },
          projectId: {
            type: 'string',
            description: 'ID del proyecto asociado'
          },
          format: {
            type: 'string',
            enum: ['materials', 'hours'],
            description: 'Formato del albarán: materiales u horas'
          },
          materials: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Lista de materiales (requerido si format es materials)'
          },
          hours: {
            type: 'array',
            items: {
              type: 'number'
            },
            description: 'Lista de horas (requerido si format es hours)'
          },
          description: {
            type: 'string',
            description: 'Descripción del albarán'
          },
          workdate: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha del trabajo realizado'
          },
          sign: {
            type: 'string',
            description: 'Ruta o archivo de la firma (opcional)'
          },
          signed: {
            type: 'boolean',
            description: 'Indica si el albarán ha sido firmado'
          },
          pending: {
            type: 'boolean',
            description: 'Indica si el albarán está pendiente'
          },
          pdfUrl: {
            type: 'string',
            description: 'URL del PDF generado (opcional)'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de creación'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de última actualización'
          }
        }
      },
      AlbaranInput: {
        type: 'object',
        required: ['clientId', 'projectId', 'format', 'description'],
        properties: {
          clientId: {
            type: 'string',
            description: 'ID del cliente asociado'
          },
          projectId: {
            type: 'string',
            description: 'ID del proyecto asociado'
          },
          format: {
            type: 'string',
            enum: ['materials', 'hours'],
            description: 'Formato del albarán: materiales u horas'
          },
          materials: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Lista de materiales (requerido si format es materials)'
          },
          hours: {
            type: 'array',
            items: {
              type: 'number'
            },
            description: 'Lista de horas (requerido si format es hours)'
          },
          description: {
            type: 'string',
            description: 'Descripción del albarán'
          },
          workdate: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha del trabajo realizado'
          },
          pending: {
            type: 'boolean',
            description: 'Indica si el albarán está pendiente'
          }
        }
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
}