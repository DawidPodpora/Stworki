import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Tłumaczenia zapisane w obiekcie zamiast w plikach JSON
const resources = {
    en: {
        translation: {
            "home": "Home",
            "myCreatures": "My Creatures",
            "shop": "Shop",
            "privateMessages": "Private messages",
            "market": "Market",
            "missions": "Missions",
            "guilds": "Guilds",
            "welcome": "Welcome",
            "loadingUser": "Loading user data...",
            "options": "Options",
            "logout": "Logout",
            "chooseLanguage": "Choose your language",
            "fetchError": "Error fetching notices: ",
            "titleAndContentRequired": "Title and content are required!",
            "addNoticeError": "Error adding notice!",
            "serverError": "Server error: ",
            "deleteNoticeError": "Error deleting notice!",
            "noticeBoard": "Notice Board",
            "addNotice": "Add Notice",
            "chat": "Chat",
            "addNewNotice": "Add New Notice",
            "title": "Title",
            "content": "Content",
            "cancel": "Cancel",
            "add": "Add",
            "typeMessage": "Type message...",
            "send": "Send"
        }
    },
    pl: {
        translation: {
            "home": "Strona główna",
            "myCreatures": "Moje stworki",
            "shop": "Sklep",
            "privateMessages": "Wiadomości prywatne",
            "market": "Market",
            "missions": "Misje",
            "guilds": "Gildie",
            "welcome": "Witaj",
            "loadingUser": "Ładowanie danych użytkownika...",
            "options": "Opcje",
            "logout": "Wyloguj",
            "chooseLanguage": "Wybierz język",
            "fetchError": "Błąd podczas pobierania ogłoszeń: ",
            "titleAndContentRequired": "Tytuł i treść są wymagane!",
            "addNoticeError": "Błąd podczas dodawania ogłoszenia!",
            "serverError": "Błąd serwera: ",
            "deleteNoticeError": "Błąd podczas usuwania ogłoszenia!",
            "noticeBoard": "Tablica ogłoszeń",
            "addNotice": "Dodaj ogłoszenie",
            "chat": "Czat",
            "addNewNotice": "Dodaj nowe ogłoszenie",
            "title": "Tytuł",
            "content": "Treść",
            "cancel": "Anuluj",
            "add": "Dodaj",
            "typeMessage": "Wpisz swoją wiadomość...",
            "send": "Wyślij"
        }
    },
    ua: {
        translation: {
            "home": "Головна",
            "myCreatures": "Мої створіння",
            "shop": "Магазин",
            "privateMessages": "Приватні повідомлення",
            "market": "Ринок",
            "missions": "Місії",
            "guilds": "Гільдії",
            "welcome": "Ласкаво просимо",
            "loadingUser": "Завантаження даних користувача...",
            "options": "Налаштування",
            "logout": "Вийти",
            "chooseLanguage": "Оберіть мову",
            "fetchError": "",
            "titleAndContentRequired": "",
            "addNoticeError": "",
            "serverError": "",
            "deleteNoticeError": "",
            "noticeBoard": "",
            "addNotice": "",
            "chat": "",
            "addNewNotice": "",
            "title": "",
            "content": "",
            "cancel": "",
            "add": "",
            "typeMessage": "",
            "send": ""
        }
    },
    ru: {
        translation: {
            "home": "Главная",
            "myCreatures": "Мои существа",
            "shop": "Магазин",
            "privateMessages": "Личные сообщения",
            "market": "Рынок",
            "missions": "Миссии",
            "guilds": "Гильдии",
            "welcome": "Добро пожаловать",
            "loadingUser": "Загрузка данных пользователя...",
            "options": "Настройки",
            "logout": "Выход",
            "chooseLanguage": "Выберите язык",
            "fetchError": "",
            "titleAndContentRequired": "",
            "addNoticeError": "",
            "serverError": "",
            "deleteNoticeError": "",
            "noticeBoard": "",
            "addNotice": "",
            "chat": "",
            "addNewNotice": "",
            "title": "",
            "content": "", 
            "cancel": "",
            "add": "",
            "typeMessage": "",
            "send": ""
        }
    }
};

i18n
    .use(initReactI18next) // Integracja z React
    .init({
    resources, // Używamy tłumaczeń zapisanych w kodzie
    lng: localStorage.getItem('language') || 'en', // Domyślny język
    fallbackLng: 'en',
    debug: true,
    interpolation: {
        escapeValue: false,
    }
    });

export default i18n;
