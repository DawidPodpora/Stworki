import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import toast, { Toaster } from 'react-hot-toast'; // Biblioteka do wyświetlania powiadomień
import { useFormik } from 'formik'; // Biblioteka do zarządzania formularzami w React
import { registerValidation } from '../helper/validate'; // Funkcja walidująca dane wejściowe formularza
import { registerUser } from '../helper/helper'; // Funkcja wysyłająca żądanie rejestracji użytkownika do API

import styles from '../styles/Username.module.css'; // Import stylów CSS

export default function Register() {
  const navigate = useNavigate(); // Hook do nawigacji pomiędzy stronami

  // Konfiguracja formularza przy użyciu Formik
  const formik = useFormik({
    initialValues: {
      email: '', // Pole na adres e-mail
      username: '', // Pole na nazwę użytkownika
      password: '', // Pole na hasło
    },
    validate: registerValidation, // Funkcja walidująca dane formularza
    validateOnBlur: false, // Wyłączenie walidacji przy opuszczeniu pola
    validateOnChange: false, // Wyłączenie walidacji przy zmianie wartości w polu
    onSubmit: async (values) => {
      // Wysłanie żądania rejestracji
      let registerPromise = registerUser(values);

      // Wyświetlenie powiadomień w zależności od wyniku rejestracji
      toast.promise(registerPromise, {
        loading: 'Creating...', // Informacja o trwającej rejestracji
        success: <b>Register Successfully...!</b>, // Powiadomienie o sukcesie
        error: <b>Could not Register.</b>, // Powiadomienie o błędzie
      });

      // Po pomyślnej rejestracji przekierowanie na stronę główną
      registerPromise.then(function () {
        navigate('/');
      });
    },
  });

  return (
    <div className="container mx-auto h-screen flex flex-col justify-center items-center">
      {/* Sekcja obsługi powiadomień */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Nagłówek strony */}
      <h4 className="text-5xl font-bold text-white mb-9">Rejestracja</h4>

      {/* Formularz rejestracji */}
      <div className="w-full max-w-md">
        <form className="py-4" onSubmit={formik.handleSubmit}>
          {/* Pola tekstowe formularza */}
          <div className="textbox flex flex-col items-center gap-4">
            <input
              {...formik.getFieldProps('email')} // Obsługa formularza Formik
              className={styles.textbox}
              type="email"
              placeholder="Podaj e-mail*"
            />
            <input
              {...formik.getFieldProps('username')}
              className={styles.textbox}
              type="text"
              placeholder="Podaj nazwę użytkownika*"
            />
            <input
              {...formik.getFieldProps('password')}
              className={styles.textbox}
              type="password"
              placeholder="Podaj hasło*"
            />
          </div>

          {/* Sekcja z przyciskami */}
          <div className="flex justify-between mt-6">
            {/* Link do powrotu na stronę główną */}
            <Link
              to="/"
              className={`${styles.btn} bg-[#042a2b] hover:bg-[#042a2b]`}
            >
              Powrót
            </Link>
            {/* Przycisk przesyłający formularz */}
            <button
              type="submit"
              className={`${styles.btn} bg-[#042a2b] hover:bg-[#042a2b]`}
            >
              Zarejestruj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
