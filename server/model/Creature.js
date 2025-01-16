import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import ItemSchema from '../model/Item.js';
import MissionSchema from '../model/mission.js';


const CreatureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      staty:{
        type: [Number],
        default:[0,0,0,0,0]
      },
      level:{
        type: Number,
        default: 1
      },
      species: {
        type: String,
        require : true
      },
      energy:{
        type: Number,
        default: 100
      },
      exp:{
        type: Number,
        default: 0
      },
      items: {
        type: [ItemSchema],
        default: [],// Tablica obiektów zgodnych z ItemSchema
        validate: {
            validator: function (value) {
                return Array.isArray(value) && value.length <= 3; // Maksymalnie 3 rzeczy
            },
            message: 'Creature can have a maximum of 3 items.'
        }
      },
      expToNextLevel:{
        type: Number,
        default: 0
      },
      timeOfEndOfMission:{
        type: Date,
        default: null
      },
      misions:{
          type:[MissionSchema],
          default:[],
      }
      
});

const Creatures = mongoose.model('Creatures', CreatureSchema);
export { CreatureSchema };
export default Creatures;