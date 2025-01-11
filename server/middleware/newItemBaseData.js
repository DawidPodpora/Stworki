import express from 'express';
import ItemBaseData from '../model/ItemBaseModel.js';

const router = express.Router();
export async function createNewItemBaseData(req, res) 
{
    try {
        const itemBase = new ItemBaseData({
            type:"orb",
            photos:["waterorb","fireorb","natureorb","lightorb","darkorb"],
            names:["Water Orb","Fire Orb","Nature Orb","Light Orb","Dark Orb"],
            section:"orb"      
        });

        await itemBase.save();
        res.status(201).json({ message: "Species created successfully", itemBase });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating Species", error: error.message });
    }
}
export default router;