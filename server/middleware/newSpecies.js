import express from 'express';
import Species from '../model/Species.js';

const router = express.Router();
// Endpoint do stworzenia gatunku
router.post('/create', async (req, res) => {
    try {
        

        const species = new Species({
            name: "Caelilux",
            baseStats: [6,5,3,7,9],
            statsAfterLevel: [2,1,0,2,2],
            element: 'water',
            photos:['photo1','photo2','photo3'],
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