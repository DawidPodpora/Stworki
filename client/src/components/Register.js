import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import toast, { Toaster } from 'react-hot-toast'; // Biblioteka do wyświetlania powiadomień
import { useFormik } from 'formik'; // Biblioteka do zarządzania formularzami w React
import { registerValidation } from '../helper/validate'; // Funkcja walidująca dane wejściowe formularza
import convertToBase64 from '../helper/convert'; // Funkcja konwertująca obraz na format Base64
import { registerUser } from '../helper/helper'; // Funkcja wysyłająca żądanie rejestracji użytkownika do API

import styles from '../styles/Username.module.css'; // Import stylów CSS

// Import obrazów jajek
import egg1 from '../assets/egg1.png';
import egg2 from '../assets/egg2.png';
import egg3 from '../assets/egg3.png';
import egg4 from '../assets/egg4.png';
import egg5 from '../assets/egg5.png';
import egg6 from '../assets/egg6.png';

export default function Register() {
  const navigate = useNavigate(); // Hook do nawigacji pomiędzy stronami

  // Stan wybranego jajka
  const [selectedEgg, setSelectedEgg] = useState(null); // Przechowuje wybrane jajko
  const [selectedEggBase64, setSelectedEggBase64] = useState(''); // Wybrane jajko w formacie Base64

  // Obsługa wyboru jajka
  const handleEggSelect = async (egg) => {
    setSelectedEgg(egg); // Ustawienie wybranego jajka

    // Pobranie obrazu i konwersja do formatu Base64
    const response = await fetch(egg); // Pobiera obraz jako Blob
    const blob = await response.blob();
    const base64 = await convertToBase64(blob); // Konwersja Blob na Base64
    setSelectedEggBase64(base64); // Zapisanie Base64 w stanie
  };

  // Konfiguracja formularza przy użyciu Formik
  const formik = useFormik({
    initialValues: {
      selectedEgg: '', // Pole przechowujące wybrane jajko w formularzu
      email: '', // Pole na adres e-mail
      username: '', // Pole na nazwę użytkownika
      password: '', // Pole na hasło
    },
    validate: registerValidation, // Funkcja walidująca dane formularza
    validateOnBlur: false, // Wyłączenie walidacji przy opuszczeniu pola
    validateOnChange: false, // Wyłączenie walidacji przy zmianie wartości w polu
    onSubmit: async (values) => {
      // Jeśli użytkownik wybrał jajko, dodajemy je do danych przesyłanych w formularzu
      if (selectedEggBase64) {
        values.selectedEgg = selectedEggBase64;
      } else {
        values.selectedEgg = ''; // Jeśli nie wybrano jajka, pole pozostaje puste
      }
      
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
      <h4 className="text-5xl font-bold text-white mb-9">Wybierz jajko</h4>

      {/* Główna sekcja: wybór jajek i formularz */}
      <div className="flex w-full max-w-5xl justify-center items-center">
        {/* Lewa kolumna: sekcja z wyborem jajek */}
        <div className="flex flex-col items-center w-1/2">
          <div className="eggs grid grid-cols-3 gap-8">
            {/* Wyświetlanie obrazów jajek w formie siatki */}
            {[egg1, egg2, egg3, egg4, egg5, egg6].map((egg, index) => (
              <img
                key={index} // Klucz dla elementów listy
                src={egg} // Ścieżka do obrazu jajka
                alt={`Egg ${index + 1}`} // Alternatywny tekst
                className={`w-36 h-36 border-4 transition-all duration-300 ${
                  selectedEgg === egg // Jeśli jajko jest wybrane, zmienia styl
                    ? 'border-white shadow-lg' // Styl dla wybranego jajka
                    : 'border-transparent'
                } hover:scale-110 cursor-pointer`} // Efekty hover
                onClick={() => handleEggSelect(egg)} // Ustawienie wybranego jajka
              />
            ))}
          </div>
        </div>

        {/* Prawa kolumna: sekcja z formularzem */}
        <div className="flex flex-col items-center w-1/2">
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
                  placeholder="Podaj nazwę*"
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
                  Dalej
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
