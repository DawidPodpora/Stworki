const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const SpeciesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
      },
      baseStats:{
        type: [Number],
        required: true
      },
      statsAfterLevel:{
        type: [Number],
        required : true
      },
      element:{
        type: String,
        required: true,
      },
      photos:{
        type: [String],
        require: true
      },
      pasive: {
        type: String,
        require: true
      }
      
});

const Species = mongoose.model('Species', SpeciesSchema);

module.exports = Species;