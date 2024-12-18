import { Router } from "express"; // Importowanie Routera z Express
const router = Router();

/** import wszystkich kontrolerów */
import * as controller from '../controllers/appController.js'; // Importowanie wszystkich kontrolerów aplikacji
import { registerMail } from '../controllers/mailer.js'; // Importowanie funkcji do wysyłania e-maili
import Auth, { localVariables } from '../middleware/auth.js'; // Importowanie middleware do autoryzacji i zmiennych lokalnych
import { getCreaturesbyName } from "../controllers/creaturesFight.js";
import { createNewSpecies } from "../middleware/newSpecies.js";
/** POST Metody */
// Ścieżka do rejestracji użytkownika
router.route('/register').post(controller.register); // rejestracja użytkownika

router.route('/firstOrb').post(Auth, controller.firstOrb);
// Ścieżka do wysyłania e-maila rejestracyjnego
router.route('/registerMail').post(registerMail); // wysyłanie e-maila

// Ścieżka do weryfikacji użytkownika przed dalszymi operacjami
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); // autoryzacja użytkownika

// Ścieżka do logowania użytkownika
router.route('/login').post(controller.verifyUser, controller.login); // logowanie do aplikacji


/** GET Metody */
// Ścieżka do pobrania danych użytkownika po nazwie użytkownika
router.route('/user/:username').get(controller.getUser); // użytkownik po nazwie użytkownika

// Ścieżka do generowania OTP (One Time Password)
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP); // generowanie losowego OTP

// Ścieżka do weryfikacji wygenerowanego OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP); // weryfikacja OTP

// Ścieżka do rozpoczęcia sesji resetowania hasła
router.route('/createResetSession').get(controller.createResetSession); // resetowanie wszystkich zmiennych


/** PUT Metody */
// Ścieżka do aktualizacji profilu użytkownika
router.route('/updateuser').put(Auth, controller.updateUser); // aktualizacja profilu użytkownika

// Ścieżka do resetowania hasła użytkownika
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // resetowanie hasła

router.route('/creaturesFight').get(getCreaturesbyName);
router.route('/userData').get(Auth, controller.getUserData);
router.route('/newSpecie').post(createNewSpecies);
export default router; // Eksportowanie routera do dalszego użytku w aplikacji