export default class NoteController {
    constructor(noteService) {
        this.noteService = noteService;
    }

    createNote = async (req, res, next) => {
        try {
            const data = req.body;
            if (req.file) data.imageUrl = '/uploads/' + req.file.filename;
            data.userId = req.user.id;
            const note = await this.noteService.createNote(data);
            res.status(201).json(note);
        } catch (error) {
            next(error);
        }
    }

    getNotesByUserId = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const notes = await this.noteService.getNotesByUserId(userId);
            res.status(200).json(notes);
        } catch (error) {
            next(error);
        }
    }

    updateNote = async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const userId = req.user.id;
            if (req.file) data.imageUrl = '/uploads/' + req.file.filename;

            const existingNote = await this.noteService.getNoteById(id);
            if (String(existingNote.userId) !== String(userId)) {
                const error = new Error("No tienes permiso para editar esta nota");
                error.statusCode = 403;
                error.code = "FORBIDDEN";
                throw error;
            }

            const note = await this.noteService.updateNote(id, data);
            res.status(200).json(note);
        } catch (error) {
            next(error);
        }
    }

    deleteNote = async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;

            const existingNote = await this.noteService.getNoteById(id);
            if (String(existingNote.userId) !== String(userId) && userRole !== "admin") {
                const error = new Error("No tienes permiso para eliminar esta nota");
                error.statusCode = 403;
                error.code = "FORBIDDEN";
                throw error;
            }

            const result = await this.noteService.deleteNote(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    shareNote = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { email } = req.body;
            const currentUserId = req.user.id;

            if (!email) {
                const error = new Error("El email destino es requerido");
                error.statusCode = 400;
                error.code = "VALIDATION_ERROR";
                throw error;
            }

            const result = await this.noteService.shareNoteByEmail(id, email, currentUserId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}