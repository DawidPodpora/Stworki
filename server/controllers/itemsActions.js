import UserModel from "../model/User.model";

export async function EquipItem(req, res) {
    try{
        //do dodania system losujący czy losować item czy nie 
        const userId = req.user.userId;
        const { itemId, creatureId } = req.query;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'Użytkownik nie znaleziony' });
        }
        const item = user.items.find((item) => item._id.toString() === itemId);
        if (!item) {
            return res.status(404).send({ error: 'Przedmiot nie znaleziony' });
        }
        const creature = user.creatures.find((creature) => creature._id.toString() === creatureId);
        if (!creature) {
            return res.status(404).send({ error: 'Stworzenie nie znalezione' });
        }
        console.log(item, 'Znaleziony przedmiot');
        console.log(creature, 'Znalezione stworzenie');
        

        await user.save();
        res.status(200).json({
        });
    }catch(error){
        res.status(500).send({ error: 'Błąd serwera przy wysyłaniu danych itemow' }); 
    }
    
}

export async function UnEquipItem(req, res) {
    try{
        //do dodania system losujący czy losować item czy nie 
        const userId = req.user.userId;
        await user.save();
        res.status(200).json({
        });
    }catch(error){
        res.status(500).send({ error: 'Błąd serwera przy wysyłaniu danych itemow' }); 
    }
    
}

export async function GiveUnequipableItem(req, res) {
    try{
        //do dodania system losujący czy losować item czy nie 
        const userId = req.user.userId;
        await user.save();
        res.status(200).json({
        });
    }catch(error){
        res.status(500).send({ error: 'Błąd serwera przy wysyłaniu danych itemow' }); 
    }
    
}