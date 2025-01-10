import jwt from 'jsonwebtoken'; // Importowanie biblioteki jwt do obsługi tokenów JWT
import ENV from '../config.js'; // Importowanie zmiennych środowiskowych z pliku konfiguracyjnego
import User from '../model/User.model.js';

/** Middleware autoryzacji */
export default async function Auth(req, res, next){
    try {
        
        // Pobranie tokenu z nagłówka autoryzacji (Bearer token)
        const token = req.headers.authorization.split(" ")[1];

        // Weryfikacja tokenu i pobranie danych użytkownika
        const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);

        // Dodanie danych użytkownika do obiektu request (req.user)
        req.user = decodedToken;

        // Przekazanie kontroli do kolejnego middleware lub trasy
        next()

    } catch (error) {
        // W przypadku błędu autoryzacji, zwrócenie odpowiedzi 401 (Unauthorized)
        res.status(401).json({ error : "Authentication Failed!"})
    }
}

/** Middleware do ustawiania lokalnych zmiennych aplikacji */
export function localVariables(req, res, next){
    // Inicjalizacja zmiennych lokalnych aplikacji (OTP i resetSession)
    req.app.locals = {
        OTP : null, // Inicjalizowanie zmiennej OTP jako null
        resetSession : false // Ustawienie flagi resetSession na false
    }

    // Przekazanie kontroli do kolejnego middleware lub trasy
    next()
}
/** Middleware do sprawdzania uprawnień administratora */

export async function verifyAdmin(req, res, next) {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({error: 'Brak tokenu autoryzacyjnego'});
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);

        console.log('Token JWT zdekodowany:', decodedToken);
        req.user = decodedToken;
        next();
        /*//Pobranie użytkownika z bazy danych na podstawie ID zdekodowanego tokenu
        const user = await User.findById(req.user.id);
        console.log('Sprawdzenie uprawnień admina: ',user);

        if(user && user.isAdmin){
            next();
        } else{
            res.status(403).json({ error: "Access Denied: Admins only!"});
        }*/
    } catch(error){
        console.error('Błąd przy weryfikacji czy admin: ',error.message);
        res.status(500).json({error: "Server Error"});
    }
    
}