import express from 'express';
import Creature from '../model/Creature.js';
import Item from '../model/Item.js';

const router = express.Router();
// Endpoint do stworzenia stworka
router.post('/create', async (req, res) => {
    try {
        const item1 = {
            name: "item1",
            type: "equipable",
            power: 10,
            vitality: 10,
            strength: 10,
            dexterity: 10,
            inteligence: 10,
            armor: 10,
            passive: 'non',
            description: "no jakis przedmiot"
        };

        const item2 = {
            name: "item2",
            type: "equipable",
            power: 10,
            vitality: 10,
            strength: 10,
            dexterity: 10,
            inteligence: 10,
            armor: 10,
            passive: 'non',
            description: "no jakis przedmiot"
        };
        const item3 = {
            name: "item3",
            type: "equipable",
            power: 10,
            vitality: 10,
            strength: 10,
            dexterity: 10,
            inteligence: 10,
            armor: 10,
            passive: 'non',
            description: "no jakis przedmiot"
        };

        const creature = new Creature({
            name: "darek",
            staty: [7, 14, 15, 20, 10],
            level: 20,
            species: "Nyxalis",
            energy: 100,
            items: [item1, item2, item3]
        });

        await creature.save();
        res.status(201).json({ message: "Creature created successfully", creature });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating creature", error: error.message });
    }
});

export default router;
