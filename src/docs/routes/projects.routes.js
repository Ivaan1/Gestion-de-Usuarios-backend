module.exports = {
    '/api/projects': {
      get: {
        tags: ['Projects'],
        summary: 'Obtener todos los proyectos del usuario autenticado',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de proyectos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Project'
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
        tags: ['Projects'],
        summary: 'Crear un nuevo proyecto',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProjectInput'
              },
              example: {
                name: "Nombre del proyecto",
                projectCode: "ABC1233",
                address: {
                  street: "Carlos V",
                  number: 22,
                  postal: 28936,
                  city: "Móstoles",
                  province: "Madrid"
                },
                code: "INT-CODE-999",
                clientId: "6819114d5be2f82f01010e52"
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Proyecto creado exitosamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Project'
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
    '/api/projects/{id}': {
      get: {
        tags: ['Projects'],
        summary: 'Obtener un proyecto por ID',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID del proyecto',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Proyecto encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Project'
                }
              }
            }
          },
          401: {
            description: 'No autorizado'
          },
          404: {
            description: 'Proyecto no encontrado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      },
      put: {
        tags: ['Projects'],
        summary: 'Actualizar un proyecto por ID',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID del proyecto',
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
                $ref: '#/components/schemas/ProjectUpdateInput'
              },
              example: {
                name: "Nombre del proyecto actualizado",
                notes: "Notas del proyecto"
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Proyecto actualizado exitosamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Project'
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
          404: {
            description: 'Proyecto no encontrado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      },
      delete: {
        tags: ['Projects'],
        summary: 'Eliminar un proyecto por ID',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID del proyecto',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Proyecto eliminado exitosamente'
          },
          401: {
            description: 'No autorizado'
          },
          404: {
            description: 'Proyecto no encontrado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      }
    },
    '/api/projects/archive/{id}': {
      patch: {
        tags: ['Projects'],
        summary: 'Archivar un proyecto por ID',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID del proyecto',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Proyecto archivado exitosamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Project'
                }
              }
            }
          },
          401: {
            description: 'No autorizado'
          },
          404: {
            description: 'Proyecto no encontrado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      }
    },
    '/api/projects/restore/{id}': {
      patch: {
        tags: ['Projects'],
        summary: 'Desarchivar un proyecto por ID',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID del proyecto',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Proyecto desarchivado exitosamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Project'
                }
              }
            }
          },
          401: {
            description: 'No autorizado'
          },
          404: {
            description: 'Proyecto no encontrado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      }
    }
};