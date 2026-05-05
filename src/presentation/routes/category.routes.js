import { Router } from "express";
import CategoryController from "../controllers/category.controller.js";
import CategoryService from "../../application/use-cases/category.service.js";
import CategoryMySQLRepository from "../../infrastructure/database/mysql/category.mysql.repository.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const categoryRepository = new CategoryMySQLRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

const router = Router();

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crear una nueva categoría
 *     description: Crea una categoría para organizar las notas del usuario autenticado.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría
 *                 example: "Ideas"
 *     responses:
 *       201:
 *         description: ✅ Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: ❌ Nombre requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "VALIDATION_ERROR"
 *               message: "El nombre de la categoría es requerido"
 *               statusCode: 400
 *       401:
 *         description: ❌ Token faltante o inválido
 */
router.post("/", authMiddleware, categoryController.createCategory);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtener categorías del usuario autenticado
 *     description: Devuelve todas las categorías que pertenecen al usuario del token JWT.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ✅ Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       401:
 *         description: ❌ Token faltante o inválido
 */
router.get("/", authMiddleware, categoryController.getCategoriesByUserId);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Actualizar una categoría
 *     description: |
 *       Actualiza el nombre de una categoría existente.
 *       ⚠️ **Solo el dueño de la categoría puede editarla.**
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a actualizar
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tareas Urgentes"
 *     responses:
 *       200:
 *         description: ✅ Categoría actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       403:
 *         description: ❌ No tienes permiso para editar esta categoría
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "FORBIDDEN"
 *               message: "No tienes permiso para editar esta categoría"
 *               statusCode: 403
 *       404:
 *         description: ❌ Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", authMiddleware, categoryController.updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     description: |
 *       Elimina una categoría del sistema.
 *       ⚠️ **Solo el dueño de la categoría puede eliminarla.**
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la categoría a eliminar
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ✅ Categoría eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoría eliminada exitosamente"
 *       403:
 *         description: ❌ No tienes permiso para eliminar esta categoría
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "FORBIDDEN"
 *               message: "No tienes permiso para eliminar esta categoría"
 *               statusCode: 403
 *       404:
 *         description: ❌ Categoría no encontrada
 */
router.delete("/:id", authMiddleware, categoryController.deleteCategory);

export default router;