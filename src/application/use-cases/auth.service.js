import UserEntity from "../../domain/entities/user.entity.js";
import HashService from "../../infrastructure/security/hash.service.js";   
import JwtService from  "../../infrastructure/security/jwt.service.js";

export default class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async register(data) {
        const exist = await this.userRepository.findByEmail(data.email);
        if (exist) {
            const error = new Error("Email already exists");
            error.statusCode = 409;
            error.code = "CONFLICT";
            throw error;
        }
        data.password = await HashService.hash(data.password);
        const newUser = new UserEntity(data);
        await this.userRepository.save(newUser);
        return "User registered successfully";
    }

    async login({ email, password }) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            const error = new Error("Credenciales inválidas");
            error.statusCode = 401;
            error.code = "UNAUTHORIZED";
            throw error;
        }
        const isMatch = await HashService.compare(password, user.password);
        if (!isMatch) {
            const error = new Error("Credenciales inválidas");
            error.statusCode = 401;
            error.code = "UNAUTHORIZED";
            throw error;
        }
        const token = JwtService.generateToken({ id: user.id, email: user.email, role: user.role });
        return { token };
    }


}