import UserModel from '../model/User.model.js' // Importowanie modelu użytkownika z bazy danych
import bcrypt from 'bcrypt'; // Importowanie biblioteki bcrypt do haszowania haseł
import jwt from 'jsonwebtoken'; // Importowanie biblioteki jsonwebtoken do generowania tokenów JWT
import ENV from '../config.js' // Importowanie pliku konfiguracyjnego z ustawieniami środowiskowymi
import otpGenerator from 'otp-generator' // Importowanie biblioteki do generowania jednorazowych haseł (OTP)
import Species from '../model/Species.js';

/** middleware do weryfikacji użytkownika */
export async function verifyUser(req, res, next){
    try {
        
        const { username } = req.method == "GET" ? req.query : req.body; // Pobieranie nazwy użytkownika w zależności od metody (GET lub POST)

        // Sprawdzenie, czy użytkownik istnieje w bazie danych
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Nie znaleziono użytkownika!"}); // Jeśli użytkownik nie istnieje, zwróć błąd 404
        next(); // Jeśli użytkownik istnieje, przejdź do następnego middleware lub funkcji

    } catch (error) {
        return res.status(404).send({ error: "Błąd autentykacji"}); // Błąd podczas weryfikacji użytkownika
    }
}


/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req, res) {
    try {
        const { username, password, email, selectedEgg } = req.body; // Pobieranie danych z ciała żądania

        // Sprawdzanie, czy użytkownik o podanej nazwie użytkownika już istnieje
        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username }, function(err, user){
                if(err) reject(new Error(err));
                if(user) reject({ error : "Proszę użyć unikalnej nazwy użytkownika"}); // Jeśli użytkownik już istnieje, zwróć błąd

                resolve(); // Jeśli użytkownik nie istnieje, kontynuuj
            });
        });

        // Sprawdzanie, czy użytkownik o podanym e-mailu już istnieje
        const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }, function(err, email){
                if(err) reject(new Error(err));
                if(email) reject({ error : "Proszę użyć unikalnego e-maila"}); // Jeśli e-mail już istnieje, zwróć błąd

                resolve(); // Jeśli e-mail nie istnieje, kontynuuj
            });
        });

        // Czekamy na sprawdzenie dostępności nazwy użytkownika i e-maila
        Promise.all([existUsername, existEmail])
            .then(() => {
                if(password){
                    bcrypt.hash(password, 10) // Haszowanie hasła użytkownika
                        .then(hashedPassword => {
                             // Tworzenie nowego użytkownika w bazie danych
                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                email,
                                selectedEgg: selectedEgg || '', // Ustawienie wartości domyślnej na pusty ciąg, jeśli selectedEgg nie jest podany
                              });

                            // Zapisanie użytkownika w bazie danych
                            user.save()
                                .then(result => res.status(201).send({ msg: "Użytkownik zarejestrowany pomyślnie" }))
                                .catch(error => res.status(500).send({error})); // Obsługa błędów podczas zapisywania użytkownika

                        }).catch(error => {
                            return res.status(500).send({
                                error : "Nie udało się zahaszować hasła"
                            });
                        });
                }
            }).catch(error => {
                return res.status(500).send({ error });
            });

    } catch (error) {
        return res.status(500).send(error); // Obsługa ogólnych błędów
    }
}


/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
    const { username, password } = req.body; // Pobieranie danych logowania z ciała żądania

    try {
        const user = await UserModel.findOne({ username }); // Sprawdzanie, czy użytkownik istnieje
        if (!user) return res.status(404).json({ error: "Nie znaleziono użytkownika" });

        const passwordCheck = await bcrypt.compare(password, user.password); // Weryfikacja hasła
        if (!passwordCheck) return res.status(400).json({ error: "Nieprawidłowe hasło" });

        // Oznacz użytkownika jako online
        user.isOnline = true;
        await user.save();

        // Tworzenie tokenu JWT
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
            },
            ENV.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.status(200).send({
            msg: "Logowanie pomyślne",
            username: user.username,
            token,
        });
        
    } catch (error) {
        return res.status(500).send({ error: error.message }); // Obsługa błędów
    }
    
}



