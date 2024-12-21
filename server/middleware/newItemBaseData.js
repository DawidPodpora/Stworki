import express from 'express';
import ItemBaseData from '../model/ItemBaseModel.js';

const router = express.Router();
export async function createNewItemBaseData(req, res) 
{
    try {
        const itemBase = new ItemBaseData({
            type:"equipable",
            photos:["photo1","photo2","photo3"],
            names:["name1","name2","name3"],
            section:"strenght"      
        });

        await itemBase.save();
        res.status(201).json({ message: "Species created successfully", itemBase });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating Species", error: error.message });
    }
}
export default router;