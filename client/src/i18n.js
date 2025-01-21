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
            "chooseLanguage": "Choose your language"
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
            "chooseLanguage": "Wybierz język"
        }
    },
    uk: {
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
            "chooseLanguage": "Оберіть мову"
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
            "chooseLanguage": "Выберите язык"
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
