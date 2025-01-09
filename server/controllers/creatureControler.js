import Creature from '../model/Creature';
import Species from '../model/Species';

const getCreatures = async (req, res) => {
  try {
      console.log('Udalo sie');
      const creatures = await Creature.find(); // Pobieramy wszystkie stworki
      console.log('Creatures found:', creatures);
  
      // Pobieramy dane o gatunkach dla każdej kreatury
      const creaturesWithSpecies = await Promise.all(
          creatures.map(async (creature) => {
              const species = await Species.findOne({ name: creature.species });
              return { creature, species }; // Zwracamy zarówno dane kreatury, jak i jej gatunku
          })
      );

      // Odpowiadamy na żądanie z pełną listą kreatur i ich gatunków
      res.status(200).json({ creaturesWithSpecies });
      console.log('Creatures with species data:', creaturesWithSpecies);
  } catch (error) {
      console.log('nie Udalo sie');
      res.status(500).json({ message: 'Błąd przy pobieraniu stworków', error: error.message });
  }
};

export default getCreatures;