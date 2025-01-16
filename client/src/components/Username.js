import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Toaster } from 'react-hot-toast'; // Obsługa powiadomień (toastów)
import { useFormik } from 'formik'; // Obsługa formularzy w React
import { usernameValidate } from '../helper/validate' // Funkcja walidacyjna dla nazwy użytkownika
import { useAuthStore } from '../store/store' // Hook do zarządzania stanem autoryzacji

import styles from '../styles/Username.module.css'; // Import stylów dla komponentu
import { RedirectIfLoggedIn } from '../components/RedirectIfLoggedIn';
export default function Username() {

  const navigate = useNavigate(); // Hook do nawigacji między stronami
  const setUsername = useAuthStore(state => state.setUsername); // Pobranie funkcji do ustawiania nazwy użytkownika z globalnego stanu

  // Konfiguracja formularza przy użyciu Formik
  const formik = useFormik({
    initialValues : { // Domyślne wartości pól formularza
      username : '' // Nazwa użytkownika jako pusty string
    },
    validate : usernameValidate, // Funkcja walidacyjna dla nazwy użytkownika
    validateOnBlur: false, // Wyłączenie walidacji podczas opuszczenia pola
    validateOnChange: false, // Wyłączenie walidacji podczas zmiany wartości w polu
    onSubmit : async values => { // Funkcja wywoływana po przesłaniu formularza
      setUsername(values.username); // Ustawienie nazwy użytkownika w globalnym stanie
      navigate('/password') // Przejście do strony z hasłem
    }
  })

  return (
    <RedirectIfLoggedIn>
    <div className="container mx-auto"> {/* Kontener dla całego komponentu */}

      {/* Obsługa powiadomień */}
      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'> {/* Sekcja wycentrowana w pionie i poziomie */}
        <div className="w-full max-w-md"> {/* Ustawienie maksymalnej szerokości kontenera */}

          {/* Formularz */}
          <form className='py-1' onSubmit={formik.handleSubmit}>

            <div className="textbox flex flex-col items-center gap-7"> {/* Sekcja dla pola tekstowego i przycisku */}
              {/* Pole do wpisania nazwy użytkownika */}
              <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Wpisz nazwę' />
              {/* Przycisk do przesyłania formularza */}
              <button className={`${styles.btn} bg-[#042a2b] hover:bg-[#042a2b]`} type='submit'>Dalej</button> {/* Zmieniono kolor */}
            </div>

            {/* Sekcja z linkiem do rejestracji */}
            <div className="text-center py-4">
              <span className='text-gray-500'>Nie posiadasz konta? <Link className='text-red-500' to="/register">Zarejestruj</Link></span>
            </div>

          </form>

        </div>
      </div>
    </div>
    </RedirectIfLoggedIn>
  )
}
