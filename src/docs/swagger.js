const swaggerJsdoc = require("swagger-jsdoc")
const path = require("path");

const options = {
    definition: {
      openapi: "3.0.3",
      info: {
        title: "Gestion de Albaranes API",
        version: "0.1.0",
        description:
          "API para gestionar albaranes y usuarios",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "u-tad",
          url: "https://u-tad.com",
          email: "ricardo.palacios@u-tad.com",
        },
      },
      servers: [
        {
          url: "http://localhost:5000",
        },
      ],
      components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer"
            },
        },
        schemas:{
            user: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  name: {
                    type: 'string',
                    description: 'User name',
                    example: 'Ivan Aranda',
                  },
                  profilePicture: {
                    type: 'string',
                    description: 'Image file (PNG) of the user',
                    example: 'image.png',
                  },
                  email: {
                    type: 'string',
                    description: 'User email',
                    example: 'example@gmail.com',
                  },
                  password: {
                    type: 'string',
                    description: 'The password has to be more than 8 characters',
                  },
                  role: {
                    type: 'string',
                    description:
                      "The role of the user in the application. 'user' has limited permissions, while 'admin' has full access.",
                    enum: ['usuario', 'admin'],
                    example: 'usuario',
                  },
                  about: {
                    type: 'string',
                    example: 'Desarrolador web con experiencia en JavaScript y Python',
                  },
                  phone: {
                    type: 'string',
                    description: 'Phone number of the user',
                    example: '+34600000000',
                  },
                },
            },
            
        },
      },
    },
    apis: [path.join(__dirname, "../routes/*.js")],
  };
  
  const specs = swaggerJsdoc(options);

  module.exports = {specs}