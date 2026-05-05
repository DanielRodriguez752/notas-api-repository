import CategoryEntity from "../../domain/entities/category.entity.js";

export default class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async createCategory(data) {
        if (!data.name) {
            const error = new Error("El nombre de la categoría es requerido");
            error.statusCode = 400;
            error.code = "VALIDATION_ERROR";
            throw error;
        }
        const category = new CategoryEntity(data);
        return await this.categoryRepository.save(category);
    }

    async getCategoriesByUserId(userId) {
        return await this.categoryRepository.findByUserId(userId);
    }

    async getCategoryById(id) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            const error = new Error(`La categoría con id ${id} no fue encontrada`);
            error.statusCode = 404;
            error.code = "NOT_FOUND";
            throw error;
        }
        return category;
    }

    async updateCategory(id, data, userId) {
        const existing = await this.categoryRepository.findById(id);
        if (!existing) {
            const error = new Error(`La categoría con id ${id} no fue encontrada`);
            error.statusCode = 404;
            error.code = "NOT_FOUND";
            throw error;
        }
        if (String(existing.userId) !== String(userId)) {
            const error = new Error("No tienes permiso para editar esta categoría");
            error.statusCode = 403;
            error.code = "FORBIDDEN";
            throw error;
        }
        return await this.categoryRepository.update(id, data);
    }

    async deleteCategory(id, userId) {
        const existing = await this.categoryRepository.findById(id);
        if (!existing) {
            const error = new Error(`La categoría con id ${id} no fue encontrada`);
            error.statusCode = 404;
            error.code = "NOT_FOUND";
            throw error;
        }
        if (String(existing.userId) !== String(userId)) {
            const error = new Error("No tienes permiso para eliminar esta categoría");
            error.statusCode = 403;
            error.code = "FORBIDDEN";
            throw error;
        }
        return await this.categoryRepository.delete(id);
    }
}