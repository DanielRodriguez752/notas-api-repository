import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '📝 API de Notas Personales',
            version: '1.0.0',
            description: `
## API REST para gestión de notas personales

### Características:
- 🔐 Autenticación con JWT
- 📝 Gestión de notas con imágenes
- 🗂️ Organización por categorías
- 📧 Compartir notas por email
- 🌐 Notas públicas sin token

### Flujo de uso:
1. Hacer login en **/auth/login** para obtener el token
2. Hacer clic en **Authorize** 🔒 y pegar el token
3. Usar los endpoints de notas y categorías
            `
        },
        servers: [
            { 
                url: 'http://localhost:3000/api/v1',
                description: '🖥️ Servidor local de desarrollo'
            }
        ],
        tags: [
            { name: 'Auth',       description: '🔐 Endpoints de autenticación' },
            { name: 'Notes',      description: '📝 Endpoints de notas' },
            { name: 'Categories', description: '🗂️ Endpoints de categorías' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Ingresa tu token JWT. Ejemplo: **Bearer eyJhbGci...**'
                }
            },
            schemas: {
                // ✅ Schema de error reutilizable
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        error:      { type: 'string',  example: 'NOT_FOUND' },
                        message:    { type: 'string',  example: 'Recurso no encontrado' },
                        statusCode: { type: 'integer', example: 404 }
                    }
                },
                // ✅ Schema de nota reutilizable
                Note: {
                    type: 'object',
                    properties: {
                        id:         { type: 'integer', example: 1 },
                        title:      { type: 'string',  example: 'Mi nota' },
                        content:    { type: 'string',  example: 'Contenido de la nota' },
                        imageUrl:   { type: 'string',  example: '/uploads/imagen.jpg' },
                        isPrivate:  { type: 'boolean', example: false },
                        categoryId: { type: 'integer', example: 1 },
                        userId:     { type: 'string',  example: 'abc123' },
                        createdAt:  { type: 'string',  example: '2026-05-03T00:00:00.000Z' },
                        updatedAt:  { type: 'string',  example: '2026-05-03T00:00:00.000Z' },
                    }
                },
                // ✅ Schema de categoría reutilizable
                Category: {
                    type: 'object',
                    properties: {
                        id:        { type: 'integer', example: 1 },
                        name:      { type: 'string',  example: 'Ideas' },
                        userId:    { type: 'string',  example: 'abc123' },
                        createdAt: { type: 'string',  example: '2026-05-03T00:00:00.000Z' },
                        updatedAt: { type: 'string',  example: '2026-05-03T00:00:00.000Z' },
                    }
                },
                // ✅ Schema de usuario reutilizable
                User: {
                    type: 'object',
                    properties: {
                        name:     { type: 'string', example: 'Daniel Rodriguez' },
                        email:    { type: 'string', example: 'daniel@gmail.com' },
                        password: { type: 'string', example: '12345678' },
                        role:     { type: 'string', enum: ['admin', 'user'], example: 'admin' },
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
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customSiteTitle: '📝 Notas API Docs',
        swaggerOptions: {
            persistAuthorization: true,  // ← mantiene el token al recargar
            displayRequestDuration: true // ← muestra el tiempo de respuesta
        }
    }));
    console.log('📄 Documentación Swagger disponible en http://localhost:3000/api-docs');
};