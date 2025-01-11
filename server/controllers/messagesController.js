import Messages from "../model/Messages.js";
import UserModel from "../model/User.model.js"

//Pobierz wiadomości zalogowanego użytkownika
export const getuserMessages = async (req, res) => {
    const userId = req.user.userId;
    console.log('Wiadomości dla użytkownika: ', userId);
    try{
        const messages = await Messages.find({receiverId: userId})
        .populate('senderId', 'username')
        .sort({createdAt: -1 });
        res.status(200).json(messages);
    } catch (error){
        res.status(500).json({error: 'Nie udało się pobrać wiadomości.'});
    }
};

//Wysyłanie nowej wiadomości
export const sendMessage = async (req,res) => {
    const {receiver, title, content } = req.body;
    const senderId = req.user.userId;
    try{
        const fullReceiver = await UserModel.findOne({username: receiver});
        if(!fullReceiver){
            return res.status(404).json({error: 'Odbiorca nie istnieje.' })
        }
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const newMessage = new Messages({
            senderId,
            receiverId: fullReceiver._id,
            title,
            content,
            expiresAt,
        });
        console.log('test');
        await newMessage.save();
        
        res.status(201).json({message: 'Wiadomość wysłana.'});
    } catch(error){
        console.log(error);
        res.status(500).json({error:'Nie udało się wysłać wiadomosci.'});
    }
};


//Usuwanie wiadomości
export const deleteMessage = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try{
        const message = await Messages.findOneAndDelete({_id: id, receiverId: userId});
        if(!message)
        {
            return res.status(404).json({error: 'Wiadomość nie została znaleziona.'});
        }
        res.status(200).json({message: 'Wiadomość usunięta.'});
    } catch(error)
    {
        res.status(500).json({error: 'Nie udało się usunąć wiadomości.'});
    }
};

//Oznaczanie wiadomości jako przeczytana
export const markMessageAsReaded = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try{
        const message = await Messages.findByIdAndUpdate(
            {_id: id, receiverId: userId},
            {isRead: true},
            {new: true}
        );
        if(!message){
            return res.status(404).json({error: 'Wiadomość nie zostałą znaleziona.'});
        }
        res.status(200).json(message);
    } catch(error)
    {
        res.status(500).json({error: 'Nie udało się oznaczyć wiadomości jako przeczytana,'});
    }
};

// Wysyłanie wiadomości do wszystkich użytkowników
export const sendMessageToAll = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Tytuł i treść są wymagane!' });
        }

        // Pobierz wszystkich użytkowników z bazy danych
        const users = await UserModel.find({}, '_id'); // Pobieramy tylko `_id`

        // Utwórz wiadomość dla każdego użytkownika
        const messages = users.map(user => ({
            senderId: req.user.userId, // Administrator wysyła wiadomość
            receiverId: user._id,
            title,
            content,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Wiadomość wygaśnie po 7 dniach
        }));

        // Zapisz wszystkie wiadomości w bazie danych
        await Messages.insertMany(messages);

        res.status(201).json({ message: 'Wiadomość została wysłana do wszystkich graczy.' });
    } catch (error) {
        console.error('Błąd serwera podczas wysyłania wiadomości do wszystkich:', error);
        res.status(500).json({ error: 'Błąd serwera podczas wysyłania wiadomości do wszystkich.' });
    }
};
