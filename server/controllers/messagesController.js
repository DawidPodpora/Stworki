import Messages from "../model/Messages.js";
import User from "../model/User.model.js";

//Pobierz wiadomości zalogowanego użytkownika
export const getuserMessages = async (req, res) => {
    const userId = req.user._id;
    try{
        const messages = await Messages.find({receiverId: userId}).sort({createdAt: -1});
        res.status(200).json(messages);
    } catch (error){
        res.status(500).json({error: 'Nie udało się pobrać wiadomości.'});
    }
};

//Wysyłanie nowej wiadomości
export const sendMessage = async (req,res) => {
    const {receiverUsername, title, content } = req.body;
    const senderId = req.user._id;

    try{
        const receiver = await User.findOne({username: receiverUsername});
        if(!receiver){
            return res.status(404).json({error: 'Odbiorca nie istnieje.' })
        }
        const newMessage = new Messages({
            senderId,
            receiverId: receiver._id,
            title,
            content,
        });
        await newMessage.save();
        res.status(201).json({message: 'Wiadomość wysłana.'});
    } catch(error){
        res.status(500).json({error:'Nie udało się wysłać wiadomosci.'});
    }
};

//Usuwanie wiadomości
export const deleteMessage = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

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
    const userId = req.user._id;

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