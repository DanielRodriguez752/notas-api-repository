import request from 'supertest';
import app from '../../app.js';                                     
import mongoose from 'mongoose';
import JwtService from '../../infrastructure/security/jwt.service.js';


describe('Integración - API Completa', () => {
    
    // Si estuviéramos usando una base de datos real de pruebas, aquí nos desconectaríamos al finalizar
    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('1. Healthcheck Endpoint', () => {
        test('GET /api/v1/health debería devolver 200 OK y estado', async () => {
            const response = await request(app).get('/api/v1/health');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('status', 'OK');
        });
    });

    describe('2. Endpoints de Notas (Protegidos con JWT)', () => {
        let validToken;

        // Antes de probar las notas, necesitamos generar un token falso para pasar el authMiddleware
        beforeAll(() => {
            validToken = JwtService.generateToken({
                id: 'usuario_falso_123',
                email: 'test@test.com',
                role: 'user'
            });
        });

        test('GET /api/v1/notes debería fallar si no se envía Token (401)', async () => {
            const response = await request(app).get('/api/v1/notes');
            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('error', 'Token no proveído');
        });

        test('POST /api/v1/notes debería fallar si falta el Título (400 o 500)', async () => {
            const response = await request(app)
                .post('/api/v1/notes')
                .set('Authorization', `Bearer ${validToken}`) // Enviamos el token
                .send({ content: 'Contenido sin titulo' }); // Simulamos req.body
            
            // Esperamos un error ya que el título es requerido
            expect(response.statusCode).toBeGreaterThanOrEqual(400); 
        });

        test('GET /api/v1/notes debería ser exitoso si se envía Token válido (200)', async () => {
            const response = await request(app)
                .get('/api/v1/notes')
                .set('Authorization', `Bearer ${validToken}`); // Enviamos el token en la cabecera
            
            expect(response.statusCode).toBe(200);
            // Al principio devolverá un array vacío si no hemos conectado a una BD real con datos
            expect(Array.isArray(response.body)).toBeTruthy(); 
        });
    });
});