import mongoose from 'mongoose'; // Importowanie mongoose do obsługi bazy danych MongoDB
import ItemSchema from '../model/Item.js';
import {CreatureSchema} from './Creature.js';
// Definicja schematu użytkownika
export const UserSchema = new mongoose.Schema({

    // Pole do przechowywania nazwy użytkownika (unikalna wartość, wymagana)
    username: {
        type: String,
        required: [true, "Please provide unique Username"], // Wymagane: unikalna nazwa użytkownika
        unique: [true, "Username Exist"] // Unikalność nazwy użytkownika
    },

    // Pole do przechowywania hasła użytkownika (wymagane)
    password: {
        type: String,
        required: [true, "Please provide a password"], // Wymagane: hasło
        unique: false, // Hasło nie musi być unikalne w bazie
    },

    // Pole do przechowywania adresu e-mail użytkownika (wymagane i unikalne)
    email: {
        type: String,
        required: [true, "Please provide a unique email"], // Wymagane: unikalny e-mail
        unique: true, // E-mail musi być unikalny
    },
    money:{
        type: Number,
        default: 0,
    },
    creatures:{
        type:[CreatureSchema],
        default:[],
        validate: {
            validator: function (value) {
                return Array.isArray(value) && value.length <= 6; 
            },
        }
    },
    items:{
        type:[ItemSchema],
        default:[],
        validate: {
            validator: function (value) {
                return Array.isArray(value) && value.length <= 15; // Maksymalnie 15 rzeczy
            },
        }
    },
    isInGuild:{
        type: Boolean,
        default: false,
    },
    exp:{
        type: Number,
        default: 0
    },
    level:{
        type: Number,
        default: 1,
    },
    rankingPoints:
    {
        type: Number,
        default: 100,
    },
    isFirstLog:
    {
        type: Boolean,
        default: true,
    },
    role:
    {
        type: String,
        enum: ["user", "admin", "moderator"], 
        defalut: "user",
    },
    itemsShop:{
        type:[ItemSchema],
        default:[],
        validate: {
            validator: function (value) {
                return Array.isArray(value) && value.length <= 16; // Maksymalnie 15 rzeczy
            },
        }
    },
    itemShopReset:{
        type: Date,
        default: function () {
            const now = new Date();
            const todayMidnight = new Date(now);
            todayMidnight.setHours(0, 0, 0, 0); // Ustaw godzinę na północ
            return todayMidnight;
        }
    },
    expToNextLevel:{
        type: Number,
        default: 500
    },
    missionCreatureReset:{
        type: Date,
        default: function () {
            const now = new Date();
            const todayMidnight = new Date(now);
            todayMidnight.setHours(0, 0, 0, 0); // Ustaw godzinę na północ
            return todayMidnight;
        }
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    isOnline: { type: Boolean, default: false },
    invitations: [{
        guildId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guild' },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
    }],
    
});

// Eksportowanie modelu User, który będzie używał zdefiniowanego schematu
export default mongoose.models.Users || mongoose.model('User', UserSchema);