/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req,res){
    
    const { username } = req.params; // Pobieranie nazwy użytkownika z parametrów URL

    try {
        
        if(!username) return res.status(501).send({ error: "Nieprawidłowa nazwa użytkownika"}); // Sprawdzanie, czy nazwa użytkownika jest poprawna

        UserModel.findOne({ username }, function(err, user){ // Wyszukiwanie użytkownika w bazie
            if(err) return res.status(500).send({ err });
            if(!user) return res.status(501).send({ error : "Nie znaleziono użytkownika"});

            /** Usunięcie hasła z obiektu użytkownika */
            // Mongoose zwraca zbędne dane, więc konwertujemy obiekt do JSON
            const { password, ...rest } = Object.assign({}, user.toJSON());

            return res.status(201).send(rest); // Zwracamy dane użytkownika (bez hasła)
        })

    } catch (error) {
        return res.status(404).send({ error : "Nie udało się znaleźć danych użytkownika"}); // Obsługa błędów
    }

}


/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {
    try {
        const { userId } = req.user; // Pobieranie ID użytkownika z tokenu
        const body = req.body; // Nowe dane użytkownika

        if(userId){
            // Dodanie pola selectedEgg do danych użytkownika
            const updatedData = {
                ...body,
                selectedEgg: body.selectedEgg || undefined // Jeśli selectedEgg nie jest podane, nie
            };

            // Aktualizacja danych użytkownika w bazie danych
            UserModel.updateOne({ _id: userId }, updatedData, function(err, data) {
                if(err) throw err;

                return res.status(201).send({ msg : "Dane zostały zaktualizowane...!" });
            });
        } else {
            return res.status(401).send({ error : "Użytkownik nie znaleziony...!" }); // Błąd, jeśli użytkownik nie istnieje
        }

    } catch (error) {
        return res.status(401).send({ error }); // Obsługa ogólnych błędów
    }
}


/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req,res){
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false}) // Generowanie OTP
    res.status(201).send({ code: req.app.locals.OTP }) // Zwracanie OTP
}


/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req,res){
    const { code } = req.query; // Pobieranie kodu OTP z zapytania
    if(parseInt(req.app.locals.OTP) === parseInt(code)){ // Sprawdzanie, czy kod OTP jest poprawny
        req.app.locals.OTP = null; // Resetowanie OTP
        req.app.locals.resetSession = true; // Rozpoczynanie sesji resetowania hasła
        return res.status(201).send({ msg: 'Weryfikacja zakończona pomyślnie!'})
    }
    return res.status(400).send({ error: "Nieprawidłowy OTP"}); // Błąd weryfikacji OTP
}


// Skuteczne przekierowanie użytkownika, gdy OTP jest poprawne
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req,res){
   if(req.app.locals.resetSession){ // Sprawdzanie, czy sesja resetowania jest aktywna
        return res.status(201).send({ flag : req.app.locals.resetSession})
   }
   return res.status(440).send({error : "Sesja wygasła!"}) // Błąd, jeśli sesja wygasła
}


// Zaktualizowanie hasła, gdy sesja jest ważna
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req,res){
    try {
        
        if(!req.app.locals.resetSession) return res.status(440).send({error : "Sesja wygasła!"}); // Sprawdzanie, czy sesja jest ważna

        const { username, password } = req.body; // Pobieranie nowych danych logowania (hasło)

        try {
            
            UserModel.findOne({ username}) // Wyszukiwanie użytkownika po nazwie użytkownika
                .then(user => {
                    bcrypt.hash(password, 10) // Haszowanie nowego hasła
                        .then(hashedPassword => {
                            UserModel.updateOne({ username : user.username },
                            { password: hashedPassword}, function(err, data){
                                if(err) throw err;
                                req.app.locals.resetSession = false; // Resetowanie sesji
                                return res.status(201).send({ msg : "Hasło zostało zaktualizowane...!"})
                            });
                        })
                        .catch( e => {
                            return res.status(500).send({
                                error : "Nie udało się zahaszować hasła"
                            })
                        })
                })
                .catch(error => {
                    return res.status(404).send({ error : "Nie znaleziono użytkownika"});
                })

        } catch (error) {
            return res.status(500).send({ error })
        }

    } catch (error) {
        return res.status(401).send({ error })
    }
}

export async function getUserData(req,res)
{
    try {
        const userId = req.user.userId; // Pobranie userId z middleware
        const user = await UserModel.findById(userId).select('-password'); // Znalezienie użytkownika
        if (!user) {
            return res.status(404).send({ error: 'Użytkownik nie znaleziony!' });
        }
        res.status(200).send(user); // Zwrócenie danych użytkownika
    } catch (error) {
        res.status(500).send({ error: 'Błąd serwera' });
    }
}
// losowanie potworków na podstawie elementu
const drawWithElement = async(element) =>
{
    try{
    const species = await Species.find({element: element});
    if (species.length === 0) {
        console.log(`Nie znaleziono gatunków o elemencie: ${element}`);
        return null;

    }
    console.log(species);
    const randomIndex = Math.floor(Math.random() * species.length);
    const randomSpecies = species[randomIndex];
    console.log(randomIndex);
    console.log(randomSpecies);
    console.log(randomSpecies.name,"bbbbbbb");
    return randomSpecies.name;
    }catch(error){
        console.error('Błąd podczas losowania gatunku:', error);
        throw error;
    }
}

