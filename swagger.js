const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Band Manager API',
      version: '1.0.0',
      description: 'A band manager API with Swagger documentation',
    },
  },
  // Paths to API docs files
  apis: ['./routes/*.js'], // Add the path to your API route files here
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
