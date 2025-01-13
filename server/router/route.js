import { Router } from "express"; // Importowanie Routera z Express
const router = Router();

/** import wszystkich kontrolerów */
import * as controller from '../controllers/appController.js'; // Importowanie wszystkich kontrolerów aplikacji
import { registerMail } from '../controllers/mailer.js'; // Importowanie funkcji do wysyłania e-maili
import Auth, { localVariables } from '../middleware/auth.js'; // Importowanie middleware do autoryzacji i zmiennych lokalnych
import { getCreaturesbyName } from "../controllers/creaturesFight.js";
import { createNewSpecies } from "../middleware/newSpecies.js";
import {createNewItemBaseData} from "../middleware/newItemBaseData.js"
import * as items  from "../controllers/itemCreating.js";
import * as itemsActions from "../controllers/itemsActions.js";
import * as messagesController from '../controllers/messagesController.js';
import * as missionsControler from '../controllers/missionControler.js'

/** POST Metody */
// Ścieżka do rejestracji użytkownika
router.route('/register').post(controller.register); // rejestracja użytkownika
//Wybor pierwszego orba
router.route('/OrbDraw').post(Auth, itemsActions.OrbDraw);
//wysłanie zdjęcia wylosowanego stworka
router.route('/speciesPhoto').get(Auth, controller.creatureNewPhoto);
//Pobranie nazwy dla nowego stworka

router.route('/usersCreaturesAndItemsData').get(Auth, controller.fullDataForAllCreatures);

router.route('/setNewName').post(Auth,controller.newNameForCreature);
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
router.route('/newItemBaseData').post(createNewItemBaseData);
//Przedmioty
router.route('/ItemsToShop').get(items.ItemsToShop);
router.route('/ItemToEq').post(items.ItemToEq);
router.route('/ItemShop').get(Auth, items.ItemsToShop);
router.route('/BuyItem').get(Auth, items.BuyItem);
router.route('/SellItem').get(Auth, items.SellItem);
router.route('/equipeItem').get(Auth, itemsActions.EquipItem);
router.route('/unequipeItem').get(Auth, itemsActions.UnEquipItem);
router.route('/useItem').get(Auth,itemsActions.UseUsableItem);
router.route('/useOrb').get(Auth, itemsActions.OrbUse);
//Wiadomości
router.route('/messages').get(Auth, messagesController.getuserMessages);
router.route('/message').post(Auth, messagesController.sendMessage);
router.route('/messages/:id').delete(Auth, messagesController.deleteMessage);
router.route('/messages/:id/read').put(Auth, messagesController.markMessageAsReaded);
//Misje
router.route('/missionsInfo').get(Auth, missionsControler.SendAndCheckMissionInfo);
router.route('/SendOnMission').get(Auth, missionsControler.SendOnMission);
export default router; // Eksportowanie routera do dalszego użytku w aplikacji