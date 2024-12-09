import toast from 'react-hot-toast'
import { authenticate } from './helper'

/** Funkcja walidująca nazwę użytkownika na stronie logowania */
export async function usernameValidate(values){
    // Sprawdzenie błędów dla nazwy użytkownika
    const errors = usernameVerify({}, values);

    if(values.username){
        // Sprawdzenie, czy użytkownik istnieje
        const { status } = await authenticate(values.username);
        
        if(status !== 200){
            // Jeśli użytkownik nie istnieje, wyświetlamy komunikat o błędzie
            errors.exist = toast.error('User does not exist...!')
        }
    }

    return errors;
}

/** Funkcja walidująca hasło */
export async function passwordValidate(values){
    // Sprawdzenie błędów dla hasła
    const errors = passwordVerify({}, values);

    return errors;
}

/** Funkcja walidująca dane do resetowania hasła */
export async function resetPasswordValidation(values){
    // Sprawdzenie błędów dla hasła
    const errors = passwordVerify({}, values);

    // Sprawdzenie, czy hasło i jego potwierdzenie się zgadzają
    if(values.password !== values.confirm_pwd){
        errors.exist = toast.error("Password not match...!");
    }

    return errors;
}

/** Funkcja walidująca formularz rejestracji */
export async function registerValidation(values){
    // Sprawdzenie błędów dla nazwy użytkownika
    const errors = usernameVerify({}, values);
    // Sprawdzenie błędów dla hasła
    passwordVerify(errors, values);
    // Sprawdzenie błędów dla adresu e-mail
    emailVerify(errors, values);

    return errors;
}

/** Funkcja walidująca formularz profilu użytkownika */
export async function profileValidation(values){
    // Sprawdzenie błędów dla e-maila
    const errors = emailVerify({}, values);
    return errors;
}

/** ************************************************* */

/** Funkcja walidująca hasło */
function passwordVerify(errors = {}, values){
    /* eslint-disable no-useless-escape */
    // Wyrażenie regularne do sprawdzania specjalnych znaków w haśle
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if(!values.password){
        // Jeśli hasło nie zostało podane, wyświetlamy komunikat o błędzie
        errors.password = toast.error("Password Required...!");
    } else if(values.password.includes(" ")){
        // Jeśli hasło zawiera spacje, wyświetlamy błąd
        errors.password = toast.error("Wrong Password...!");
    }else if(values.password.length < 4){
        // Jeśli hasło jest krótsze niż 4 znaki, wyświetlamy błąd
        errors.password = toast.error("Password must be more than 4 characters long");
    }else if(!specialChars.test(values.password)){
        // Jeśli hasło nie zawiera specjalnych znaków, wyświetlamy błąd
        errors.password = toast.error("Password must have special character");
    }

    return errors;
}

/** Funkcja walidująca nazwę użytkownika */
function usernameVerify(error = {}, values){
    if(!values.username){
        // Jeśli nazwa użytkownika nie została podana, wyświetlamy komunikat o błędzie
        error.username = toast.error('Username Required...!');
    }else if(values.username.includes(" ")){
        // Jeśli nazwa użytkownika zawiera spacje, wyświetlamy błąd
        error.username = toast.error('Invalid Username...!')
    }

    return error;
}

/** Funkcja walidująca e-mail */
function emailVerify(error ={}, values){
    if(!values.email){
        // Jeśli e-mail nie został podany, wyświetlamy komunikat o błędzie
        error.email = toast.error("Email Required...!");
    }else if(values.email.includes(" ")){
        // Jeśli e-mail zawiera spacje, wyświetlamy błąd
        error.email = toast.error("Wrong Email...!")
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        // Jeśli e-mail nie jest poprawny, wyświetlamy błąd
        error.email = toast.error("Invalid email address...!")
    }

    return error;
}
