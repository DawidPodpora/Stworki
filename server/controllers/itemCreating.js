import ItemBaseData from "../model/ItemBaseModel.js";
import ItemSchema from "../model/Item.js";
import e from "express";
const baseSections = [  'strenght', 
    'intelligence',
    'dexterity', 
    'power',
    'vitality',];

const Stats =[  'strenght', 
    'intelligence',
    'dexterity', 
    'power',
    'vitality',
    'armor'];
const elements = ['water', 'fire', 'nature', 'light', 'dark'];
const getRandomNumberFrom0toX = (x) => Math.floor(Math.random() * (x+1));

const elementOfItemRoll =(elements)=>
{
    return elements[getRandomNumberFrom0toX(elements.length - 1)];
}


const equipableRoll = async(playerLevel)=>{
    const itemStatisticNumber = 5 + playerLevel*5;
    const percentBonusStats = 1 + (getRandomNumberFrom0toX(60) - 30)/100; // od 0.7 do 1.3
    const itemStatisticNumberFinal = Math.round(itemStatisticNumber * percentBonusStats);
    const numberofstats=[1,2,3,5];
    const  howManyStatsFromTab = numberofstats[getRandomNumberFrom0toX(3)];
    let  statsNames = [];
    let  statsNumbers = [];
    if(howManyStatsFromTab != 5)
    {
        const tab = Stats.slice();
        for(let i = howManyStatsFromTab; i > 0; i--)
        {
            
            const indexToRemoveAndUpload = getRandomNumberFrom0toX(tab.length-1);
            statsNames.push(tab[indexToRemoveAndUpload]);
            tab.splice(indexToRemoveAndUpload, 1);
        }
        if(howManyStatsFromTab == 1)
        {
            
            statsNumbers.push(itemStatisticNumberFinal);
        }else if(howManyStatsFromTab == 2 ){
            
            const statsSplit = (getRandomNumberFrom0toX(80) + 10)/100;
            console.log(statsSplit, 'statSplit');
            const firstStat = Math.round(itemStatisticNumberFinal * statsSplit);
            
            const secondStat = itemStatisticNumberFinal - firstStat; 
            
            statsNumbers.push(firstStat);
            statsNumbers.push(secondStat);
        }else if(howManyStatsFromTab == 3)
        {
            
            const statsSplit1 = getRandomNumberFrom0toX(40) + 20;
            
            const statsSplit2 = getRandomNumberFrom0toX(100 - statsSplit1 - 10);
           
            const firstStat = Math.round(itemStatisticNumberFinal * (statsSplit1/100));
            
            const secondStat = Math.round(itemStatisticNumber * (statsSplit2/100));
            
            const thirdStat = itemStatisticNumberFinal - firstStat - secondStat;
            
            statsNumbers.push(firstStat);
            statsNumbers.push(secondStat);
            statsNumbers.push(thirdStat);
        }
    }else{
        statsNames = baseSections.slice();
        const all5Stats = Math.round(itemStatisticNumberFinal * 0.2);
        for(let i = 5; i > 0; i--)
        {
            statsNumbers.push(all5Stats);
        }
    }
    const stats = {
        power: 0,
        vitality: 0,
        strenght: 0,
        dexterity: 0,
        intelligence: 0,
        armor: 0,
    }


    statsNames.forEach((statname, index)=>{
        if(statname == 'armor'){
            
            stats[statname] = Math.round(statsNumbers[index]/itemStatisticNumberFinal/7*100);
            console.log(statsNumbers[index]/itemStatisticNumberFinal/7*100,"armor");
        }else{
            stats[statname] = statsNumbers[index];
        }
    });
    const element = elementOfItemRoll(elements);
    const rollForStatName = getRandomNumberFrom0toX(statsNames.length - 1);
    const ItemBaseDataBasedOnRoll = await ItemBaseData.findOne({section: statsNames[rollForStatName]});
    const photoAndNameRoll = getRandomNumberFrom0toX(2);
    const photoBasedOnRoll = ItemBaseDataBasedOnRoll.photos[photoAndNameRoll];
    const nameBasedOnRoll = ItemBaseDataBasedOnRoll.names[photoAndNameRoll];
    const price = Math.round((playerLevel * 20 + 100) * percentBonusStats);
    const item = {
        name: nameBasedOnRoll,
        type: 'equipable',
        ...stats,
        pasive: 'Random Pasive',
        description: 'Random description',
        element: element,
        price: price,
        levelRequired: playerLevel,
        photo: photoBasedOnRoll
    }
    return{ item};
    
}
const usableRoll = async()=>{
    const elementNumber = getRandomNumberFrom0toX(elements.length - 1);
    const element = elements[elementNumber];
    const usabeItemBaseFromDataBase = await ItemBaseData.findOne({section: 'usable'}).lean();
    const usableItemName = usabeItemBaseFromDataBase.names[elementNumber];
    const usableItemPhoto = usabeItemBaseFromDataBase.photos[elementNumber];
    const statNameNr = getRandomNumberFrom0toX(baseSections.length - 1);
    const statName = baseSections[statNameNr];
    const stats = {
        power: 0,
        vitality: 0,
        strenght: 0,
        dexterity: 0,
        intelligence: 0,
    }
    const price = 1000;
    stats[statName] = 1;
    console.log(statName);
    const item = {
        name: usableItemName,
        type: 'usable',
        ...stats,
        armor: 0,
        pasive: 'Random Pasive',
        description: 'Random description',
        element: element,
        price: price,
        levelRequired: 1,
        photo: usableItemPhoto
    }
    return {item};
}
const orbRoll = async()=>{
    const elementNumber = getRandomNumberFrom0toX(elements.length - 1);
    const element = elements[elementNumber];
    const OrbBaseData = await ItemBaseData.findOne({section: 'orb'}).lean();
    const photo = OrbBaseData.photos[elementNumber];
    const OrbName = OrbBaseData.names[elementNumber];
    const price = 4000; 
    const item = {
        name: OrbName,
        type: 'orb',
        power: 0,
        vitality: 0,
        strenght: 0,
        dexterity: 0,
        intelligence: 0,
        armor: 0,
        pasive: 'Random Pasive',
        description: 'Random description',
        element: element,
        price: price,
        levelRequired: 1,
        photo: photo
    }
    
    return {item};
}
const typeOfItemRoll = async(playerLevel)=>{
    const chanceForItem = getRandomNumberFrom0toX(100);
    let newItem;
    if(chanceForItem < 70){
        newItem = await equipableRoll(playerLevel);
    }else if(chanceForItem >= 70 && chanceForItem <= 90 ){
        newItem = await usableRoll();
    }else{
        newItem = await orbRoll();
    }
    const item = newItem.item;

    return {item};
}

export async function NewItem(req, res)
{
    try{
        const a = await typeOfItemRoll(20);
        console.log(a.item, "cos");
        res.status(200).send({});
    }catch(error){
        res.status(500).send({ error: 'Błąd serwera przy pobieraniu danych o stworkach' }); 
    }
}