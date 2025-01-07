import UserModel from "../model/User.model.js";
import Species from '../model/Species.js';
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
        const species = await Species.findOne({ name: creature.species });
        console.log(item, 'Znaleziony przedmiot');
        console.log(creature, 'Znalezione stworzenie');
        console.log(species,'Znaleziony gatunek');
        if(item.type != 'equipable')
        {
            console.log("nie da sie");
            return res.status(404).send({ error: 'nie można założyć' });
            
        }
        if(creature.items.length >= 3)
        {
            return res.status(404).send({ error: 'nie można założyć rzeczy za dużo przedmiotów' });
        }
        if(species.element != item.element)
        {
            return res.status(404).send({ error: 'nie można założyć rzeczy niewlaściwy element' });
        }
        if(user.level < item.levelRequired)
        {
            return res.status(404).send({ error: 'za niski poziom' });
        }
        creature.items.push(item);
        user.items = user.items.filter((item) => item._id.toString() !== itemId);
        await user.save();
        res.status(200).json({message: 'Przedmiot został pomyślnie założony na stworzenie'});
    }catch(error){
        res.status(500).send({ error: 'Błąd serwera przy wysyłaniu danych itemow' }); 
    }
    
}

export async function UnEquipItem(req, res) {
    try{
        console.log('aaaaaaaaa');
        //do dodania system losujący czy losować item czy nie 
        const userId = req.user.userId;
        const {itemId, creatureId} = req.query;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'Użytkownik nie znaleziony' });
        }
        const creature = user.creatures.find((creature) => creature._id.toString() === creatureId);
        const item = creature.items.find((item)=> item._id.toString() === itemId);
        console.log(creature);
        console.log(item);
        if(user.items.length >= 15)
        {
            return res.status(404).send({ error: 'brak miejsca w eq' });
        }
        user.items.push(item);
        creature.items = creature.items.filter((item) => item._id.toString() !== itemId);
        await user.save();
        res.status(200).json({message: 'Przedmiot został pomyślnie założony na stworzenie'
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