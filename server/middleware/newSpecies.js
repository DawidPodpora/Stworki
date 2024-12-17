import express from 'express';
import Species from '../model/Species.js';

const router = express.Router();
// Endpoint do stworzenia gatunku
export async function createNewSpecies(req, res) 
{
    try {
        

        const species = new Species({
            name: "Noctivolus",
            baseStats: [4,4,4,9,9],
            statsAfterLevel: [1,1,0,3,2],
            element: 'dark',
            photos:['dark2-1','dark2-2','dark2-3'],
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