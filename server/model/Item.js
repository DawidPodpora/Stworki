import mongoose from 'mongoose';


const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true 
    },
    type: {
        type: String,
        enum: ['equipable', 'unequipable', 'toUse'], 
        required: true
    },
    power: {
        type: Number,
        required: true,
    },
    vitality: {
        type: Number,
        required: true,
    },
    strength: { 
        type: Number,
        required: true,
    },
    dexterity: {
        type: Number,
        required: true,    
    },
    inteligence: { 
        type: Number,
        required: true,
    },
    armor: {
        type: Number,
        required: true,
    },
    passive: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true,
        default: '' 
    }
});

export default ItemSchema;
