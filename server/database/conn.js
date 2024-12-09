import mongoose from "mongoose"; // Importowanie biblioteki mongoose do pracy z bazą danych MongoDB

import { MongoMemoryServer } from "mongodb-memory-server"; // Importowanie MongoMemoryServer do tworzenia tymczasowej bazy danych w pamięci
import ENV from '../config.js' // Importowanie zmiennych środowiskowych z pliku konfiguracyjnego


// Funkcja łącząca z bazą danych
async function connect(){

    // Tworzenie instancji serwera pamięci MongoDB
    const mongod = await MongoMemoryServer.create();
    
    // Pobranie URI serwera MongoDB w pamięci
    const getUri = mongod.getUri();

    mongoose.set('strictQuery', true); // Włączenie trybu ścisłej walidacji zapytań w mongoose
    
    // Łączenie z bazą danych MongoDB
    // Wersja z użyciem MongoDB w pamięci (zakomentowana):
    // const db = await mongoose.connect(getUri);
    
    // Łączenie z bazą danych MongoDB na zdalnym serwerze (np. Atlas) używając zmiennej środowiskowej ENV.ATLAS_URI
    const db = await mongoose.connect(ENV.ATLAS_URI);
    
    console.log("Database Connected"); // Informacja o pomyślnym połączeniu z bazą danych
    
    return db; // Zwracanie połączenia z bazą danych
}

export default connect; // Eksportowanie funkcji connect do użycia w innych częściach aplikacji
