import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Notas Personales',
            version: '1.0.0',
            description: 'Documentación de la API para gestionar notas y usuarios',
        },
        servers: [{ url: 'http://localhost:3000/api/v1' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            },
            schemas: {
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        error:      { type: 'string', example: 'NOT_FOUND' },
                        message:    { type: 'string', example: 'Recurso no encontrado' },
                        statusCode: { type: 'integer', example: 404 }
                    }
                },
                Note: {
                    type: 'object',
                    properties: {
                        id:        { type: 'integer', example: 1 },
                        title:     { type: 'string',  example: 'Mi nota' },
                        content:   { type: 'string',  example: 'Contenido de la nota' },
                        imageUrl:  { type: 'string',  example: '/uploads/imagen.jpg' },
                        isPrivate: { type: 'boolean', example: false },
                        password:  { type: 'string',  example: '1234' },
                        userId:    { type: 'string',  example: 'abc123' },
                        createdAt: { type: 'string',  example: '2026-05-03T00:00:00.000Z' },
                        updatedAt: { type: 'string',  example: '2026-05-03T00:00:00.000Z' },
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        name:     { type: 'string', example: 'Daniel Rodriguez' },
                        email:    { type: 'string', example: 'daniel@gmail.com' },
                        password: { type: 'string', example: '12345678' },
                        role:     { type: 'string', example: 'admin' },
                    }
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/presentation/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('📄 Documentación Swagger disponible en http://localhost:3000/api-docs');
};