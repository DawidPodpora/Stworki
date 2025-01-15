import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link i useNavigate do nawigacji między stronami
import toast, { Toaster } from 'react-hot-toast'; // Biblioteka do wyświetlania powiadomień
import { useFormik } from 'formik'; // Hook do zarządzania stanem formularza
import { passwordValidate } from '../helper/validate'; // Funkcja walidacji hasła
import useFetch from '../hooks/fetch.hook'; // Hook do pobierania danych z API
import { useAuthStore } from '../store/store'; // Pobieranie globalnego stanu aplikacji
import { verifyPassword } from '../helper/helper'; // Funkcja do weryfikacji hasła
import styles from '../styles/Username.module.css'; // Import stylów CSS
import { RedirectIfLoggedIn } from '../components/RedirectIfLoggedIn';
export default function Password() {
  const navigate = useNavigate(); // Hook do nawigacji
  const { username } = useAuthStore(state => state.auth); // Pobieranie nazwy użytkownika z globalnego stanu
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`); // Pobranie danych użytkownika z API

  // Konfiguracja formularza za pomocą useFormik
  const formik = useFormik({
    initialValues: {
      password: '', // Początkowa wartość pola hasła
    },
    validate: passwordValidate, // Funkcja walidacji dla formularza
    validateOnBlur: false, // Wyłączenie walidacji podczas opuszczania pola
    validateOnChange: false, // Wyłączenie walidacji przy każdej zmianie pola
    onSubmit: async (values) => {
      // Funkcja wykonywana po przesłaniu formularza
      let loginPromise = verifyPassword({
        username,
        password: values.password,
      }); // Weryfikacja hasła użytkownika

      // Wyświetlanie powiadomień w zależności od wyniku
      toast.promise(loginPromise, {
        loading: 'Checking...', // Powiadomienie podczas weryfikacji
        success: <b>Login Successfully...!</b>, // Powiadomienie o sukcesie
        error: <b>Password Not Match!</b>, // Powiadomienie o błędzie
      });

      // Po pomyślnym zalogowaniu zapisanie tokena i przekierowanie na stronę główną
      loginPromise.then((res) => {
        let { token } = res.data;
        localStorage.setItem('token', token); // Zapis tokena w localStorage
        navigate('/mainpage'); // Przekierowanie na stronę główną
      });
    },
  });

  // Wyświetlanie stanu ładowania
  if (isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;
  // Obsługa błędu serwera
  if (serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  return (
    <RedirectIfLoggedIn>
    <div className="container mx-auto">
      {/* Komponent Toaster do wyświetlania powiadomień */}
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      {/* Główna sekcja logowania */}
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-md">
          {/* Sekcja powitania */}
          <div className="title flex flex-col items-center absolute top-1/4 left-1/2 transform -translate-x-1/2">
            <h4 className="text-5xl font-bold text-white">
              {/* Wyświetlenie powitania z imieniem lub nazwą użytkownika */}
              Cześć {apiData?.firstName || apiData?.username}
            </h4>
          </div>

          {/* Formularz logowania */}
          <form className="py-2" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              {/* Pole tekstowe do wpisywania hasła */}
              <input
                {...formik.getFieldProps('password')} // Obsługa formularza za pomocą Formik
                className={styles.textbox}
                type="text"
                placeholder="Hasło"
              />
              {/* Przycisk do wysyłania formularza */}
              <button className={styles.btn} type="submit">
                Sign In
              </button>
            </div>

            {/* Link do odzyskiwania hasła */}
            <div className="text-center py-4">
              <span className="text-gray-500">
                Forgot Password?{' '}
                <Link className="text-red-500" to="/recovery">
                  Recover Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
    </RedirectIfLoggedIn>
  );
}
