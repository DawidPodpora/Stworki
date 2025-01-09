export default {
    // Sekret używany do podpisywania i weryfikacji tokenów JWT.
    // Powinien być przechowywany w zmiennych środowiskowych, aby zapewnić bezpieczeństwo.
    JWT_SECRET : "secretidf", 

    // Adres e-mail do wysyłania wiadomości e-mail (np. w przypadku rejestracji, powiadomień).
    EMAIL: "an.primachyk@gmail.com", // Testing email address & password. Replace with actual production email.

    // Hasło do konta e-mail wykorzystywane do autoryzacji SMTP w przypadku wysyłania wiadomości e-mail.
    // Powinno być przechowywane w zmiennych środowiskowych dla większego bezpieczeństwa.
    PASSWORD :"ropxdstqvqxwbbgy", // Password for email account. Replace with actual password in production environment.

    // URI połączenia z bazą danych MongoDB Atlas.
    // Zawiera dane logowania użytkownika i nazwę bazy danych.
    ATLAS_URI: "mongodb+srv://pgropowy:Pomidory123@cluster0.oibim.mongodb.net/Stworki?retryWrites=true&w=majority&appName=Cluster0" // MongoDB connection URI. Should be stored securely in production.
}
