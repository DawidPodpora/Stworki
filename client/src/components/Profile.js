import React, { useState } from 'react' // Importowanie Reacta oraz hooka useState do przechowywania stanu komponentu
import avatar from '../assets/profile.png'; // Importowanie domyślnego zdjęcia profilowego
import toast, { Toaster } from 'react-hot-toast'; // Importowanie biblioteki do wyświetlania powiadomień
import { useFormik } from 'formik'; // Importowanie hooka useFormik do obsługi formularzy
import { profileValidation } from '../helper/validate'; // Importowanie funkcji walidacji formularza
import convertToBase64 from '../helper/convert'; // Importowanie funkcji konwertującej obraz na base64
import useFetch from '../hooks/fetch.hook'; // Importowanie hooka do pobierania danych z API
import { updateUser } from '../helper/helper'; // Importowanie funkcji do aktualizacji danych użytkownika
import { useNavigate } from 'react-router-dom'; // Importowanie hooka useNavigate do nawigacji między stronami

import styles from '../styles/Username.module.css'; // Importowanie stylów CSS
import extend from '../styles/Profile.module.css'; // Importowanie dodatkowych stylów CSS

// Komponent profilu użytkownika
export default function Profile() {

  const [file, setFile] = useState(); // Hook useState do przechowywania pliku (np. zdjęcia profilowego)
  const [{ isLoading, apiData, serverError }] = useFetch(); // Hook useFetch do pobierania danych z API
  const navigate = useNavigate(); // Hook useNavigate do nawigacji w aplikacji

  // Hook useFormik do obsługi formularza aktualizacji profilu
  const formik = useFormik({
    initialValues : {
      firstName : apiData?.firstName || '', // Imię użytkownika
      lastName: apiData?.lastName || '', // Nazwisko użytkownika
      email: apiData?.email || '', // E-mail użytkownika
      mobile: apiData?.mobile || '', // Numer telefonu użytkownika
      address : apiData?.address || '' // Adres użytkownika
    },
    enableReinitialize: true, // Włączenie ponownej inicjalizacji formularza przy zmianie danych
    validate : profileValidation, // Funkcja walidacji formularza
    validateOnBlur: false, // Brak walidacji przy utracie fokusu na polu
    validateOnChange: false, // Brak walidacji przy każdej zmianie wartości w polu
    onSubmit : async values => {
      values = await Object.assign(values, { profile : file || apiData?.profile || ''}); // Dodanie zdjęcia profilowego
      let updatePromise = updateUser(values); // Wywołanie funkcji do aktualizacji danych użytkownika

      // Wyświetlenie powiadomienia o wyniku operacji
      toast.promise(updatePromise, {
        loading: 'Updating...', // Powiadomienie o ładowaniu
        success : <b>Update Successfully...!</b>, // Powiadomienie o pomyślnym zaktualizowaniu
        error: <b>Could not Update!</b> // Powiadomienie o błędzie
      });
    }
  })

  // Funkcja obsługująca upload pliku (zdjęcia profilowego)
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]); // Konwertowanie pliku na base64
    setFile(base64); // Ustawienie pliku w stanie
  }

  // Funkcja do obsługi wylogowania
  function userLogout(){
    localStorage.removeItem('token'); // Usunięcie tokena z localStorage
    navigate('/'); // Przekierowanie na stronę główną
  }

  // Wyświetlanie komunikatów podczas ładowania danych lub błędów
  if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>;

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster> {/* Wyświetlanie powiadomień toast */}

      <div className='flex justify-center items-center h-screen'>
        <div className={`${styles.glass} ${extend.glass}`} style={{ width: "45%", paddingTop: '3em'}}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Profile</h4> {/* Tytuł strony */}
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                You can update the details.
            </span> {/* Podtytuł */}
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
              <div className='profile flex justify-center py-4'>
                  <label htmlFor="profile">
                    <img src={apiData?.profile || file || avatar} className={`${styles.profile_img} ${extend.profile_img}`} alt="avatar" /> {/* Wyświetlanie zdjęcia profilowego */}
                  </label>
                   <input onChange={onUpload} type="file" id='profile' name='profile' /> {/* Input do uploadu pliku */}
              </div>

              <div className="textbox flex flex-col items-center gap-6">
                <div className="name flex w-3/4 gap-10">
                  <input {...formik.getFieldProps('firstName')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='FirstName' /> {/* Pole imienia */}
                  <input {...formik.getFieldProps('lastName')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='LastName' /> {/* Pole nazwiska */}
                </div>

                <div className="name flex w-3/4 gap-10">
                  <input {...formik.getFieldProps('mobile')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Mobile No.' /> {/* Pole numeru telefonu */}
                  <input {...formik.getFieldProps('email')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Email*' /> {/* Pole e-mail */}
                </div>

                <input {...formik.getFieldProps('address')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Address' /> {/* Pole adresu */}
                <button className={styles.btn} type='submit'>Update</button> {/* Przycisk do aktualizacji */}
              </div>

              <div className="text-center py-4">
                <span className='text-gray-500'>come back later? <button onClick={userLogout} className='text-red-500' to="/">Logout</button></span> {/* Link do wylogowania */}
              </div>

          </form>

        </div>
      </div>
    </div>
  )
}
