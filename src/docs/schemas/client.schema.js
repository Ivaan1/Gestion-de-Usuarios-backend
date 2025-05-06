// src/docs/schemas/client.schema.js
module.exports = {
    Client: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          description: 'ID único del cliente',
          example: '60d21b4667d0d8992e610c86'
        },
        name: {
          type: 'string',
          description: 'Nombre o razón social del cliente',
          example: 'Empresa ABC S.L.'
        },
        cif: {
          type: 'string',
          description: 'CIF o NIF del cliente',
          example: 'B12345678'
        },
        address: {
          type: 'object',
          properties: {
            street: {
              type: 'string',
              description: 'Dirección',
              example: 'Calle Gran Vía 123'
            },
            city: {
              type: 'string',
              description: 'Ciudad',
              example: 'Madrid'
            },
            postalCode: {
              type: 'string',
              description: 'Código postal',
              example: '28001'
            },
            country: {
              type: 'string',
              description: 'País',
              example: 'España'
            }
          }
        },
        company: {
          type: 'string',
          description: 'ID de la empresa asociado al usuario (si aplica)',
          example: '60d21b4667d0d8992e610c90'
        },
        userId: {
          type: 'string',
            description: 'ID del usuario propietario del cliente',
            example: '60d21b4667d0d8992e610c85'
        },
        activeProjects: {
          type: 'integer',
          description: 'Número de proyectos activos asociados al cliente',
          example: 5
        },
        pendingDeliveryNotes: {
          type: 'integer',
          description: 'Número de albaranes pendientes asociados al cliente',
          example: 2
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Fecha de creación del cliente',
          example: '2023-01-15T09:30:00Z'
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Fecha de última actualización del cliente',
          example: '2023-02-20T16:45:00Z'
        },
        email:{
            type: 'string',
            description: 'Email de contacto del cliente'
        },
        deleted: {
            type: 'boolean',
            description: 'Archivado',
            example: 'false'
        }
      }
    },
    ClientInput: {
        type: 'object',
        required: ['name','email','userId'],
        properties: {
        email:{
            type: 'string',
            description: 'Email de contacto del cliente'
            },
          name: {
            type: 'string',
            description: 'Nombre del cliente o empresa'
          },
          cif: {
            type: 'string',
            description: 'CIF/NIF/DNI del cliente o empresa'
          },
          userId: {
            type: 'string',
            description: 'ID del usuario propietario del cliente (se añade automáticamente)'
          },
          address: {
            $ref: '#/components/schemas/Address'
          }
        }
      },
      ClientUpdateInput: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Nombre del cliente o empresa'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Correo electrónico del cliente'
          },
          cif: {
            type: 'string',
            description: 'CIF/NIF/DNI del cliente o empresa'
          },
          pendingDeliveryNotes: {
            type: 'integer',
            description: 'Número de albaranes pendientes'
          },
          address: {
            $ref: '#/components/schemas/Address'
          },
          activeProjects : {
            type: 'integer',
            description: 'Numero de proyectos en activo'
          }
        }
    },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
    },
}
