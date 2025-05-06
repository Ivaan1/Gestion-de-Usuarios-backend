
// src/docs/schemas/user.schema.js
module.exports = {
    Address: {
        type: 'object',
        properties: {
            street: {
                type: 'string',
                description: 'Dirección',
                example: 'Calle Gran Vía'
            },
            number: {
                type: 'string',
                description: 'Número de la dirección',
                example: '123'
            },
            city: {
                type: 'string',
                description: 'Ciudad',
                example: 'Madrid'
            },
            postal: {
                type: 'string',
                description: 'Código postal',
                example: '28001'
            },
            province: {
                type: 'string',
                description: 'Provincia',
                example: 'Madrid'
            }
        }
    },
    User: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          description: 'ID único del usuario',
          example: '60d21b4667d0d8992e610c85'
        },
        name: {
          type: 'string',
          description: 'Nombre del usuario',
          example: 'Juan Pérez'
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'Correo electrónico del usuario',
          example: 'juan@empresa.com'
        },
        role: {
          type: 'string',
          enum: ['admin', 'usuario'],
          description: 'Rol del usuario en el sistema (por defecto: "usuario")',
          example: 'usuario'
        },
        password: {
          type: 'string',
          format: 'password',
          description: 'Contraseña del usuario',
          example: 'contraseña123'
        },
        profilePicture: {
          type: 'string',
          description: 'URL de la imagen de perfil',
          example: 'https://via.placeholder.com/150'
        },
        company: {
          type: 'string',
          description: 'ID de la empresa a la que pertenece (si aplica)',
          example: '60d21b4667d0d8992e610c90'
        },
        address : {
            $ref: '#/components/schemas/Address'
      },
      deleted : {
        type: 'boolean',
        description: 'Indica si el usuario ha sido archivado (por defecto: false)',
        example: false
      },
      validated : {
        type: 'boolean',
        description: 'Indica si el usuario ha sido validado (por defecto: false)',
        example: false
      },
      tries : {
        type: 'number',
        description: 'Número de intentos de acceso fallidos (por defecto: 3)',
        example: 3
      },
        step : {
            type: 'number',
            description: 'Número de pasos en el proceso de registro (por defecto: 0)',
            example: 0
        },
        validationCode : {
            type: 'number',
            description: 'Código de validación enviado al correo electrónico',
            example: 123456
        },
        registryDate : {
            type: 'Date',
            description: 'Fecha de registro del usuario',
            example: '2023-10-01T12:00:00Z'
        },
        about : {
            type: 'string',
            description: 'Información adicional sobre el usuario',
            example: 'Desarrollador web con 5 años de experiencia.'
        },
        phone : {
            type: 'string',
            description: 'Número de teléfono del usuario',
            example: '+34 612 345 678'
        },
    }
    },
    UserInput: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'juan@empresa.com'
        },
        password: {
          type: 'string',
          format: 'password',
          example: 'Contraseña123'
        },
      }
    }
}