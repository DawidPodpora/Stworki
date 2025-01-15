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
       
        let speciesPhotos = [];
        const userId = req.user.userId;
        
        const user = await UserModel.findById(userId);
        const creatures = user.creatures;
        
        
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
                        timeOfMission: mission.timeOfMissionInMinutes,
                        isThisMissionActive:false
                    };
                    creature.misions.push(newMission); // Upewnij się, że pole nazywa się "missions", a nie "misions"
                }
            }
        }
       await user.save();
        

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
        const {missionId, creatureId} = req.query;
        const user = await UserModel.findById(userId);
        const creature = user.creatures.find((creature) => creature._id.toString() === creatureId);
        const mission = creature.misions.find((mission) => mission._id.toString() === missionId);
        const time = mission.timeOfMission; 
        if(creature.energy < time)
        {
            return res.status(404).send({ error: 'za malo energii' });
        }
        console.log(creature);
        console.log(creature.timeOfEndOfMission,"koniec misjii");
        if(!creature.timeOfEndOfMission){
        mission.isThisMissionActive = true;
        const currentTime = new Date();
        creature.energy -= time;
        const endTime = new Date(currentTime.getTime() + time * 60 * 1000);
        console.log(endTime,"konie misji1");
        creature.timeOfEndOfMission =  endTime;
        console.log(creature.timeOfEndOfMission,"konie misji2");
        }
        await user.save();
        res.status(200).json({
            
       });
    }catch(error){
        res.status(500).send({ error: 'Błąd serwera przy wysyłaniu danych itemow' }); 
    }
    
}

export async function ClaimMission(req, res){
    try{
       console.log("dziala");
        const userId = req.user.userId;
        const {creatureId} = req.query;
        const user = await UserModel.findById(userId);
        if(!user){
            return res.status(404).send({ error: 'blad nie ma usera' });
        }
        const creature = user.creatures.find((creature) => creature._id.toString() === creatureId);
        if(!creature){
            return res.status(404).send({error: 'blad nie ma stworka'});
        }
        const mission = creature.misions.find((mission)=>mission.isThisMissionActive === true);
        if(!mission){
            return res.status(404).send({ error: 'nie ma misji' });
        }
        
        const currentTime = new Date();
        const endTime = creature.timeOfEndOfMission;
        const emptyArray = [];
        if(endTime < currentTime){
            console.log("dziala");
            user.money += mission.goldForMission;
            user.exp += mission.expForMission;
            creature.exp += mission.expForMission;
            
            while(user.exp >= user.expToNextLevel)
            {
                console.log("bbbbbbbbb");
                user.level += 1;
                user.exp -= user.expToNextLevel
                const newExpToNextLevel = Math.floor(user.expToNextLevel * 2.5);
                user.expToNextLevel = newExpToNextLevel;
            }
            while(creature.exp >= creature.expToNextLevel){
                console.log("aaaaaaaaaa");
                creature.level += 1;
                creature.exp -= creature.expToNextLevel
                const newExpToNextLevel = Math.floor(creature.expToNextLevel * 2.25);
                creature.expToNextLevel = newExpToNextLevel;
            }
            console.log("przeszlo1");
            console.log(user.level,"userlevel");
            console.log(creature.level,"creaturelevel");
            console.log(user.expToNextLevel,"user.expToNextLevel");
            console.log(user.exp,"user.exp");
            console.log(creature.expToNextLevel,"creature.expToNextLevel");
            console.log(creature.exp,"creature.exp");
            console.log(user.money,"user.money");
            
            creature.misions = emptyArray;
            console.log("przeszlo2");
            creature.timeOfEndOfMission = null;
            if (creature.misions.length === 0) {
                console.log("przeszlo brak misji");
                for (let i = 0; i < 3; i++) {
                    const mission = createMission(creature, user.level);
                    const newMission = {
                        goldForMission: mission.finalGold,
                        expForMission: mission.finalExp,
                        timeOfMission: mission.timeOfMissionInMinutes,
                        isThisMissionActive:false
                    };
                    creature.misions.push(newMission); // Upewnij się, że pole nazywa się "missions", a nie "misions"
                }
            }
            
        }else{
            return res.status(404).send({ error: 'misja sie nie skonczyla'});
        }
        
       await user.save();
        res.status(200).json({
            
        });
    }catch(error){
        res.status(500).send({ error: 'Błąd serwera przy wysyłaniu danych itemow' }); 
    }
}