export async function OrbDraw(req,res) {
    try{
        const {orb} = req.body;
        if(!orb)
        {
            return res.status(400).json({ error: 'Nie podano orb' });
        }
        console.log(orb);
        console.log("aaaaaa");
        const userId = req.user.userId;
        const user = await UserModel.findById(userId);
        console.log("bbbbbb");
        if(!user)
        {
            return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
        }
        console.log("ccccccc");
        if(user.isFirstLog)
        {
            user.isFirstLog = false;  
        }
        else{
            if(user.creature.lenght > 0)
            {
                return res.status(404).json({ error: 'nie można wykonać akcji' });
            }
        }
        console.log("dddddd");
        if(user.isFirstLog)
        {
            return res.status(404).json({ error: 'nie można wykonać akcji' });
        }
        
        console.log("eeeeee");
        const newSpeciesName = await drawWithElement(orb);
        console.log(newSpeciesName, "aaaaaaaaa");
        console.log("fffffff");
        const newCreature = {
            name: newSpeciesName,
            staty:[0,0,0,0,0],
            level:1,
            species: newSpeciesName,
            energy: 100,
            exp: 0,
            items:[]
        };
        console.log(newCreature);
        console.log("hhhhhh");
        user.creatures.push(newCreature);
        console.log(user);
        await user.save();
        const createdCreature = user.creatures[user.creatures.length - 1];
        res.status(200).json({
            message: `Pole isFirstLog zmienione na false dla użytkownika ${user.username}`,
            NewCreature: createdCreature
        });
    }catch(error)
    {
        res.status(500).send({ error: 'Błąd serwera' });
    }
    
}
export async function creatureNewPhoto(req, res){
    try{
        console.log("aaaaaa");
        const {speciesName} = req.query;
        console.log(speciesName);
        const species = await Species.findOne({name: speciesName});
        console.log("bbbbbb");
        console.log(species);
        console.log(species.photos[0]);
        console.log(species.photos[0]);
        const photo = species.photos[0];
        console.log(photo);
        res.status(200).send({photoName: photo});
    }catch(error){
        res.status(500).send({ error: 'Błąd serwera przy pobieraniu zdjęcia' });
    }
    
}
export async function newNameForCreature(req, res)
{
    try{
        const userId = req.user.userId; // Pobranie userId z middleware
        const user = await UserModel.findById(userId).select('-password');
        const { newName, creatureid } = req.body; // Pobranie nowej nazwy i ID stworzenia z żądania
        if (!newName || !creatureid) {
            return res.status(400).send({ error: 'Brak wymaganych danych: newName lub creatureid' });
        }
        const creature = user.creatures.find(creature => creature._id.toString() === creatureid);
        if (!creature) {
            return res.status(404).send({ error: 'Nie znaleziono stworzenia o podanym ID' });
        }
        creature.name = newName;
        await user.save();
    }catch(error){
        res.status(500).send({ error: 'Błąd serwera przy nadawaniu nowej nazwy' }); 
    }
}


export async function fullDataForAllCreatures(req, res)
{
    try{
        console.log("pobieranie stworkow");
        const userId = req.user.userId;
        const creaturesanditems = await UserModel.findById(userId).select('creatures items exp money username exp expToNextLevel level',);
        const creatures = creaturesanditems.creatures;
        const items = creaturesanditems.items;
        const speciesData = [];
        for(let i = 0; i < creatures.length; i++){
            const creatureName = creatures[i].species;
            const species = await Species.findOne({name:creatureName});
            if(species){
                speciesData.push(species);
            }else{
                console.log(`Nie znaleziono stworzenia o nazwie: ${species}`);
            }

        }
        res.status(200).send({
            species: speciesData, 
            creatures: creatures,
            items: items,
            exp: creaturesanditems.exp,
            gold: creaturesanditems.money,
            username: creaturesanditems.username,
            expToNextLevel :creaturesanditems.expToNextLevel,
            level: creaturesanditems.level
        })
    }catch(error){
        res.status(500).send({ error: 'Błąd serwera przy pobieraniu danych o stworkach' }); 
    }
}

