import mongoose from 'mongoose'; // Importowanie mongoose do obsługi bazy danych MongoDB

// Definicja schematu użytkownika
export const UserSchema = new mongoose.Schema({
    // Pole przechowujące wybrane jajko (domyślnie puste)
    selectedEgg: { type: String, default: '' }, // Dodanie wartości domyślnej dla sytuacji, gdy użytkownik nie wybierze jajka

    // Pole do przechowywania nazwy użytkownika (unikalna wartość, wymagana)
    username: {
        type: String,
        required: [true, "Please provide unique Username"], // Wymagane: unikalna nazwa użytkownika
        unique: [true, "Username Exist"] // Unikalność nazwy użytkownika
    },

    // Pole do przechowywania hasła użytkownika (wymagane)
    password: {
        type: String,
        required: [true, "Please provide a password"], // Wymagane: hasło
        unique: false, // Hasło nie musi być unikalne w bazie
    },

    // Pole do przechowywania adresu e-mail użytkownika (wymagane i unikalne)
    email: {
        type: String,
        required: [true, "Please provide a unique email"], // Wymagane: unikalny e-mail
        unique: true, // E-mail musi być unikalny
    }
});

// Eksportowanie modelu User, który będzie używał zdefiniowanego schematu
export default mongoose.models.Users || mongoose.model('User', UserSchema);
