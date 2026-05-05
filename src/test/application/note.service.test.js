import NoteService from '../../application/use-cases/note.service.js';
import {jest} from '@jest/globals';

const mockNoteRepository = { 
    save: jest.fn(), 
    findByUserId: jest.fn() 
};

describe('NoteService - Pruebas Unitarias', () => {
    let noteService;

    beforeEach(() => {
        jest.clearAllMocks();
        noteService = new NoteService(mockNoteRepository);
    });

    test('Crear: debería crear y guardar una nota correctamente', async () => {
        const data = { title: 'Mi nota', content: 'Info', userId: 'user_123' };
        mockNoteRepository.save.mockResolvedValue({ id: 1, ...data });

        const result = await noteService.createNote(data);

        expect(mockNoteRepository.save).toHaveBeenCalledTimes(1);
        expect(result.title).toBe('Mi nota');
    });

    test('Crear: debería fallar al crear una nota sin título', async () => {
        const data = { content: 'Sin titulo' };
        await expect(noteService.createNote(data)).rejects.toThrow("El título es obligatorio");
    });

    test('Leer: debería devolver las notas de un usuario específico', async () => {
        const mockNotes = [{ title: 'Nota 1' }, { title: 'Nota 2' }];
        mockNoteRepository.findByUserId.mockResolvedValue(mockNotes);

        const result = await noteService.getNotesByUserId('user_123');

        expect(mockNoteRepository.findByUserId).toHaveBeenCalledWith('user_123');
        expect(result.length).toBe(2);
    });
});
