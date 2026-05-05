// importante al trabajar con nuestros archivos debemos añadir al final .js requerido para ESM
import NoteEntity from "../../domain/entities/note.entity.js";

export default class NoteService {
    constructor(noteRepository, mailService) {
        this.noteRepository = noteRepository;
        this.mailService = mailService;
    }

    async createNote(data) {
        if (!data.title) {
            const error = new Error("El título es obligatorio");
            error.statusCode = 400;
            error.code = "VALIDATION_ERROR";
            throw error;
        }
        if (!data.content) {
            const error = new Error("El contenido es obligatorio");
            error.statusCode = 400;
            error.code = "VALIDATION_ERROR";
            throw error;
        }
        const note = new NoteEntity(data);
        return await this.noteRepository.save(note);
    }

    async getNotesByUserId(userId){
        return await this.noteRepository.findByUserId(userId);
    }

    async getNoteById(id) {
        const note = await this.noteRepository.findById(id);
        if (!note) {
            const error = new Error(`La nota con id ${id} no fue encontrada`);
            error.statusCode = 404;
            error.code = "NOT_FOUND";
            throw error;
        }
        return note;
    }

    async updateNote(id, data) {
        const note = await this.noteRepository.update(id, data);
        if (!note) {
            const error = new Error(`La nota con id ${id} no fue encontrada`);
            error.statusCode = 404;
            error.code = "NOT_FOUND";
            throw error;
        }
        return note;
    }

    async deleteNote(id) {
        const note = await this.noteRepository.delete(id);
        if (!note) {
            const error = new Error(`La nota con id ${id} no fue encontrada`);
            error.statusCode = 404;
            error.code = "NOT_FOUND";
            throw error;
        }
        return { message: "Note deleted successfully" };
    }

    async shareNoteByEmail(noteId, targetEmail, currentUserId) {
        const note = await this.noteRepository.findById(noteId);
        if (!note) {
            const error = new Error(`La nota con id ${noteId} no fue encontrada`);
            error.statusCode = 404;
            error.code = "NOT_FOUND";
            throw error;
        }

        // RESTRICCIÓN: Solo el dueño puede compartirla
        if (note.userId !== currentUserId) {
            const error = new Error("Unauthorized: You can only share your own notes");
            error.statusCode = 403;
            error.code = "FORBIDDEN";
            throw error;
        }

        return await this.mailService.sendNoteEmail(targetEmail, note);
    }
}