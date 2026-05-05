import { Router } from "express";
import NoteController from "../controllers/note.controller.js";
import NoteService from "../../application/use-cases/note.service.js";
import upload from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import NoteMySQLRepository from "../../infrastructure/database/mysql/note.mysql.repository.js";
import MailService from "../../infrastructure/services/mail.service.js";

const mailService = new MailService();
const noteRepository = new NoteMySQLRepository();
const noteService = new NoteService(noteRepository, mailService);
const noteController = new NoteController(noteService);

const router = Router();

/**
 * @swagger
 * /notes/{id}/public:
 *   get:
 *     summary: Ver una nota pública sin token
 *     description: |
 *       Permite ver una nota **sin necesidad de token JWT**.
 *       ⚠️ Si la nota tiene `isPrivate: true` el acceso será denegado.
 *     tags: [Notes]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la nota
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ✅ Nota obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       403:
 *         description: ❌ La nota es privada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "FORBIDDEN"
 *               message: "Esta nota es privada y no puede ser vista públicamente"
 *               statusCode: 403
 *       404:
 *         description: ❌ Nota no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "NOT_FOUND"
 *               message: "La nota con id 1 no fue encontrada"
 *               statusCode: 404
 */
router.get("/:id/public", noteController.getPublicNote);

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Crear una nueva nota
 *     description: Crea una nota para el usuario autenticado. Se puede adjuntar una imagen.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Mi Tarea Pendiente"
 *               content:
 *                 type: string
 *                 example: "Finalizar el módulo de backend hoy."
 *               categoryId:
 *                 type: integer
 *                 description: ID de la categoría (opcional)
 *                 example: 1
 *               isPrivate:
 *                 type: boolean
 *                 description: Si es true, la nota no será visible públicamente
 *                 example: false
 *               password:
 *                 type: string
 *                 description: Contraseña para proteger la nota (opcional)
 *                 example: "1234"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen adjunta (opcional)
 *     responses:
 *       201:
 *         description: ✅ Nota creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: ❌ Título o contenido faltante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "VALIDATION_ERROR"
 *               message: "El título es obligatorio"
 *               statusCode: 400
 *       401:
 *         description: ❌ Token faltante o inválido
 */
router.post("/", authMiddleware, upload.single('image'), noteController.createNote);

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Obtener todas las notas del usuario autenticado
 *     description: Devuelve todas las notas que pertenecen al usuario del token JWT.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ✅ Lista de notas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       401:
 *         description: ❌ Token faltante o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", authMiddleware, noteController.getNotesByUserId);

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Actualizar una nota existente
 *     description: |
 *       Actualiza una nota existente.
 *       ⚠️ **Solo el dueño de la nota puede editarla.**
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la nota a actualizar
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Título actualizado"
 *               content:
 *                 type: string
 *                 example: "Contenido actualizado"
 *               categoryId:
 *                 type: integer
 *                 example: 2
 *               isPrivate:
 *                 type: boolean
 *                 example: true
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: ✅ Nota actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       403:
 *         description: ❌ No tienes permiso para editar esta nota
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "FORBIDDEN"
 *               message: "No tienes permiso para editar esta nota"
 *               statusCode: 403
 *       404:
 *         description: ❌ Nota no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", authMiddleware, upload.single('image'), noteController.updateNote);

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Eliminar una nota
 *     description: |
 *       Elimina una nota del sistema.
 *       ⚠️ **Solo el dueño de la nota o un administrador pueden eliminarla.**
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la nota a eliminar
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: ✅ Nota eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nota eliminada exitosamente"
 *       403:
 *         description: ❌ No tienes permiso para eliminar esta nota
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "FORBIDDEN"
 *               message: "No tienes permiso para eliminar esta nota"
 *               statusCode: 403
 *       404:
 *         description: ❌ Nota no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), noteController.deleteNote);

/**
 * @swagger
 * /notes/{id}/share:
 *   post:
 *     summary: Compartir una nota por email
 *     description: |
 *       Envía la nota por email a otro usuario.
 *       ⚠️ **Solo el dueño de la nota puede compartirla.**
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la nota a compartir
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del destinatario
 *                 example: "amigo@gmail.com"
 *     responses:
 *       200:
 *         description: ✅ Email enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email enviado exitosamente"
 *       403:
 *         description: ❌ Solo puedes compartir tus propias notas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "FORBIDDEN"
 *               message: "Solo puedes compartir tus propias notas"
 *               statusCode: 403
 *       404:
 *         description: ❌ Nota no encontrada
 */
router.post("/:id/share", authMiddleware, noteController.shareNote);

export default router;