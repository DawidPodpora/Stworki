import Creature from '../model/Creature.js';
import Species from '../model/Species.js';
import mongoose from 'mongoose';


const statConversion = async(creature) =>
{
    try{
    const species = await Species.findOne({name:creature.species});
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
        }
    }); 

        creature.items.forEach((item, index) => {
            
            if(item.power >= 1 ){
            bonusPow += item.power;
            }else{
                bonusPow = pow * (1 + item.power);
            }
            if(item.vitality >= 1 ){
                bonusVit = item.vitality + bonusVit;
                }else{
                    bonusVit = vit * (1 + item.vitality);
                }
            if (item.strength >= 1) {
                bonusStr = item.strength + bonusStr;
                } else {
                    bonusStr = str * (1 + item.strength);
                }
            if(item.dexterity >= 1) {
                bonusDex = item.dexterity + bonusDex;
                } else {
                    bonusDex = dex * (1 + item.dexterity);
                }
            if(item.inteligence >= 1) {
                bonusInt = item.inteligence + bonusInt;
                } else {
                    bonusInt = int * (1 + item.inteligence);
                }
            armor = armor + item.armor;
        });
        
        pow = pow + bonusPow;
        vit = (vit + bonusVit)* 10;
        str = str + bonusStr;
        dex = dex + bonusDex;
        int = int + bonusInt;
        fightstats.push(pow, vit, str, dex, int,armor);

        
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

const getRandomNumber = () => Math.floor(Math.random() * 101);

const dodgeMechanicGenerator = (creature1, creature2) => 
{
    const dodgechanceFull = Math.abs(creature1.staty[2] + creature2.staty[2]);
    
    const creature1dodgeChance = Math.round(creature1.staty[2]/dodgechanceFull/2*100);
    
    const creature2dodgeChance = Math.round(creature2.staty[2]/dodgechanceFull/2*100);
    
    return {
        creature1dodgeChance,
        creature2dodgeChance
    };
}
const critMechanicGenerator = (creature1, creature2) => 
    {
        const dodgechanceFull = Math.abs(creature1.staty[4] + creature2.staty[4]);
        
        const creature1critChance = Math.round(creature1.staty[4]/dodgechanceFull/1.5*100);
        
        const creature2critChance = Math.round(creature2.staty[4]/dodgechanceFull/1.5*100);
        
        return {
            creature1critChance,
            creature2critChance
        };
    }
const bonusArmorMechanicGenerator = (creature1, creature2)=>
{
    const bonusArmorfull = Math.abs(creature1.staty[2] + creature2.staty[2]);
    const creature1bonusArmorMultiplier = Math.round(creature1.staty[2]/bonusArmorfull);
    const creature2bonusArmorMultiplier = Math.round(creature2.staty[2]/bonusArmorfull);
    return{
        creature1bonusArmorMultiplier,
        creature2bonusArmorMultiplier
    }


}
const atakTurn = (random, atac, ratio, critchance, critMultiplier) =>
{
    let critM;
    if(random >= critchance)
    {
        critM = 1;
    }
    else
    {
        critM = critMultiplier;
        console.log("CRIT!!!!!");
    }
    const maxdmg = atac + atac * ratio;
    const mindmg = atac - atac * ratio;
    const damageFromCreature = Math.round((mindmg + Math.random() * (maxdmg - mindmg))*critM);
    return {
        damageFromCreature
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
    
    const creature1convertedStats = await statConversion(creature1);
    const creature2convertedStats = await statConversion(creature2);
    
    const doges = dodgeMechanicGenerator(creature1, creature2);
    const crits = critMechanicGenerator(creature1, creature2);
    const armorForCreatures = bonusArmorMechanicGenerator(creature1, creature2);
    let hpcreature1 = creature1convertedStats.fightstats[1];
    
    let hpcreature2 = creature2convertedStats.fightstats[1];
    
    const atac1 = creature1convertedStats.fightstats[0];
   
    const atac2 = creature2convertedStats.fightstats[0];
    const armor1 = creature1convertedStats.fightstats[5];
    const armor2 = creature2convertedStats.fightstats[5];

    const critMultiplier = 1.5;
    const ratio1 = 0.5;//do zastąpienia przez zmienną zewnętrzną
    
    const ratio2 = 0.5;//do zastąpienia przez zmienną zewnętrzną
    
    while(hpcreature1 > 0 && hpcreature2 > 0 )
    {
        let randomdodge = getRandomNumber();
        console.log("losowanie dla c2 dodge", randomdodge);
        if(randomdodge >= doges.creature2dodgeChance)
        {
            let randomcrit = getRandomNumber();
            const pureDamage = atakTurn(randomcrit,atac1, ratio1, crits.creature1critChance, critMultiplier);
            const reducedDamage = defTurn(armor2, pureDamage.damageFromCreature ,armorForCreatures.creature2bonusArmorMultiplier);
            
            hpcreature2 -= reducedDamage.finalDamage;
            console.log("od c 1 atak za: ", reducedDamage.finalDamage, "aktualne hpc2:", hpcreature2);
        }
        else 
        {
            console.log("c 2 wykonał unik");
        }
        if(hpcreature2 <= 0 )
        {
            break;
        }
        
        randomdodge = getRandomNumber();
        console.log("losowanie dla c1 dodge", randomdodge);
        if(randomdodge >= doges.creature1dodgeChance)
        {
            let randomcrit = getRandomNumber();
            const pureDamage = atakTurn(randomcrit,atac2, ratio2, crits.creature1critChance, critMultiplier);
            const reducedDamage = defTurn(armor1, pureDamage.damageFromCreature, armorForCreatures.creature1bonusArmorMultiplier);
            hpcreature1 -= reducedDamage.finalDamage;
            console.log("od c 2 atak za: ", reducedDamage.finalDamage, "aktualne hpc1:", hpcreature1);
        }
        else
        {
            console.log("c 1 wykonał unik");
        }
        
    }
    if(hpcreature1 <= 0)
    {
        console.log("wygrywa c2")
    }
    else if(hpcreature2 <= 0)
    {
        console.log("wygrywa c1")
    }
}

export const getCreaturesbyName = async (req, res) => {
    try {
    
    const creature1 = await Creature.findOne({name:'maciek'});
    
    const creature2 = await Creature.findOne({name:'darek'});
    
    fightMechanism(creature1, creature2);
        res.status(200).json(creature1); // Odpowiadamy na żądanie z danymi stworków
    } 
    //po niepowodzeniu
    catch (error) {
    console.log('nie Udalo sie');
    res.status(500).json({ message: 'Błąd przy pobieraniu stworków', error: error.message });
    }


};
