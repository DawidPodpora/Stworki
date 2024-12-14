import express from 'express';
import Species from '../model/Species.js';

const router = express.Router();
// Endpoint do stworzenia gatunku
router.post('/create', async (req, res) => {
    try {
        

        const species = new Species({
            name: "Noctivolus",
            baseStats: [6,5,4,9,6],
            statsAfterLevel: [1,1,0,3,3],
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
});

export default router;