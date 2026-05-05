export default class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }

    createCategory = async (req, res, next) => {
        try {
            const data = req.body;
            data.userId = req.user.id;
            const category = await this.categoryService.createCategory(data);
            res.status(201).json(category);
        } catch (error) {
            next(error);
        }
    }

    getCategoriesByUserId = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const categories = await this.categoryService.getCategoriesByUserId(userId);
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    }

    updateCategory = async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const userId = req.user.id;
            const category = await this.categoryService.updateCategory(id, data, userId);
            res.status(200).json(category);
        } catch (error) {
            next(error);
        }
    }

    deleteCategory = async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            await this.categoryService.deleteCategory(id, userId);
            res.status(200).json({ message: "Categoría eliminada exitosamente" });
        } catch (error) {
            next(error);
        }
    }
}