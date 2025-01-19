import UserModel from "../model/User.model.js";
import Species from '../model/Species.js';


const getRandomNumberFF = () => Math.floor(Math.random() * 101);

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
    }
     
const randomCreatureGrenerator= async(creature)=>
    {
        
        const speciesNames = await Species.find({},{name:1, _id:0});
        const namesArray = speciesNames.map(species => species.name);
        console.log(namesArray);
        console.log(creature,"creature");
        const randomnameIndex = getRandomNumber(0, namesArray.length-1);
        const speciesName = namesArray[randomnameIndex];
        const randomCreature = {
            name: speciesName,
            staty:[-2,-2,-2,-2,-2],
            level:creature.level,
            species: speciesName,
            items:[],
        };
        return{
            randomCreature
        }
        
    }
const createMission = (creature, userLevel) =>
{

    const creatureLevel = creature.level;
    const baseExpBasedOnLevelperMinuteOfMision = 10 * userLevel + 10 * creatureLevel;
    const baseGoldbasedOnLevePerMinute = (10 * userLevel + 10 * creatureLevel)/3;
    const timeOfMissionInMinutes = getRandomNumber(3,15);
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
        if (!user) {
            return res.status(404).send({ error: 'Użytkownik nie znaleziony' });
        }
        const creatures = user.creatures;
        if(user.missionCreatureReset < new Date())
        {
            for(let i = 0 ; i < creatures.length; i++)
            {
                creatures[i].energy = 100;
            }
            const nextDayMidnight = new Date();
            nextDayMidnight.setDate(nextDayMidnight.getDate() + 1);
            nextDayMidnight.setHours(0, 0, 0, 0);
            user.missionCreatureReset = nextDayMidnight;
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
        let fight;
        const speciesPhotos=[];
        let gold = 0;
        let exp = 0;
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
            const waitForRandomCreature = await randomCreatureGrenerator(creature);
            const randomCreature = waitForRandomCreature.randomCreature;
            fight = await fightMechanism(creature, randomCreature);
            const creaturePhotos1 = await Species.findOne({name:creature.species},{photos:1,_id:0});
            const creaturePhotos2 = await Species.findOne({name:randomCreature.species},{photos:1,_id:0});
            speciesPhotos.push(creaturePhotos1.photos);
            speciesPhotos.push(creaturePhotos2.photos);
            console.log(speciesPhotos,"Photossssssssssssssssssssssssssss");
            if(fight.whoWon === "c1")
            {
            user.money += mission.goldForMission;
            user.exp += mission.expForMission;
            creature.exp += mission.expForMission;
            gold = mission.goldForMission;
            exp = mission.expForMission;
            }
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
            fight,
            gold,
            exp,
            speciesPhotos,
        });
    }catch(error){
        res.status(500).send({ error: 'Błąd serwera przy wysyłaniu danych itemow' }); 
    }
}



// WALKA MECHANIZMY



