import mongoose from 'mongoose';


const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true 
    },
    type: {
        type: String,
        enum: ['equipable', 'usable', 'orb'], 
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
    intelligence: { 
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
        required: true
    },
    price:
    {
        type: Number,
        required: true
    },
    levelRequired:{
        type: Number,
        default: 1
    },
    photo:{
        type: String,
        required: true
    }
});

export default ItemSchema;