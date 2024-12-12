import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import ItemSchema from '../model/Item.js';

const CreatureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
      },
      staty:{
        type: [Number],
        required: true
      },
      level:{
        type: Number,
        required : true
      },
      species: {
        type: String,
        require : true
      },
      energy:{
        type: Number,
        require : true
      },
      items: {
        type: [ItemSchema], // Tablica obiektów zgodnych z ItemSchema
        validate: {
            validator: function (value) {
                return Array.isArray(value) && value.length <= 3; // Maksymalnie 3 rzeczy
            },
            message: 'Creature can have a maximum of 3 items.'
        }
      }
      
});

const Creatures = mongoose.model('Creatures', CreatureSchema);

export default Creatures;