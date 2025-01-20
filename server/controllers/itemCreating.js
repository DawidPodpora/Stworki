import ItemBaseData from "../model/ItemBaseModel.js";

import UserModel from '../model/User.model.js'

const baseSections = [  'power',
    'vitality', 
    'strength',
    'dexterity',
    'intelligence'];

const Stats =[  'strength', 
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
    console.log("-----------------------------EquipableRoll");
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
            console.log("dla jednego");
            statsNumbers.push(itemStatisticNumberFinal);
        }else if(howManyStatsFromTab == 2 ){
            console.log("dla dwoch");
            const statsSplit = (getRandomNumberFrom0toX(80) + 10)/100;
            
            const firstStat = Math.round(itemStatisticNumberFinal * statsSplit);
            
            const secondStat = itemStatisticNumberFinal - firstStat; 
            
            statsNumbers.push(firstStat);
            statsNumbers.push(secondStat);
        }else if(howManyStatsFromTab == 3)
        {
            console.log("dla trzech");
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
            console.log("dla pieciu");
            statsNumbers.push(all5Stats);
        }
    }
    const stats = {
        power: 0,
        vitality: 0,
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        armor: 0,
    }


    statsNames.forEach((statname, index)=>{
        if(statname == 'armor'){
            
            stats[statname] = Math.round(statsNumbers[index]/itemStatisticNumberFinal/7*100);
            
        }else{
            stats[statname] = statsNumbers[index];
        }
    });
    const element = elementOfItemRoll(elements);
    const rollForStatName = getRandomNumberFrom0toX(statsNames.length - 1);
    console.log(statsNames[rollForStatName], " ---------------- statystyka do znalezienia");
    const ItemBaseDataBasedOnRoll = await ItemBaseData.findOne({section: statsNames[rollForStatName]});
    console.log(ItemBaseDataBasedOnRoll, "dane z itemu");
    const photoAndNameRoll = getRandomNumberFrom0toX(2);
    const photoBasedOnRoll = ItemBaseDataBasedOnRoll.photos[photoAndNameRoll];
    const nameBasedOnRoll = ItemBaseDataBasedOnRoll.names[photoAndNameRoll];
    const price = Math.round((playerLevel * 20 + 100) * percentBonusStats);
    const item = {
        name: nameBasedOnRoll,
        type: 'equipable',
        ...stats,
        passive: 'Random Pasive',
        description: 'Random description',
        element: element,
        price: price,
        levelRequired: playerLevel,
        photo: photoBasedOnRoll
    }
    return{ item};
    
}
const usableRoll = async()=>{
    console.log("-----------------------------usableRoll");
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
        strength: 0,
        dexterity: 0,
        intelligence: 0,
    }
    const price = 1000;
    stats[statName] = 1;
    const item = {
        name: usableItemName,
        type: 'usable',
        ...stats,
        armor: 0,
        passive: 'Random Pasive',
        description: 'Random description',
        element: element,
        price: price,
        levelRequired: 1,
        photo: usableItemPhoto
    }
    console.log(item);
    return {item};
}
const orbRoll = async()=>{
    console.log("-----------------------------robRoll");
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
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        armor: 0,
        passive: 'Random Pasive',
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
        newItem = await usableRoll(playerLevel);
    }else{
        newItem = await orbRoll();
    }
    const item = newItem.item;

    return {item};
}



export async function ItemToEq(req, res) {
    try{
        //do dodania system losujący czy losować item czy nie 
        const user = await UserModel.findOne({name:'grzes3'});
        const item = await typeOfItemRoll(user.level);
        user.items.push(item.item);
        await user.save();
        res.status(200).json({
        });
    }catch(error){
        res.status(500).send({ error: 'Błąd serwera przy wysyłaniu danych itemow' }); 
    }
    
}
3636
//tworzenie nowych rzeczy do sklepu
export async function ItemsToShop(req, res)
{
    try{
        const userId = req.user.userId;
        const {newShopForMoney} = req.query;
        console.log("czy za hajs-----------------", newShopForMoney);
        const user = await UserModel.findById(userId);
        console.log(user.itemShopReset);
        console.log(user.itemShopReset instanceof Date);
        console.log(new Date());
        if((user.itemShopReset < new Date()) || newShopForMoney === 'true' )
        {
            user.itemsShop = [];
            for (let i = 0; i < 16; i++){
                console.log("dala ", i);
                const item = await typeOfItemRoll(user.level);
                user.itemsShop.push(item.item);
                console.log("koniec petli ", i);
            }
            console.log("zakonczona petla");
            const now = new Date();
            const nextDayMidnight = new Date();
            nextDayMidnight.setDate(now.getDate() + 1);
            nextDayMidnight.setHours(0, 0, 0, 0);
            user.itemShopReset = nextDayMidnight;
            
        await user.save();
        console.log("zapis");
        }
        console.log(user.items);
        res.status(200).send({
            ShopItems: user.itemsShop,
            userItems: user.items
        });
    }catch(error){
        res.status(500).send({ error: 'Błąd przy tworzeniu rzeczy do sklepu' }); 
    }
}

//kupowanie rzeczy ze sklepu


export async function BuyItem(req, res){
    try{
        const userId = req.user.userId;
        const {itemId} = req.query;
        console.log(userId, "user ID");
        console.log(itemId, "item ID");
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'Użytkownik nie znaleziony' });
        }
        const item = user.itemsShop.find((item) => item._id.toString() === itemId);
        user.items.push(item);
        console.log(item._id, "itemek");
        if (!item) {
            return res.status(404).send({ error: 'Przedmiot nie znaleziony w sklepie użytkownika' });
        }
        if(item.price > user.money){
            return res.status(404).send({ error: 'nie można kupić przedmiotu'});
        }
        user.money = user.money - item.price;
        user.itemsShop = user.itemsShop.filter((item) => item._id.toString() !== itemId);
        await user.save();
        res.status(200).send({
            ShopItems: user.itemsShop,
            userItems: user.items
        });
    }catch(error)
    {
        res.status(500).send({ error: 'Błąd przy tworzeniu rzeczy do sklepu' }); 
    }
}

export async function SellItem(req, res){
    try{
        const userId = req.user.userId;
        const {itemId} = req.query;
        console.log(userId, "user ID");
        console.log(itemId, "item ID");
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'Użytkownik nie znaleziony' });
        }
        const item = user.items.find((item) => item._id.toString() === itemId);
        
        console.log(item._id, "itemek");
        if (!item) {
            return res.status(404).send({ error: 'Przedmiot nie znaleziony w sklepie użytkownika' });
        }
        user.money = user.money + Math.round(item.price / 3);
        user.items = user.items.filter((item) => item._id.toString() !== itemId);
        await user.save();
        res.status(200).send({
            ShopItems: user.itemsShop,
            userItems: user.items
        });
    }catch(error)
    {
        res.status(500).send({ error: 'Błąd przy tworzeniu rzeczy do sklepu' }); 
    }
}