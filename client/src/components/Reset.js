import React from 'react'
import toast, { Toaster } from 'react-hot-toast'; // Biblioteka do obsługi powiadomień
import { useFormik } from 'formik'; // Narzędzie do zarządzania formularzami w React
import { resetPasswordValidation } from '../helper/validate'; // Funkcja walidująca dane wejściowe formularza
import { resetPassword } from '../helper/helper'; // Funkcja wysyłająca żądanie do API, aby zresetować hasło
import { useAuthStore } from '../store/store'; // Hook do zarządzania globalnym stanem autoryzacji
import { useNavigate, Navigate } from 'react-router-dom'; // Funkcje do nawigacji i przekierowań w React Router
import useFetch from '../hooks/fetch.hook'; // Niestandardowy hook do obsługi żądań HTTP
import { RedirectIfLoggedIn } from '../components/RedirectIfLoggedIn';
import styles from '../styles/Username.module.css'; // Import modułu stylów CSS

export default function Reset() {

  // Pobranie nazwy użytkownika z globalnego stanu
  const { username } = useAuthStore(state => state.auth);

  // Hook do nawigacji między stronami
  const navigate = useNavigate();

  // Wywołanie niestandardowego hooka do stworzenia sesji resetowania hasła
  const [{ isLoading, status, serverError }] = useFetch('createResetSession');

  // Konfiguracja formularza przy użyciu Formik
  const formik = useFormik({
    initialValues: { // Domyślne wartości pól formularza
      password: '', // Pole dla nowego hasła
      confirm_pwd: '' // Pole do potwierdzenia nowego hasła
    },
    validate: resetPasswordValidation, // Funkcja walidacyjna dla pól formularza
    validateOnBlur: false, // Wyłączenie walidacji podczas opuszczenia pola
    validateOnChange: false, // Wyłączenie walidacji podczas zmiany wartości w polu
    onSubmit: async values => { // Funkcja wywoływana po przesłaniu formularza

      // Wywołanie funkcji resetującej hasło i przechowywanie jej wyniku
      let resetPromise = resetPassword({ username, password: values.password });

      // Wyświetlenie powiadomienia w zależności od stanu operacji
      toast.promise(resetPromise, {
        loading: 'Updating...', // Informacja o trwającej operacji
        success: <b>Reset Successfully...!</b>, // Powiadomienie o sukcesie
        error: <b>Could not Reset!</b> // Powiadomienie o błędzie
      });

      // Po sukcesie przejście do strony z hasłem
      resetPromise.then(function () { navigate('/password') });

    }
  });

  // Wyświetlenie komunikatu w trakcie ładowania
  if (isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;

  // Wyświetlenie błędu serwera (jeśli wystąpił)
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>;

  // Jeśli sesja nie została utworzona prawidłowo, przekierowanie do strony z hasłem
  if (status && status !== 201) return <Navigate to={'/password'} replace={true}></Navigate>;

  return (
    <RedirectIfLoggedIn>
    <div className="container mx-auto"> {/* Kontener główny */}

      {/* Obsługa powiadomień */}
      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'> {/* Sekcja wyśrodkowana w pionie i poziomie */}
        <div className={styles.glass} style={{ width: "50%" }}> {/* Stylizacja kontenera */}

          {/* Nagłówek sekcji */}
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Reset</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Enter new password.
            </span>
          </div>

          {/* Formularz do resetowania hasła */}
          <form className='py-20' onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              {/* Pole do wpisania nowego hasła */}
              <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder='New Password' />
              {/* Pole do powtórzenia nowego hasła */}
              <input {...formik.getFieldProps('confirm_pwd')} className={styles.textbox} type="text" placeholder='Repeat Password' />
              {/* Przycisk do przesyłania formularza */}
              <button className={styles.btn} type='submit'>Reset</button>
            </div>
          </form>

        </div>
      </div>
    </div>
    </RedirectIfLoggedIn>
  )
}
