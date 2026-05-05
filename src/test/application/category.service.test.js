import CategoryService from "../../application/use-cases/category.service.js";
import { jest } from '@jest/globals';

const mockCategoryRepository = {
    save: jest.fn(),
    findByUserId: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
};

describe('CategoryService - Pruebas Unitarias', () => {
    let categoryService;

    beforeEach(() => {
        jest.clearAllMocks();
        categoryService = new CategoryService(mockCategoryRepository);
    });

    // ✅ Happy Path
    test('Crear: debería crear y guardar una categoría correctamente', async () => {
       
        const data = { name: 'Ideas', userId: 'user_123' };
        mockCategoryRepository.save.mockResolvedValue({ id: 1, ...data });

        
        const result = await categoryService.createCategory(data);

        expect(mockCategoryRepository.save).toHaveBeenCalledTimes(1);
        expect(result.name).toBe('Ideas');
    });

    // ❌ Error Path
    test('Crear: debería fallar al crear una categoría sin nombre', async () => {
        
        const data = { name: '', userId: 'user_123' };

        await expect(categoryService.createCategory(data))
            .rejects.toThrow("El nombre de la categoría es requerido");

        expect(mockCategoryRepository.save).not.toHaveBeenCalled();
    });

    // ✅ Happy Path
    test('Leer: debería devolver las categorías de un usuario específico', async () => {

        const mockCategories = [{ name: 'Ideas' }, { name: 'Tareas' }];
        mockCategoryRepository.findByUserId.mockResolvedValue(mockCategories);

        const result = await categoryService.getCategoriesByUserId('user_123');

        expect(mockCategoryRepository.findByUserId).toHaveBeenCalledWith('user_123');
        expect(result.length).toBe(2);
    });
});