import express from 'express';
import Species from '../model/Species.js';

const router = express.Router();
// Endpoint do stworzenia gatunku
export async function createNewSpecies(req, res) 
{
    try {
        

        const species = new Species({
            name: "Groverin",
            baseStats: [4,8,3,5,10],
            statsAfterLevel: [1,2,0,1,3],
            element: 'nature',
            photos:['nature3-1','nature3-2','nature3-3'],
            passive: "jakas pasywa",
        });

        await species.save();
        res.status(201).json({ message: "Species created successfully", species });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating Species", error: error.message });
    }
}
export default router;