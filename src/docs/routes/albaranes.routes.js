module.exports = {
    '/api/albaranes': {
      get: {
        tags: ['Albaranes'],
        summary: 'Obtener todos los albaranes del usuario autenticado',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de albaranes',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Albaran'
                  }
                }
              }
            }
          },
          401: {
            description: 'No autorizado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      },
      post: {
        tags: ['Albaranes'],
        summary: 'Crear un nuevo albarán',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AlbaranInput'
              },
              example: {
                "projectId": "681911ce5be2f82f01010e72",
                "clientId": "6819114d5be2f82f01010e52",
                "description": "Descripción del albarán",
                "format": "materials",
                "materials": ["Material 1", "Material 2"],
                "workdate": "2023-10-01"
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Albarán creado exitosamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Albaran'
                }
              }
            }
          },
          400: {
            description: 'Datos de entrada incorrectos'
          },
          401: {
            description: 'No autorizado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      }
    },
    '/api/albaranes/{id}': {
      get: {
        tags: ['Albaranes'],
        summary: 'Obtener un albarán por ID',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID del albarán',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Albarán encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Albaran'
                }
              }
            }
          },
          401: {
            description: 'No autorizado'
          },
          404: {
            description: 'Albarán no encontrado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      },
      delete: {
        tags: ['Albaranes'],
        summary: 'Eliminar un albarán por ID',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID del albarán',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Albarán eliminado exitosamente'
          },
          401: {
            description: 'No autorizado'
          },
          404: {
            description: 'Albarán no encontrado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      }
    },
    '/api/albaranes/pdf/{id}': {
      patch: {
        tags: ['Albaranes'],
        summary: 'Generar un PDF del albarán por ID',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID del albarán',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'PDF generado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'PDF generado correctamente'
                    },
                    pdfUrl: {
                      type: 'string',
                      example: 'https://example.com/pdf/albaran123.pdf'
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'No autorizado'
          },
          404: {
            description: 'Albarán no encontrado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      },
      get: {
        tags: ['Albaranes'],
        summary: 'Descargar un PDF del albarán por ID',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID del albarán',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Descarga del PDF exitosa',
            content: {
              'application/pdf': {
                schema: {
                  type: 'string',
                  format: 'binary'
                }
              }
            }
          },
          401: {
            description: 'No autorizado'
          },
          404: {
            description: 'PDF o albarán no encontrado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      }
    },
    '/api/albaranes/sign/{id}': {
      patch: {
        tags: ['Albaranes'],
        summary: 'Firmar un albarán por ID',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID del albarán',
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: {
                  image: {
                    type: 'string',
                    description: 'Nombre del archivo o datos de la imagen de la firma'
                  }
                }
              },
              example: {
                "image": "file.png"
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Albarán firmado exitosamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Albaran'
                }
              }
            }
          },
          400: {
            description: 'Datos de firma incorrectos'
          },
          401: {
            description: 'No autorizado'
          },
          404: {
            description: 'Albarán no encontrado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      }
    },
}