import UserModel from "../model/User.model.js";
import Species from '../model/Species.js';

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
    }
          
const createMission = (creature, userLevel) =>
{

    const creatureLevel = creature.level;
    const baseExpBasedOnLevelperMinuteOfMision = 10 * userLevel + 10 * creatureLevel;
    const baseGoldbasedOnLevePerMinute = (10 * userLevel + 10 * creatureLevel)/3;
    const timeOfMissionInMinutes = getRandomNumber(3, 15);
    const expMultiplier = getRandomNumber(6,14)/10;
    const goldMultiplier = getRandomNumber(6, 14)/10;
    const finalExp = Math.floor(baseExpBasedOnLevelperMinuteOfMision * timeOfMissionInMinutes * expMultiplier );
    const finalGold = Math.floor(baseGoldbasedOnLevePerMinute * timeOfMissionInMinutes * goldMultiplier);
    return{
        timeOfMissionInMinutes,
        finalExp,
        finalGold
    } 
    
}

export async function SendAndCheckMissionInfo(req,res) {
    try{
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        let speciesPhotos = [];
        const userId = req.user.userId;
        console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
        const user = await UserModel.findById(userId);
        console.log(user);
        const creatures = user.creatures;
        console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC");
        
        if (!user) {
            return res.status(404).send({ error: 'Użytkownik nie znaleziony' });
        }
        for (const creature of user.creatures) {
            const photoNameOfSpecie = await Species.findOne({
                name: creature.species,
                photos: { $exists: true, $type: "array", $ne: [] }
            });

            if (photoNameOfSpecie) {
                speciesPhotos.push(photoNameOfSpecie.photos);
            }

            if (creature.misions.length === 0) {
                console.log("przeszlo brak misji");
                for (let i = 0; i < 3; i++) {
                    const mission = createMission(creature, user.level);
                    const newMission = {
                        goldForMission: mission.finalGold,
                        expForMission: mission.finalExp,
                        timeOfMission: mission.timeOfMissionInMinutes
                    };
                    console.log(newMission, "misjaaaaaaaaaaaaaaaaaaa");
                    creature.misions.push(newMission); // Upewnij się, że pole nazywa się "missions", a nie "misions"
                }
            }
        }
       await user.save();
       console.log(speciesPhotos,"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
       console.log(creatures,"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");

       res.status(200).send({
            speciesPhotos: speciesPhotos,
            creatures: creatures, 
       });

       
    }catch(error){
        res.status(500).send({ error: 'Błąd serwera przy pobraniu rzeczy' }); 
    }
}


export async function SendOnMission(req, res) {
    try{
        const userId = req.user.userId;
        console.log("dziala :D")
    }catch(error){
        res.status(500).send({ error: 'Błąd serwera przy wysyłaniu danych itemow' }); 
    }
    
}

