
module.exports = {
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Obtener todos los usuarios',
        description: 'Retorna una lista de todos los usuarios registrados en el sistema',
        operationId: 'getUsers',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'Operación exitosa',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/User'
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'No autorizado - Token inválido o expirado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      },
      patch: {
        tags: ['Users'],
        summary: 'Actualizar un usuario',
        description: 'Actualiza la información de un usuario existente',
        operationId: 'updateUser',
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
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Juan Pérez'
                  },
                  nif: {
                    type: 'string',
                    example: '12345678A'
                  },
                  address: {
                    $ref: '#/components/schemas/Address'
                  },
                  phone: {
                    type: 'string',
                    example: '123456789'
                  },
                  about : {
                    type: 'string',
                    example: 'Sobre mí...'
                },
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Usuario actualizado correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          400: {
            description: 'Datos de entrada inválidos'
          },
          401: {
            description: 'No autorizado - Token inválido o expirado'
          },
          404: {
            description: 'Usuario no encontrado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      }
    },
    '/api/users/company': {
      get: {
        tags: ['Users'],
        summary: 'Obtener información de la empresa del usuario',
        description: 'Retorna la información de la empresa asociada al usuario autenticado',
        operationId: 'getCompany',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'Operación exitosa',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    company: {
                      $ref: '#/components/schemas/Company'
                  }
                }
              }
            }
        }
          },
          401: {
            description: 'No autorizado - Token inválido o expirado'
          },
          404: {
            description: 'Empresa no encontrada'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      },
      patch: {
        tags: ['Users'],
        summary: 'Añadir o actualizar empresa del usuario',
        description: 'Añade o actualiza la empresa asociada al usuario autenticado',
        operationId: 'addCompany',
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
                    type: 'object',
                    properties: {
                    name: {
                        type: 'string',
                        example: 'Empresa XYZ S.L.'
                    },
                    address: {
                        $ref: '#/components/schemas/Address'
                    }
                    },
                    required: ['name', 'address']
                }
                }
            }
        },
        responses: {
          200: {
            description: 'Empresa asociada correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Company'
                }
              }
            }
          },
          400: {
            description: 'Datos de entrada inválidos'
          },
          401: {
            description: 'No autorizado - Token inválido o expirado'
          },
          404: {
            description: 'Empresa no encontrada'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      }
    },
    '/api/users/archive': {
      patch: {
        tags: ['Users'],
        summary: 'Archivar usuario',
        description: 'Marca el usuario loggeado como archivado, coge el ID del token',
        operationId: 'archiveUser',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'Usuario archivado correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                },
                example: {
                    _id: '60d21b4667d0d8992e610c85',
                    name: 'Juan Pérez',
                    email: 'example@gmail.com', 
                    role: 'usuario',
                    profilePicture: 'https://via.placeholder.com/150',
                    companyId: '60d21b4667d0d8992e610c90',
                    address: {
                        street: 'Calle Falsa 123',
                        city: 'Madrid',
                        postal: '28001',
                        province: 'Madrid'
                    },
                    phone: '123456789',
                    about: 'Sobre mí...',
                    activeProjects: 0,
                    pendingDeliveryNotes: 0,
                    deleted: true,
                }
              }
            }
          },
          400: {
            description: 'Datos de entrada inválidos'
          },
          401: {
            description: 'No autorizado - Token inválido o expirado'
          },
          404: {
            description: 'Usuario no encontrado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      }
    },
    '/api/users/restore': {
      patch: {
        tags: ['Users'],
        summary: 'Restaurar usuario archivado',
        description: 'Restaura el usuario loggeado previamente archivado',
        operationId: 'restoreUser',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'Usuario restaurado correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          400: {
            description: 'Datos de entrada inválidos'
          },
          401: {
            description: 'No autorizado - Token inválido o expirado'
          },
          404: {
            description: 'Usuario no encontrado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      }
    },
    '/api/users/image': {
      patch: {
        tags: ['Users'],
        summary: 'Subir imagen de perfil',
        description: 'Sube una nueva imagen de perfil para el usuario',
        operationId: 'uploadImage',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Archivo de imagen a subir'
                  }
                },
                required: ['image']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Imagen subida correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    profilePicture: {
                      type: 'string',
                      description: 'URL de la imagen subida'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Formato de archivo inválido o error en la carga'
          },
          401: {
            description: 'No autorizado - Token inválido o expirado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      }
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Obtener usuario por ID',
        description: 'Retorna la información de un usuario específico',
        operationId: 'getUser',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID del usuario a consultar',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Operación exitosa',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          400: {
            description: 'ID inválido'
          },
          401: {
            description: 'No autorizado - Token inválido o expirado'
          },
          404: {
            description: 'Usuario no encontrado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      },
      delete: {
        tags: ['Users'],
        summary: 'Eliminar usuario por ID',
        description: 'Elimina un usuario específico del sistema',
        operationId: 'deleteUser',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID del usuario a eliminar',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Usuario eliminado correctamente'
          },
          400: {
            description: 'ID inválido'
          },
          401: {
            description: 'No autorizado - Token inválido o expirado'
          },
          403: {
            description: 'Prohibido - No tiene permisos suficientes'
          },
          404: {
            description: 'Usuario no encontrado'
          },
          500: {
            description: 'Error del servidor'
          }
        }
      }
    }
  };