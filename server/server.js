import express from 'express'; // Importowanie frameworka Express
import cors from 'cors'; // Importowanie middleware dla obsługi CORS
import morgan from 'morgan'; // Importowanie middleware dla logowania HTTP
import { createServer } from 'http';
import { Server } from 'socket.io';
import connect from './database/conn.js'; // Importowanie funkcji do połączenia z bazą danych
import router from './router/route.js'; // Importowanie tras (routes) aplikacji




const app = express(); // Tworzenie instancji aplikacji Express
const port = 8080; // Ustawienie portu, na którym serwer będzie nasłuchiwał
const httpServer = createServer(app); //Stworzenie serwera HTTP na podstawie aplikacji Express

//Stworzenie instancji Socket.IO i połączenie z serwerem HTTP
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});


/** Middlewares */
app.use(cors({ origin: 'http://localhost:3000' })); 
// Konfiguracja CORS, umożliwia dostęp do serwera tylko z adresu http://localhost:3000 (zwykle frontend lokalnie)

app.use(morgan('tiny')); 
// Użycie morgan do logowania zapytań HTTP, z ustawieniem 'tiny', które loguje minimalną ilość informacji (np. metoda, status, czas odpowiedzi)

app.use(express.json({ limit: '120mb' })); 
// Middleware do obsługi JSON w ciele zapytań, ustawienie limitu na 120 MB dla dużych danych

app.use(express.urlencoded({ limit: '120mb', extended: true })); 
// Middleware do obsługi danych formularzy (urlencoded) w zapytaniach, z limitem 120 MB

app.disable('x-powered-by'); 
// Ukrycie nagłówka 'X-Powered-By', który domyślnie informuje o używanej technologii (np. Express)

 /** HTTP GET Request */
app.get('/', (req, res) => {
    res.status(201).json("Home GET Request"); 
    // Odpowiedź na zapytanie GET na endpoint "/" - zwraca status 201 (created) i prostą wiadomość
});

/** API routes */
app.use('/api', router); 
// Przypisanie tras API (importowanych z router/route.js) do ścieżki '/api'. Wszystkie trasy będą zaczynały się od '/api'

// Przechowywanie wiadomości czatu w pamięci (tymczasowe)
let chatMessages = []; //<---------------------------------------

//Socket.IO Communication
io.on('connection', (socket) => {
    console.log('Nowe połącznie: ', socket.id);
    //wysyłanie historii czatu do nowego użytkownika
    socket.emit('chatHistory', chatMessages);
    //obsługa odbioru nowej wiadomości
    socket.on('newMessage', (message) => {
        console.log('New message received:', message);
        io.emit('newMessage', message); // Wysyłanie wiadomości do wszystkich
    });
    //obsługa rozłączenia użytkownika
    socket.on('disconnect', () => {
        console.log('Użytkownik rozłączony:', socket.id);
    });
});

/** Start server only when we have valid connection */
connect().then(() => {
    try {
        // Jeśli połączenie z bazą danych uda się, uruchomienie serwera
        httpServer.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`); 
            // Logowanie komunikatu o udanym uruchomieniu serwera
        });
    } catch (error) {
        console.log('Cannot connect to the server:', error); 
        // Obsługa błędów przy uruchamianiu serwera
    }
}).catch(error => {
    console.log("Invalid database connection:", error); 
    // Obsługa błędów przy połączeniu z bazą danych
});


app.use(
    cors({
        origin: 'http://localhost:3000', // Pozwól na żądania z front-endu
        methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Dozwolone metody HTTP
        allowedHeaders: ['Content-Type', 'Authorization'], // Dozwolone nagłówki
    }));
app.options('*', cors()); // Obsłuż wszystkie zapytania OPTIONS