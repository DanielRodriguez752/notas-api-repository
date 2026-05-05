import AuthService from "../../application/use-cases/auth.service.js";
import hashService from "../../infrastructure/security/hash.service.js";
import jwtService from "../../infrastructure/security/jwt.service.js";
import {jest} from '@jest/globals';

/** Mock del repositorio de usuarios */
const mockUserRepository = {
    save: jest.fn(),
    findByEmail: jest.fn(),
}

describe('AuthService - Pruebas unitarias', () => {
    let authService;

    beforeEach(() => {
        jest.clearAllMocks();
        authService = new AuthService(mockUserRepository);
    });

    test('deberia registrar un nuevo usuario', async () => {
        //arrange
        mockUserRepository.findByEmail.mockResolvedValue(null);// No existe el email
        mockUserRepository.save.mockResolvedValue(true); // Simula guardado exitoso
        const userData = { email: "test@example.com", password: "password123" };

        //act
        const result = await authService.register(userData);

        //assert
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
        expect(mockUserRepository.save).toHaveBeenCalled();
        expect(result).toBe("User registered successfully");    
    });

    test('deberia lanzar error si el email ya existe', async () => {
        //arrange
        mockUserRepository.findByEmail.mockResolvedValue({ id: "1", email: "test@example.com" });

        const userData = { email: "test@example.com", password: "password123" };

        //act & assert
        await expect(authService.register(userData)).rejects.toThrow("Email already exists");
    }); 
});