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
const elements = ['fire', 'water', 'nature', 'light', 'dark'];
const getRandomNumberFrom0toX = (x) => Math.floor(Math.random() * (x+1));

const elementOfItemRoll =(elements)=>
{
    return elements[getRandomNumberFrom0toX(elements.length - 1)];
}


const equipableRoll = async(playerLevel)=>{
    const itemStatisticNumber = 5 + playerLevel*5;
    console.log(itemStatisticNumber, 'itemStatisticNumber')
    const percentBonusStats = 1 + (getRandomNumberFrom0toX(60) - 30)/100;
    console.log(percentBonusStats,"percentBonusStats");
    const itemStatisticNumberFinal = Math.round(itemStatisticNumber * percentBonusStats);
    console.log(itemStatisticNumberFinal, "itemStatisticNumberFinal");
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
            console.log('1 staty');
            statsNumbers.push(itemStatisticNumberFinal);
        }else if(howManyStatsFromTab == 2 ){
            console.log('2 staty');
            const statsSplit = (getRandomNumberFrom0toX(80) + 10)/100;
            console.log(statsSplit, 'statSplit');
            const firstStat = Math.round(itemStatisticNumberFinal * statsSplit);
            console.log('firstStat', firstStat)
            const secondStat = itemStatisticNumberFinal - firstStat; 
            console.log('secondStat', secondStat);
            statsNumbers.push(firstStat);
            statsNumbers.push(secondStat);
        }else if(howManyStatsFromTab == 3)
        {
            console.log('3 staty');
            const statsSplit1 = getRandomNumberFrom0toX(40) + 20;
            console.log('statsSplit1', statsSplit1);
            const statsSplit2 = getRandomNumberFrom0toX(100 - statsSplit1 - 10);
            console.log('statsSplit2', statsSplit2);
            const firstStat = Math.round(itemStatisticNumberFinal * (statsSplit1/100));
            console.log('firstStat',firstStat)
            const secondStat = Math.round(itemStatisticNumber * (statsSplit2/100));
            console.log('secondStat', secondStat);
            const thirdStat = itemStatisticNumberFinal - firstStat - secondStat;
            console.log('thirdStat', thirdStat)
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
    console.log(element, "element")
    const rollForStatName = getRandomNumberFrom0toX(statsNames.length - 1);
    console.log(statsNames[rollForStatName], 'rolka');
    const ItemBaseDataBasedOnRoll = await ItemBaseData.findOne({section: statsNames[rollForStatName]});
    console.log(ItemBaseDataBasedOnRoll, ' baseitem');
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
    console.log(item,'item wylosowany');
    return item;
    
}
const usableRoll = async()=>{

}
const orbRoll = async()=>{

}
const typeOfItemRoll = async(playerLevel)=>{
    const chanceForItem = getRandomNumberFrom0toX(100);
    if(chanceForItem < 70){

    }else if(chanceForItem >= 70 && chanceForItem <= 90 ){

    }else{

    }
}

export async function NewItem(req, res)
{
    try{
        const a = equipableRoll(20);
        console.log(a.item);
        res.status(200).send({   
        });
    }catch(error){
        res.status(500).send({ error: 'Błąd serwera przy pobieraniu danych o stworkach' }); 
    }
}