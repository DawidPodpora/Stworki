import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: "en",
        interpolation: {
        escapeValue: false,
        },
        resources: {
            en: {
                translation: {
                    "noticeBoard": "Notice Board",
                    "chat": "Chat",
                    "options": "Options",
                    "logout": "Logout",
                    "optionA": "Main Page",
                    "optionB": "Option B",
                    "optionC": "Option C",
                    "optionD": "Option D",
                    "optionE": "Option E",
                    "optionF": "Option F",
                    "optionG": "Option G"
                    }
                },
                pl: {
                translation: {
                    "noticeBoard": "Tablica ogłoszeń",
                    "chat": "Czat",
                    "options": "Opcje",
                    "logout": "Wyloguj",
                    "optionA": "Strona Główna",
                    "optionB": "Opcja B",
                    "optionC": "Opcja C",
                    "optionD": "Opcja D",
                    "optionE": "Opcja E",
                    "optionF": "Opcja F",
                    "optionG": "Opcja G"
                    }
                }
                
        }
    });

export default i18n;
