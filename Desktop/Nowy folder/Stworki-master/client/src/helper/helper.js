import axios from 'axios';
import jwt_decode from 'jwt-decode';

// Ustawienie domyślnego adresu bazowego API z pliku konfiguracyjnego
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/** Funkcje do wykonywania zapytań API */

/** Funkcja do pobierania nazwy użytkownika z tokenu JWT */
export async function getUsername() {
    // Pobranie tokenu z localStorage
    const token = localStorage.getItem('token');
    // Jeśli token nie istnieje, zwróć błąd
    if (!token) return Promise.reject("Cannot find Token");
    // Dekodowanie tokenu JWT
    let decode = jwt_decode(token);
    return decode;
}

/** Funkcja uwierzytelniająca użytkownika */
export async function authenticate(username) {
    try {
        // Wysyłanie zapytania POST do API, aby uwierzytelnić użytkownika
        return await axios.post('/api/authenticate', { username });
    } catch (error) {
        // Zwracanie komunikatu o błędzie, jeśli użytkownik nie istnieje
        return { error: "Username doesn't exist...!" };
    }
}

/** Funkcja pobierająca dane użytkownika na podstawie nazwy użytkownika */
export async function getUser({ username }) {
    try {
        // Wysyłanie zapytania GET, aby pobrać dane użytkownika
        const { data } = await axios.get(`/api/user/${username}`);
        return { data };
    } catch (error) {
        // Zwracanie komunikatu o błędzie, jeśli hasło nie pasuje
        return { error: "Password doesn't Match...!" };
    }
}

/** Funkcja rejestrująca nowego użytkownika */
export async function registerUser(credentials) {
    try {
        // Wysyłanie zapytania POST, aby zarejestrować użytkownika
        const { data: { msg }, status } = await axios.post(`/api/register`, credentials);

        // Wyciąganie nazwy użytkownika i adresu e-mail z danych rejestracyjnych
        let { username, email } = credentials;

        /** Jeśli rejestracja zakończyła się sukcesem, wysyłamy e-mail */
        if (status === 201) {
            // Wysyłanie e-maila potwierdzającego rejestrację
            await axios.post('/api/registerMail', {
                username: username,
                userEmail: email,
                text: msg
            });
        }

        // Zwracanie komunikatu o powodzeniu rejestracji
        return Promise.resolve(msg);
    } catch (error) {
        console.log("Axios Error:", error.response?.data || error.message);
        // Zwracanie błędu w przypadku niepowodzenia rejestracji
        return Promise.reject({ error });
    }
}

/** Funkcja weryfikująca hasło użytkownika */
export async function verifyPassword({ username, password }) {
    try {
        if (username) {
            // Wysyłanie zapytania POST, aby zweryfikować dane logowania
            const { data } = await axios.post('/api/login', { username, password });
            return Promise.resolve({ data });
        }
    } catch (error) {
        // Zwracanie komunikatu o błędzie, jeśli hasło nie pasuje
        return Promise.reject({ error: "Password doesn't Match...!" });
    }
}

/** Funkcja aktualizująca dane użytkownika */
export async function updateUser(response) {
    try {
        // Pobieranie tokenu z localStorage
        const token = await localStorage.getItem('token');
        // Wysyłanie zapytania PUT, aby zaktualizować dane użytkownika
        const data = await axios.put('/api/updateuser', response, { headers: { "Authorization": `Bearer ${token}` } });

        // Zwracanie zaktualizowanych danych użytkownika
        return Promise.resolve({ data });
    } catch (error) {
        // Zwracanie komunikatu o błędzie, jeśli nie udało się zaktualizować danych
        return Promise.reject({ error: "Couldn't Update Profile...!" });
    }
}

/** Funkcja generująca kod OTP do odzyskiwania hasła */
export async function generateOTP(username) {
    try {
        // Wysyłanie zapytania GET, aby wygenerować kod OTP
        const { data: { code }, status } = await axios.get('/api/generateOTP', { params: { username } });

        // Jeśli kod OTP został wygenerowany, wysyłamy e-mail z kodem
        if (status === 201) {
            let { data: { email } } = await getUser({ username });
            let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
            // Wysyłanie e-maila z kodem OTP
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject: "Password Recovery OTP" });
        }

        // Zwracanie kodu OTP
        return Promise.resolve(code);
    } catch (error) {
        // Zwracanie błędu, jeśli wystąpił problem przy generowaniu OTP
        return Promise.reject({ error });
    }
}

/** Funkcja weryfikująca kod OTP */
export async function verifyOTP({ username, code }) {
    try {
        // Wysyłanie zapytania GET, aby zweryfikować kod OTP
        const { data, status } = await axios.get('/api/verifyOTP', { params: { username, code } });
        return { data, status };
    } catch (error) {
        // Zwracanie błędu, jeśli wystąpił problem przy weryfikacji OTP
        return Promise.reject(error);
    }
}

/** Funkcja resetująca hasło użytkownika */
export async function resetPassword({ username, password }) {
    try {
        // Wysyłanie zapytania PUT, aby zresetować hasło użytkownika
        const { data, status } = await axios.put('/api/resetPassword', { username, password });
        return Promise.resolve({ data, status });
    } catch (error) {
        // Zwracanie błędu, jeśli wystąpił problem przy resetowaniu hasła
        return Promise.reject({ error });
    }
}
