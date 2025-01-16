import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'; // Biblioteka do obsługi powiadomień
import { useAuthStore } from '../store/store'; // Pobranie danych uwierzytelniających ze stanu aplikacji
import styles from '../styles/Username.module.css'; // Import stylów CSS
import { generateOTP, verifyOTP } from '../helper/helper'; // Funkcje do generowania i weryfikacji OTP
import { useNavigate } from 'react-router-dom'; // Hook do nawigacji między stronami
import { RedirectIfLoggedIn } from '../components/RedirectIfLoggedIn';
export default function Recovery() {
  // Pobieramy nazwę użytkownika z globalnego stanu
  const { username } = useAuthStore(state => state.auth);

  // Lokalny stan do przechowywania wprowadzonego OTP
  const [OTP, setOTP] = useState();

  // Hook do nawigacji
  const navigate = useNavigate();

  // useEffect uruchamiany przy montowaniu komponentu
  useEffect(() => {
    // Generowanie OTP i wysyłanie do użytkownika
    generateOTP(username).then((OTP) => {
      console.log(OTP); // Wyświetlenie OTP w konsoli (pomocne podczas debugowania)
      if (OTP) {
        // Powiadomienie o sukcesie
        return toast.success('OTP has been sent to your email!');
      }
      // Powiadomienie o błędzie
      return toast.error('Problem while generating OTP!');
    });
  }, [username]); // Uruchomienie tylko przy zmianie nazwy użytkownika

  // Obsługa formularza weryfikacji OTP
  async function onSubmit(e) {
    e.preventDefault(); // Zapobiega przeładowaniu strony
    try {
      // Weryfikacja OTP
      let { status } = await verifyOTP({ username, code: OTP });
      if (status === 201) {
        // Jeśli weryfikacja zakończona sukcesem
        toast.success('Verified Successfully!');
        return navigate('/reset'); // Przekierowanie na stronę resetowania hasła
      }
    } catch (error) {
      // Obsługa błędu weryfikacji
      return toast.error('Wrong OTP! Check your email again!');
    }
  }

  // Funkcja obsługująca ponowne wysłanie OTP
  function resendOTP() {
    // Generowanie nowego OTP
    let sentPromise = generateOTP(username);

    // Wyświetlenie powiadomienia o statusie wysyłania
    toast.promise(sentPromise, {
      loading: 'Sending...',
      success: <b>OTP has been sent to your email!</b>,
      error: <b>Could not send it!</b>,
    });

    // Wyświetlenie OTP w konsoli po wysłaniu (do debugowania)
    sentPromise.then((OTP) => {
      console.log(OTP);
    });
  }

  return (
    <RedirectIfLoggedIn>
    <div className="container mx-auto">
      {/* Komponent obsługujący powiadomienia */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Główna sekcja aplikacji */}
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-md">

          {/* Sekcja tytułowa */}
          <div className="title flex flex-col items-center mb-8">
            <h4 className="text-5xl font-bold text-white">Recovery</h4>
          </div>

          {/* Formularz weryfikacji OTP */}
          <form className="flex flex-col gap-6" onSubmit={onSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              {/* Pole tekstowe do wprowadzania OTP */}
              <div className="input text-center">
                <span className="py-4 text-sm text-left text-gray-500">
                  Enter 6 digit OTP sent to your email address.
                </span>
                <input
                  onChange={(e) => setOTP(e.target.value)} // Aktualizacja stanu z wprowadzaną wartością
                  className={styles.textbox}
                  type="text"
                  placeholder="OTP"
                />
              </div>

              {/* Przycisk potwierdzenia OTP */}
              <button className={styles.btn} type="submit">
                Recover
              </button>
            </div>
          </form>

          {/* Sekcja do ponownego wysyłania OTP */}
          <div className="text-center py-4">
            <span className="text-gray-500">
              Can't get OTP?{' '}
              <button onClick={resendOTP} className="text-red-500">
                Resend
              </button>
            </span>
          </div>

        </div>
      </div>
    </div>
    </RedirectIfLoggedIn>
  );
}
