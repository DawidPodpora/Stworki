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

export async function UseUsableItem(req, res) {
    try{
        //do dodania system losujący czy losować item czy nie 
        const userId = req.user.userId;
        const {itemId, creatureId} = req.query;
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
        if(species.element !== item.element)
        {
            return res.status(404).send({error: 'Niepasujace typy '});
        }
        if(item.power === 1){
            creature.staty[0] += 1;
        }
        if(item.vitality === 1)
        {
            creature.staty[1] += 1;
        }
        if(item.strength === 1)
        {
            creature.staty[2] += 1;
        }
        if(item.dexterity === 1)
        {
            creature.staty[3] += 1;
        }
        if(item.intelligence === 1)
        {
            creature.staty[4] += 1;
        }
        user.items = user.items.filter((item) => item._id.toString() !== itemId);
        await user.save();
        res.status(200).json({
        });
    }catch(error){
        res.status(500).send({ error: 'Błąd serwera przy wysyłaniu danych itemow' }); 
    }
    
}

const drawWithElement = async(element) =>
    {
        try{
        const species = await Species.find({element: element});
        if (species.length === 0) {
            console.log(`Nie znaleziono gatunków o elemencie: ${element}`);
            return null;
    
        }
        const randomIndex = Math.floor(Math.random() * species.length);
        const randomSpecies = species[randomIndex];
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
            if(!user)
            {
                return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
            }
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
            if(user.isFirstLog)
            {
                return res.status(404).json({ error: 'nie można wykonać akcji' });
            }
            
           
            const newSpeciesName = await drawWithElement(orb);
            const newCreature = {
                name: newSpeciesName,
                staty:[0,0,0,0,0],
                level:1,
                species: newSpeciesName,
                energy: 100,
                exp: 0,
                items:[],
                expToNextLevel:100,
                timeOfEndOfMission: null
            };
            console.log(newCreature);
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

    export async function OrbUse(req,res)
    {
        
        try{
            const userId = req.user.userId;
            const {itemId} = req.query
            const user = await UserModel.findById(userId);
            
            if (!user) {
                return res.status(404).send({ error: 'Użytkownik nie znaleziony' });
            }
            const item = user.items.find((item) => item._id.toString() === itemId);
            if (!item) {
                return res.status(404).send({ error: 'Przedmiot nie znaleziony' });
            }
            if(item.type !== "orb")
            {
                return res.status(404).send({ error: 'Przedmiot to nei orb' });
            }
            if(user.creatures.lenght >= 6)
            {
                return res.status(404).send({error: 'za dużo stworkow'});
            }
            const newSpeciesName = await drawWithElement(item.element);  
            const newCreature = {
                name: newSpeciesName,
                staty:[0,0,0,0,0],
                level:1,
                species: newSpeciesName,
                energy: 100,
                exp: 0,
                items:[],
                expToNextLevel:100,
                timeOfEndOfMission: null
                    
            };
            console.log(newCreature);
            user.creatures.push(newCreature);
            user.items = user.items.filter((item) => item._id.toString() !== itemId);
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