export default class AuthController {
    constructor({ authService }) {
        this.authService = authService;
    }

    register = async (req, res, next) => {
        try {
            const result = await this.authService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                const error = new Error("Email y password son requeridos");
                error.statusCode = 400;
                error.code = "VALIDATION_ERROR";
                throw error;
            }
            const result = await this.authService.login(req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };
}