const statConversion = async(creature) =>
    {
        try{
        console.log(creature);
        const species = await Species.findOne({name:creature.species});
        console.log("species",species);
        console.log("staty:", species.baseStats);
        console.log("staty na level", species.statsAfterLevel);
        const fightstats = [];
        let pow = 0 , vit = 0, str = 0, dex = 0, int = 0, armor = 0 ;
        let bonusPow = 0, bonusVit = 0, bonusStr = 0, bonusDex = 0, bonusInt = 0;
        const statsAfterLevelTimesLevel = species.statsAfterLevel.map(element => element * (creature.level -1));
    
        creature.staty.forEach((stat ,index) =>{
            
            if(index == 0)
            {
                console.log("stat:", stat,"afterlevel",statsAfterLevelTimesLevel,"base",species.baseStats[0]);
                pow = stat + statsAfterLevelTimesLevel[0] + species.baseStats[0];
                console.log("pow", pow);
            }
            else if(index == 1)
            {
                vit = stat + statsAfterLevelTimesLevel[1] + species.baseStats[1];
            }
            else if(index == 2)
            {
                str = stat + statsAfterLevelTimesLevel[2] + species.baseStats[2];
            }
            else if(index == 3)
                {
                    dex = stat + statsAfterLevelTimesLevel[3] + species.baseStats[3];
                }
            else{
                int = stat + statsAfterLevelTimesLevel[4] + species.baseStats[4];
                console.log(int,"int staty");
            }
        }); 
    
            creature.items.forEach((item, index) => {
                
                if(item.power >= 1 || item.power === 0){
                bonusPow += item.power;
                }else{
                    bonusPow = pow * (1 + item.power);
                }
                if(item.vitality >= 1 || item.vitality === 0){
                    bonusVit = item.vitality + bonusVit;
                    }else{
                        bonusVit = vit * (1 + item.vitality);
                    }
                if (item.strength >= 1 || item.strength === 0) {
                    bonusStr = item.strength + bonusStr;
                    } else {
                        bonusStr = str * (1 + item.strength);
                    }
                if(item.dexterity >= 1 || item.dexterity === 0) {
                    bonusDex = item.dexterity + bonusDex;
                    } else {
                        bonusDex = dex * (1 + item.dexterity);
                    }
                if(item.intelligence >= 1 || item.intelligence === 0 ) {
                    bonusInt = item.intelligence + bonusInt;
                   
                    } else {
                        console.log(item.intelligence, "item.intelligence");
                        bonusInt = int * (1 + item.intelligence);
                    }
                armor = armor + item.armor;
            });
            console.log(bonusInt,"bonusInt");
            console.log(bonusDex,"bonusDex");
            pow = pow + bonusPow;
            vit = (vit + bonusVit)* 10;
            str = str + bonusStr;
            dex = dex + bonusDex;
            int = int + bonusInt;
            fightstats.push(pow, vit, str, dex, int, armor);
    
            
        fightstats.forEach((stat ,index) =>{
            console.log(creature.name,": ",index,": ", stat);
        }); 
        return{
            fightstats
        }
    }catch(error) {
        console.error(`Błąd w statConversion: ${error.message}`);
        throw error;
    }
    };
    
    const dodgeMechanicGenerator = (creature1, creature2) => 
    {
        console.log(creature1,"creature1");
        console.log(creature1.fightstats[3],"creature1.staty[2]");
        console.log(creature2.fightstats[3],"creature2.staty[2]");
        const dodgechanceFull = Math.abs(creature1.fightstats[3] + creature2.fightstats[3]);
        console.log(dodgechanceFull,"dodgechanceFull");
        const creature1dodgeChance = Math.round(creature1.fightstats[3]/dodgechanceFull/2*100);
        console.log(creature1dodgeChance,"creature1dodgeChance");
        const creature2dodgeChance = Math.round(creature2.fightstats[3]/dodgechanceFull/2*100);
        console.log(creature2dodgeChance,"creature2dodgeChance");
        return {
            creature1dodgeChance,
            creature2dodgeChance
        };
    }
    const critMechanicGenerator = (creature1, creature2) => 
        {
            const dodgechanceFull = Math.abs(creature1.fightstats[4] + creature2.fightstats[4]);
            
            const creature1critChance = Math.round(creature1.fightstats[4]/dodgechanceFull/2*100);
            
            const creature2critChance = Math.round(creature2.fightstats[4]/dodgechanceFull/2*100);
            
            return {
                creature1critChance,
                creature2critChance
            };
        }
    const bonusArmorMechanicGenerator = (creature1, creature2)=>
    {
        const bonusArmorfull = Math.abs(creature1.fightstats[2] + creature2.fightstats[2]);
        const creature1bonusArmorMultiplier = Math.round(creature1.fightstats[2]/bonusArmorfull);
        const creature2bonusArmorMultiplier = Math.round(creature2.fightstats[2]/bonusArmorfull);
        return{
            creature1bonusArmorMultiplier,
            creature2bonusArmorMultiplier
        }
    
    
    }
    const atakTurn = (random, atac, ratio, critchance, critMultiplier) =>
    {
        let info;
        let critM;
        if(random >= critchance)
        {
            critM = 1;
            info = "Standard atack";
        }
        else
        {
            critM = critMultiplier;
            console.log("CRIT!!!!!");
            info = " Crit atack";
        }
        const maxdmg = atac + atac * ratio;
        const mindmg = atac - atac * ratio;
        const damageFromCreature = Math.round((mindmg + Math.random() * (maxdmg - mindmg))*critM);
        return {
            damageFromCreature,
            info,
        };
    }
    
    const defTurn = (armor, damageTaken, armorMultiplier ) =>
    {
        
         const fullArmor = Math.round(armor + (armor* armorMultiplier));
         
         const finalDamage = Math.round(damageTaken - (damageTaken * (fullArmor/100)));
         
         return{
            finalDamage
         };
    
    };
    
    const fightMechanism = async(creature1 , creature2) =>
    {
        let fightData = {
            creature1: {
                info: [],
                dmg: []
            },
            creature2: {
                info: [],
                dmg: []
            }
        };
        
        const creature1convertedStats = await statConversion(creature1);
        const creature2convertedStats = await statConversion(creature2);
        console.log(creature1convertedStats,"creature1convertedStats");
        console.log(creature2convertedStats,"creature2convertedStats");
        const doges = dodgeMechanicGenerator(creature1convertedStats, creature2convertedStats);
        console.log(doges,"doges");
        const crits = critMechanicGenerator(creature1convertedStats, creature2convertedStats);
        console.log(crits,"crits");
        const armorForCreatures = bonusArmorMechanicGenerator(creature1convertedStats, creature2convertedStats);
        let hpcreature1 = creature1convertedStats.fightstats[1];
        const fullhpcreature1 = creature1convertedStats.fightstats[1];
        let hpcreature2 = creature2convertedStats.fightstats[1];
        let fullhpcreature2 = creature2convertedStats.fightstats[1];
        const atac1 = creature1convertedStats.fightstats[0];
       
        const atac2 = creature2convertedStats.fightstats[0];
        const armor1 = creature1convertedStats.fightstats[5];
        const armor2 = creature2convertedStats.fightstats[5];
        
        console.log(creature1convertedStats.fightstats,"creature1");
        console.log(creature2convertedStats.fightstats,"creature2");
        const critMultiplier = 1.5;
        const ratio1 = 0.5;//do zastąpienia przez zmienną zewnętrzną
        
        const ratio2 = 0.5;//do zastąpienia przez zmienną zewnętrzną
        
       while(hpcreature1 > 0 && hpcreature2 > 0 )
        {
            let randomdodge = getRandomNumberFF();
            console.log("losowanie dla c2 dodge", randomdodge);
            if(randomdodge >= doges.creature2dodgeChance)
            {
                let randomcrit = getRandomNumberFF();
                const pureDamage = atakTurn(randomcrit,atac1, ratio1, crits.creature1critChance, critMultiplier);
                const reducedDamage = defTurn(armor2, pureDamage.damageFromCreature ,armorForCreatures.creature2bonusArmorMultiplier);
                fightData.creature1.info.push(pureDamage.info);
                fightData.creature1.dmg.push(reducedDamage.finalDamage);
                hpcreature2 -= reducedDamage.finalDamage;
                console.log("od c 1 atak za: ", reducedDamage.finalDamage, "aktualne hpc2:", hpcreature2);
            }
            else 
            {
                fightData.creature1.info.push("Dodge");
                fightData.creature1.dmg.push(0);
                console.log("c 2 wykonał unik");
            }
            if(hpcreature2 <= 0 )
            {
                break;
            }
            
            randomdodge = getRandomNumberFF();
            console.log("losowanie dla c1 dodge", randomdodge);
            if(randomdodge >= doges.creature1dodgeChance)
            {
                let randomcrit = getRandomNumberFF();
                const pureDamage = atakTurn(randomcrit,atac2, ratio2, crits.creature1critChance, critMultiplier);
                const reducedDamage = defTurn(armor1, pureDamage.damageFromCreature, armorForCreatures.creature1bonusArmorMultiplier);
                fightData.creature2.info.push(pureDamage.info);
                fightData.creature2.dmg.push(reducedDamage.finalDamage);
                hpcreature1 -= reducedDamage.finalDamage;
                console.log("od c 2 atak za: ", reducedDamage.finalDamage, "aktualne hpc1:", hpcreature1);
            }
            else
            {
                fightData.creature2.info.push("Dodge");
                fightData.creature2.dmg.push(0);
                console.log("c 1 wykonał unik");
            }
            
        }
        let whoWon
        if(hpcreature1 <= 0)
        {
            whoWon = "c2";
            console.log("wygrywa c2")
        }
        else if(hpcreature2 <= 0)
        {
            whoWon = "c1";
            console.log("wygrywa c1")
        }
        return{
            fightData,
            whoWon,
            fullhpcreature1,
            fullhpcreature2
        }
    }
    
    export const CreaturesFightArena = async (req, res) => {
        try {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
        const user1 = await UserModel.findById("678ab941be7ae87a81ba1b39");
        const user2 = await UserModel.findById("678a98c88bc707999dc627a2");
        const creature1 = user1.creatures.find((creature)=> creature._id.toString() === "678ab952be7ae87a81ba1b45");  
        console.log(creature1,"creeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeature1");
        const waitForCreature2 = await randomCreatureGrenerator(creature1);
        const creature2 = waitForCreature2.randomCreature;
        console.log(creature2);
        const fight = await fightMechanism(creature1, creature2);
        console.log(fight);
            res.status(200).json({fight}); // Odpowiadamy na żądanie z danymi stworków
        }
        //po niepowodzeniu
        catch (error) {
        console.log('nie Udalo sie');
        res.status(500).json({ message: 'Błąd przy pobieraniu stworków', error: error.message });
        }
    
    
    };