import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // Importowanie potrzebnych komponentów do obsługi routingu w React

/** importowanie wszystkich komponentów */
import Username from './components/Username'; // Komponent logowania (wprowadzenie nazwy użytkownika)
import Password from './components/Password'; // Komponent logowania (wprowadzenie hasła)
import Register from './components/Register'; // Komponent rejestracji użytkownika
import Profile from './components/Profile'; // Komponent wyświetlania profilu użytkownika
import Recovery from './components/Recovery'; // Komponent odzyskiwania hasła
import Reset from './components/Reset'; // Komponent resetowania hasła
import PageNotFound from './components/PageNotFound'; // Komponent strony 404 (nie znaleziono)
import StartPage from './components/ContentComponents/StartPage'; // Komponent strony powitalnej
import MainPage from './components/MainPage'; // Komponent głównej strony aplikacji
import RequireAuth from './components/RequireAuth'; // Komponent do wymuszania autoryzacji
/** middleware do autentykacji */
import { AuthorizeUser, ProtectRoute } from './middleware/auth' // Import middleware, które sprawdzają uprawnienia użytkownika

/** definicja głównych tras aplikacji */
const router = createBrowserRouter([
    {
        path: '/', // Strona główna (ścieżka '/')
        element: <Username></Username> // Wyświetlanie komponentu Username
    },
    {
        path: '/register', // Strona rejestracji (ścieżka '/register')
        element: <Register></Register> // Wyświetlanie komponentu Register
    },
    {
        path: '/password', // Strona logowania (ścieżka '/password')
        element: <ProtectRoute><Password /></ProtectRoute> // Ochrona trasy za pomocą ProtectRoute
    },
    {
        path: '/profile', // Strona profilu użytkownika (ścieżka '/profile')
        element: <AuthorizeUser><Profile /></AuthorizeUser> // Ochrona trasy za pomocą AuthorizeUser (sprawdzenie czy użytkownik jest zalogowany)
    },
    {
        path: '/recovery', // Strona odzyskiwania hasła (ścieżka '/recovery')
        element: <Recovery></Recovery> // Wyświetlanie komponentu Recovery
    },
    {
        path: '/reset', // Strona resetowania hasła (ścieżka '/reset')
        element: <Reset></Reset> // Wyświetlanie komponentu Reset
    },
    {
        path: '*', // Strona 404 (jeśli ścieżka nie została dopasowana)
        element: <PageNotFound></PageNotFound> // Wyświetlanie komponentu PageNotFound
    },
    {
        path:'/startpage', // Strona startowa (ścieżka '/startpage')
        element:<StartPage></StartPage> // Wyświetlanie komponentu StartPage
    },
    {
        path:'/mainpage', // Strona główna (ścieżka '/mainpage')
        element:<RequireAuth><MainPage></MainPage></RequireAuth> // Wyświetlanie komponentu MainPage
    }
])

/** Komponent główny aplikacji */
export default function App() {
  return (
    <main>
        {/* RouterProvider zapewnia routing w aplikacji */}
        <RouterProvider router={router}></RouterProvider>
    </main>
  )
}
