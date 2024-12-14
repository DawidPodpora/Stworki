import { usernameValidate, passwordValidate, resetPasswordValidation, registerValidation } from './helper/validate';
import toast from 'react-hot-toast';

// Mockowanie funkcji authenticate, ponieważ nie chcemy wywoływać rzeczywistego API
jest.mock('./helper/helper', () => ({
    authenticate: jest.fn()
}));

// Mockowanie funkcji toast, aby nie wyświetlały się komunikaty w konsoli podczas testów
jest.mock('react-hot-toast', () => ({
    error: jest.fn()
}));

describe('Validation Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Czyści wszystkie mocki przed każdym testem
    });

    test('should return an error if username is empty', async () => {
        const values = { username: '' };
        const errors = await usernameValidate(values);
        
        expect(errors.username).toBeDefined(); // Oczekujemy, że błąd zostanie zwrócony
        expect(toast.error).toHaveBeenCalledWith('Username Required...!');
    });
    
    test('should return error if username contains spaces', async () => {
        const values = { username: 'invalid username' };
        const errors = await usernameValidate(values);
        
        expect(errors.username).toBeDefined(); // Oczekujemy błędu, jeśli nazwa użytkownika zawiera spacje
        expect(toast.error).toHaveBeenCalledWith('Invalid Username...!');
    });
    
    test('should return error if user does not exist', async () => {
        const values = { username: 'nonexistent' };
        const errors = await usernameValidate(values);
        
        expect(errors.exist).toBeDefined();
        expect(toast.error).toHaveBeenCalledWith('User does not exist...!');
    });
    
    test('should return error if password is too short', async () => {
        const values = { password: '123' };
        const errors = await passwordValidate(values);
        
        expect(errors.password).toBeDefined();
        expect(toast.error).toHaveBeenCalledWith('Password must be more than 4 characters long');
    });
    
    test('should return error if password does not have special characters', async () => {
        const values = { password: 'password' };
        const errors = await passwordValidate(values);
        
        expect(errors.password).toBeDefined();
        expect(toast.error).toHaveBeenCalledWith('Password must have special character');
    });
    
});
