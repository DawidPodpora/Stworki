import { Navigate } from "react-router-dom"; // Importujemy komponent Navigate do przekierowania użytkownika
import { useAuthStore } from "../store/store"; // Importujemy hook do odczytu stanu autentykacji z globalnego stanu aplikacji

/** Komponent do autoryzacji użytkownika na podstawie tokenu */
export const AuthorizeUser = ({ children }) => {
    // Pobieramy token z localStorage (czyli lokalnej pamięci przeglądarki)
    const token = localStorage.getItem('token');

    // Jeśli token nie istnieje, oznacza to, że użytkownik nie jest zalogowany
    if(!token){
        // Jeśli nie ma tokenu, przekierowujemy użytkownika na stronę główną ('/')
        return <Navigate to={'/'} replace={true}></Navigate>
    }

    // Jeśli token istnieje, wyświetlamy dzieci komponentu (czyli przekazany content)
    return children;
}

/** Komponent do ochrony dostępu na podstawie nazwy użytkownika w globalnym stanie */
export const ProtectRoute = ({ children }) => {
    // Pobieramy nazwę użytkownika z globalnego stanu aplikacji (za pomocą useAuthStore)
    const username = useAuthStore.getState().auth.username;

    // Jeśli użytkownik nie jest zalogowany (brak username), przekierowujemy go na stronę główną
    if(!username){
        return <Navigate to={'/'} replace={true}></Navigate>
    }

    // Jeśli użytkownik jest zalogowany, wyświetlamy dzieci komponentu
    return children;
}
