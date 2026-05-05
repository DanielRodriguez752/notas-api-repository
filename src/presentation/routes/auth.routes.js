import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import AuthService from "../../application/use-cases/auth.service.js";
import UserMongoRepository from "../../infrastructure/database/mongo/user.mongo.repository.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRepository = new UserMongoRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController({ authService });

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: |
 *       Crea un nuevo usuario en el sistema.
 *       **Solo los administradores pueden registrar nuevos usuarios.**
 *       Se requiere un token JWT con rol `admin`.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             name: "Daniel Rodriguez"
 *             email: "daniel@gmail.com"
 *             password: "12345678"
 *             role: "admin"
 *     responses:
 *       201:
 *         description: ✅ Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario registrado exitosamente"
 *       400:
 *         description: ❌ Datos inválidos o faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "VALIDATION_ERROR"
 *               message: "Nombre, email y password son requeridos"
 *               statusCode: 400
 *       401:
 *         description: ❌ Token faltante o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "UNAUTHORIZED"
 *               message: "Token no proveído"
 *               statusCode: 401
 *       409:
 *         description: ❌ El email ya está en uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "CONFLICT"
 *               message: "El email ya está en uso"
 *               statusCode: 409
 */
router.post("/register", authMiddleware, authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: |
 *       Autentica al usuario y devuelve un **token JWT**.
 *       Usa este token en el botón **Authorize** 🔒 para acceder a los endpoints protegidos.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *           example:
 *             email: "danicreed6@gmail.com"
 *             password: "12345678"
 *     responses:
 *       200:
 *         description: ✅ Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: ❌ Email y password requeridos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "VALIDATION_ERROR"
 *               message: "Email y password son requeridos"
 *               statusCode: 400
 *       401:
 *         description: ❌ Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "UNAUTHORIZED"
 *               message: "Credenciales inválidas"
 *               statusCode: 401
 */
router.post("/login", authController.login);

export default router;