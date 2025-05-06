module.exports = {
    '/api/clients': {
      get: {
        tags: ['Clients'],
        summary: 'Obtener todos los clientes',
        description: 'Retorna una lista de todos los clientes registrados',
        operationId: 'getClients',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Lista de clientes obtenida con éxito',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Client'
                  }
                }
              }
            }
          },
          '401': {
            description: 'No autorizado - Token inválido o expirado'
          },
          '500': {
            description: 'Error interno del servidor'
          }
        }
      },
      post: {
        tags: ['Clients'],
        summary: 'Crear un nuevo cliente',
        description: 'Crea un nuevo cliente en el sistema',
        operationId: 'createClient',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ClientInput'
              },
              example: {
                name: "ACS",
                email: "example@gmail.com",
                cif: "D52921210",
                userId: "68190f2e028e6b8b4e7676b5",
                address: {
                  street: "Carlos V",
                  number: 22,
                  postal: 28936,
                  city: "Móstoles",
                  province: "Madrid"
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Cliente creado con éxito',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Client'
                }
              }
            }
          },
          '400': {
            description: 'Datos de entrada inválidos'
          },
          '401': {
            description: 'No autorizado - Token inválido o expirado'
          },
          '500': {
            description: 'Error interno del servidor'
          }
        }
      }
    },
    '/api/clients/{id}': {
      get: {
        tags: ['Clients'],
        summary: 'Obtener un cliente por ID',
        description: 'Retorna un cliente específico según su ID',
        operationId: 'getClientById',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID del cliente a obtener',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Cliente obtenido con éxito',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Client'
                }
              }
            }
          },
          '404': {
            description: 'Cliente no encontrado'
          },
          '401': {
            description: 'No autorizado - Token inválido o expirado'
          },
          '500': {
            description: 'Error interno del servidor'
          }
        }
      },
      put: {
        tags: ['Clients'],
        summary: 'Actualizar un cliente',
        description: 'Actualiza la información de un cliente específico según su ID',
        operationId: 'updateClient',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID del cliente a actualizar',
            required: true,
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
                $ref: '#/components/schemas/ClientUpdateInput'
              },
              example: {
                name: "EJEMPLO",
                pendingDeliveryNotes: 2
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Cliente actualizado con éxito',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Client'
                }
              }
            }
          },
          '400': {
            description: 'Datos de entrada inválidos'
          },
          '404': {
            description: 'Cliente no encontrado'
          },
          '401': {
            description: 'No autorizado - Token inválido o expirado'
          },
          '500': {
            description: 'Error interno del servidor'
          }
        }
      },
      delete: {
        tags: ['Clients'],
        summary: 'Eliminar un cliente',
        description: 'Elimina permanentemente un cliente específico según su ID',
        operationId: 'deleteClient',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID del cliente a eliminar',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Cliente eliminado con éxito'
          },
          '404': {
            description: 'Cliente no encontrado'
          },
          '401': {
            description: 'No autorizado - Token inválido o expirado'
          },
          '500': {
            description: 'Error interno del servidor'
          }
        }
      }
    },
    '/api/clients/archive': {
      get: {
        tags: ['Clients'],
        summary: 'Obtener clientes archivados',
        description: 'Retorna una lista de todos los clientes archivados',
        operationId: 'getArchivedClients',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Lista de clientes archivados obtenida con éxito',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Client'
                  }
                }
              }
            }
          },
          '401': {
            description: 'No autorizado - Token inválido o expirado'
          },
          '500': {
            description: 'Error interno del servidor'
          }
        }
      }
    },
    '/api/clients/archive/{id}': {
      delete: {
        tags: ['Clients'],
        summary: 'Archivar un cliente',
        description: 'Marca un cliente específico como archivado según su ID',
        operationId: 'archiveClient',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID del cliente a archivar',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Cliente archivado con éxito',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Client'
                }
              }
            }
          },
          '404': {
            description: 'Cliente no encontrado'
          },
          '401': {
            description: 'No autorizado - Token inválido o expirado'
          },
          '500': {
            description: 'Error interno del servidor'
          }
        }
      }
    },
    '/api/clients/restore/{id}': {
      patch: {
        tags: ['Clients'],
        summary: 'Desarchivar un cliente',
        description: 'Restaura un cliente específico que estaba archivado según su ID',
        operationId: 'restoreClient',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID del cliente a restaurar',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Cliente restaurado con éxito',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Client'
                }
              }
            }
          },
          '404': {
            description: 'Cliente no encontrado'
          },
          '401': {
            description: 'No autorizado - Token inválido o expirado'
          },
          '500': {
            description: 'Error interno del servidor'
          }
        }
      }
    }
  }
    