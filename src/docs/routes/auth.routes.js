module.exports = {
    '/auth/register': {
        post: {
            tags: ['Auth'],
            summary: 'Registrar un nuevo usuario',
            description: 'Te permite registrar un nuevo usuario en el sistema.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                email: { type: 'string', example: 'example@gmail.com' },
                                password: { type: 'string', example: 'password123' }
                            },
                            required: ['email', 'password']
                        }
                    }
                }
            },
            responses: {
                '201': {
                    description: 'User registered successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR...' },
                                    user: {
                                        type: 'object',
                                        properties: {
                                            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR...' },
                                            tries: { type: 'number', example: 0 },
                                            validationCode: { type: 'number', example: 123456 },
                                            validated: { type: 'boolean', example: false },
                                            registryDate: { type: 'string', format: 'date-time', example: '2023-01-15T09:30:00Z' }
                                        }
                                }
                            }
                        }
                    }
                }
                },
                '400': {
                    description: 'Bad request',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: { type: 'string', example: 'Invalid input data' }
                                }
                            }
                        }
                    }
                },
                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: { type: 'string', example: 'Server error' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/auth/login': {
        post: {
            tags: ['Auth'],
            summary: 'Inicia sesion con un usuario existente',
            description: 'Este endpoint permite iniciar sesión con un usuario existente y devuelver un token de autenticación.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                email: { type: 'string', example: 'example@gmail.com' },
                                password: { type: 'string', example: 'password123' }
                            },
                            required: ['email', 'password']
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'User logged in successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR...' }
                                }
                            }
                        }
                    }
                },
                '401': {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: { type: 'string', example: 'Invalid credentials' }
                                }
                            }
                        }
                    }
                },
                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: { type: 'string', example: 'Server error' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/auth/recovery': {
        post: {
            tags: ['Auth'],
            summary: 'Recuperar contraseña',
            description: 'Envía un código de recuperación al correo del usuario.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                email: { type: 'string', example: 'example@gmail.com' }
                            },
                            required: ['email']
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'User validated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR...' }
                                }
                            }
                        }
                    }
                },
                '400': {
                    description: 'Bad request',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: { type: 'string', example: 'Invalid input data' }
                                }
                            }
                        }
                    }
                },
                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: { type: 'string', example: 'Server error' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/auth/validation' : {
        post: {
            tags: ['Auth'],
            summary: 'Enviar código de validación',
            description: 'enviar el codigo de validacion recibido y obtener la contraseña por correo',
            security: [
                {
                  bearerAuth: []
                }
              ],
            responses: {
                '200': {
                    description: 'Se envia la contraseña al correo del usuario',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string', example: 'Validation code sent successfully' }
                                }
                            }
                        }
                    }
                },
                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: { type: 'string', example: 'Server error' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
}

