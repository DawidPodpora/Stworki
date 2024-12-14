import nodemailer from 'nodemailer'; // Importowanie biblioteki nodemailer do wysyłania e-maili
import Mailgen from 'mailgen'; // Importowanie biblioteki Mailgen do generowania treści e-maila

import ENV from '../config.js'; // Importowanie pliku konfiguracyjnego z ustawieniami środowiskowymi


// Konfiguracja transportera do wysyłania e-maili (przykład z Gmail)
let nodeConfig = {
   // host: "smtp.ethereal.email", // Wybór hosta (w tym przypadku zakomentowane, używamy Gmaila)
   // port: 587, // Port SMTP
    //secure: false, // Określenie, czy połączenie ma być bezpieczne (true dla portu 465, false dla innych portów)
    service: 'gmail', // Używanie Gmaila do wysyłania e-maili
    auth: {
        user: ENV.EMAIL, // Adres e-mail z pliku konfiguracyjnego
        pass: ENV.PASSWORD, // Hasło do e-maila z pliku konfiguracyjnego
    },
    tls: {
        rejectUnauthorized: false // Zezwala na połączenie mimo samodzielnie podpisanego certyfikatu
    }
}

// Tworzenie transportera do wysyłania e-maili przy użyciu powyższej konfiguracji
let transporter = nodemailer.createTransport(nodeConfig);


// Konfiguracja generatora e-maili z Mailgen (do tworzenia HTML-owych treści)
let MailGenerator = new Mailgen({
    theme: "default", // Wybór motywu szablonu dla e-maili
    product : {
        name: "Mailgen", // Nazwa produktu, używana w stopce e-maila
        link: 'https://mailgen.js/' // Link do strony produktu
    }
})

/** Funkcja obsługująca wysyłanie e-maila po rejestracji użytkownika
 * @param: {
  "username" : "example123", // Nazwa użytkownika
  "userEmail" : "admin123",  // E-mail użytkownika
  "text" : "", // Treść wstępu w e-mailu
  "subject" : "", // Temat e-maila
}
*/
export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body; // Pobieranie danych z ciała żądania

    // Ciało e-maila (treść)
    var email = {
        body : {
            name: username, // Wstawienie nazwy użytkownika
            intro : text || 'Welcome to Daily Tuition! We\'re very excited to have you on board.', // Treść powitalna (domyślna, jeśli brak wartości 'text')
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.' // Podpis w e-mailu
        }
    }

    var emailBody = MailGenerator.generate(email); // Generowanie HTML-a e-maila przy pomocy Mailgen

    let message = {
        from : ENV.EMAIL, // Adres e-mail nadawcy (z pliku konfiguracyjnego)
        to: userEmail, // Adres e-mail odbiorcy (użytkownika)
        subject : subject || "Signup Successful", // Temat e-maila (domyślny, jeśli brak wartości 'subject')
        html : emailBody // Treść e-maila (HTML)
    }

    // Wysyłanie e-maila
    transporter.sendMail(message)
    .then(() => {
        return res.status(200).send({ msg: "You should receive an email from us."}) // Jeśli e-mail zostanie wysłany pomyślnie
    })
    .catch(error => {
        console.error("Błąd wysyłania e-maila:", error); // Logowanie błędu
        res.status(500).send({ error: "Nie udało się wysłać e-maila. Sprawdź konfigurację serwera SMTP." }); // Jeśli wystąpił błąd, zwróć komunikat
    });

}
