
// src/docs/schemas/user.schema.js
module.exports = {
    Company: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          description: 'ID único de la empresa',
          example: '60d21b4667d0d8992e610c85'
        },
        name: {
          type: 'string',
          description: 'Nombre de la empresa',
          example: 'Empresa XYZ S.L.'
        },
        address : {
            $ref: '#/components/schemas/Address'
         },
        users : {
            type: 'array',
            items: {
            type: 'string',
                description: 'ID de usuario asociado a la empresa',
                example: '60d21b4667d0d8992e610c85'
        }
      },
    }
    }
}