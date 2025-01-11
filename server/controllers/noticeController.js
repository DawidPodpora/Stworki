import Notice from  '../model/Notice.js';
import UserModel from "../model/User.model.js"

/** Pobieranie wszystkich ogłoszeń */

export const getAllNotices = async (req, res) => {
    try{
        const notices = await Notice.find().sort({createdAt: -1});
        res.status(200).json(notices);
    } catch (error) {
        res.status(500).json({error: 'Błąd serwera podczas pobierania ogłoszeń'});
    }
};

/** Dodawanie nowego ogłoszenia (tylko dla admina) */

export const createNotice = async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({error: 'Tytuł i treść są wymagane'});
    }

    try{
        console.log('Odebrano dane:', {title, content});
        const newNotice = new Notice({title,content});
        console.log('Tworzenie nowego ogłoszenia: ',newNotice);
        await newNotice.save();
        console.log('ogłoszenie zapisane w bazie: ', newNotice);
        res.status(201).json(newNotice);
    } catch(error) {
        console.error('Szczegóły błędu:', error.message);
        res.status(500).json({error: 'Błąd serwera podczas dodawania ogłószenia'});
    }
};

/** Usuwanie ogłoszenia (tylko dla admina) */

export const deleteNotice = async (req, res) => {
    try{
        const notice = await Notice.findById(req.params.id);
        if(!notice) {
            return res.status(404).json({error: 'Ogłoszenie nie znalezione'});
        }
        await notice.remove();
        res.status(200).json({message: 'Ogłoszenie usunięte'});
    } catch (error) {
        res.status(500).json({error: 'Błąd serwera podczas usuwania ogłoszenia'});
    }
};
