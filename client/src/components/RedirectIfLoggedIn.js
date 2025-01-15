import React from 'react';
import { Navigate } from 'react-router-dom'; // Importuj Navigate
import jwt_decode from 'jwt-decode';

export const RedirectIfLoggedIn = ({ children }) => {
    const token = localStorage.getItem('token');

    if (token) {
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000;

        // Sprawdzenie, czy token wygasł
        if (decoded.exp < currentTime) {
            localStorage.removeItem('token'); // Usuń nieważny token
        } else {
            return <Navigate to="/mainpage" replace={true} />;
        }
    }
    // Użytkownik z wygasłym tokenem nie zostanie przekierowany na stronę główną.

    return children;
};
