import mongoose from 'mongoose';


const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true 
    },
    type: {
        type: String,
        enum: ['equipable', 'unequipable', 'orb'], 
        required: true
    },
    power: {
        type: Number,
        required: true,
        default: 0
    },
    vitality: {
        type: Number,
        required: true,
        default: 0
    },
    strength: { 
        type: Number,
        required: true,
        default: 0
    },
    dexterity: {
        type: Number,
        required: true,
        default: 0    
    },
    inteligence: { 
        type: Number,
        required: true,
        default: 0
    },
    armor: {
        type: Number,
        required: true,
        default: 0
    },
    passive: {
        type: String,
        required: true,
        trim: true,
        default: ""
    },
    description: {
        type: String,
        required: false,
        trim: true,
        default: '' 
    },
    element:{
        type: String,
        enum: ['fire','water','nature','light','dark'],
        require: true,
    },
    price:
    {
        type: Number,
        require: true
    },
    levelRequired:{
        type: Number
    }
});

export default ItemSchema;
