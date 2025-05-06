
module.exports = {
          Project: {
            type: 'object',
            properties: {
              _id: {
                type: 'string',
                description: 'ID único del proyecto'
              },
              name: {
                type: 'string',
                description: 'Nombre del proyecto'
              },
              projectCode: {
                type: 'string',
                description: 'Código del proyecto'
              },
              address: {
                type: 'object',
                properties: {
                  street: {
                    type: 'string',
                    description: 'Calle de la dirección'
                  },
                  number: {
                    type: 'number',
                    description: 'Número de la dirección'
                  },
                  postal: {
                    type: 'number',
                    description: 'Código postal'
                  },
                  city: {
                    type: 'string',
                    description: 'Ciudad'
                  },
                  province: {
                    type: 'string',
                    description: 'Provincia'
                  }
                }
              },
              code: {
                type: 'string',
                description: 'Código interno del proyecto'
              },
              clientId: {
                type: 'string',
                description: 'ID del cliente asociado (se añade automaticamente)'
              },
              userId: {
                type: 'string',
                description: 'ID del usuario que gestiona al cliente propietario del proyecto. Aunque el proyecto pertenece al cliente (clientId), este cliente está asociado a este usuario.(se añade automaticamente) '
              },
              companyId: {
                type: 'string',
                description: 'ID de la empresa del usuario (si tiene) (se añade automaticamente)'
              },
              notes: {
                type: 'string',
                description: 'Notas adicionales del proyecto'
              },
              archived: {
                type: 'boolean',
                description: 'Indica si el proyecto está archivado'
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
        ProjectInput: {
            type: 'object',
            required: ['name', 'projectCode', 'clientId'],
            properties: {
              name: {
                type: 'string',
                description: 'Nombre del proyecto'
              },
              projectCode: {
                type: 'string',
                description: 'Código del proyecto'
              },
              address: {
                type: 'object',
                properties: {
                  street: {
                    type: 'string',
                    description: 'Calle de la dirección'
                  },
                  number: {
                    type: 'number',
                    description: 'Número de la dirección'
                  },
                  postal: {
                    type: 'number',
                    description: 'Código postal'
                  },
                  city: {
                    type: 'string',
                    description: 'Ciudad'
                  },
                  province: {
                    type: 'string',
                    description: 'Provincia'
                  }
                }
              },
              code: {
                type: 'string',
                description: 'Código interno del proyecto'
              },
              clientId: {
                type: 'string',
                description: 'ID del cliente asociado'
              },
              notes: {
                type: 'string',
                description: 'Notas adicionales del proyecto'
              },
              clientId: {
                type: 'string',
                description: 'ID del cliente asociado (se añade automaticamente)'
              },
              userId: {
                type: 'string',
                description: 'ID del usuario que gestiona al cliente propietario del proyecto. Aunque el proyecto pertenece al cliente (clientId), este cliente está asociado a este usuario.(se añade automaticamente) '
              },
              companyId: {
                type: 'string',
                description: 'ID de la empresa del usuario (si tiene) (se añade automaticamente)'
              },
            }
        },
        ProjectUpdateInput: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Nombre del proyecto'
              },
              projectCode: {
                type: 'string',
                description: 'Código del proyecto'
              },
              address: {
                type: 'object',
                properties: {
                  street: {
                    type: 'string',
                    description: 'Calle de la dirección'
                  },
                  number: {
                    type: 'number',
                    description: 'Número de la dirección'
                  },
                  postal: {
                    type: 'number',
                    description: 'Código postal'
                  },
                  city: {
                    type: 'string',
                    description: 'Ciudad'
                  },
                  province: {
                    type: 'string',
                    description: 'Provincia'
                  }
                }
              },
              code: {
                type: 'string',
                description: 'Código interno del proyecto'
              },
              clientId: {
                type: 'string',
                description: 'ID del cliente asociado'
              },
              notes: {
                type: 'string',
                description: 'Notas adicionales del proyecto'
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

