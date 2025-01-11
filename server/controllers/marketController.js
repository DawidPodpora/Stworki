import MarketItem from "../model/MarketItem.js";
import UserModel from "../model/User.model.js";

//dodawanie przedmiotu na rynek
export const addItemToMarket = async (req,res) => {
    try{
        const {itemId, type, price, duration} = req.body;
        const userId = req.user.userId;
        const endTime = new Date(Date.now() + duration * 60 * 60 * 1000);

        const marketItem = new MarketItem({
            item: itemId,
            seller: userId,
            type,
            buyoutPrice: type === 'fixed' ? price : undefined,
            startingPrice: type === 'auction' ? price : undefined,
            endTime,
        });

        await marketItem.save();

        await UserModel.findByIdAndUpdate(userId, {
            $pull: {items: itemId},
        });

        res.status(201).json({message: 'Przedmiot dodany do rynku.'});
    }catch(error){
        res.status(500).json({error: 'Błąd serwera.'});
    }
};

//Wyświetlanie dostępnych przedmiotów
export const getMarketItems = async (req, res) => {
    try{
        const {category, element, sortBy, sortOrder, timeLeft} = req.query;

        let filter = {};
        if (category) filter['item.type'] = category;
        if (element) filter['item.element'] = element;

        const items = await MarketItem.find(filter)
            .populate('item seller')
            .sort({[sortBy]: sortOrder === 'desc' ? -1 : 1});
            res.status(200).json(items);
    }catch(error){
        res.status(500).json({error: 'Błąd serwera.'});
    }
};

//Składanie ofert na licytację
export const placeBid = async (req, res) => {
    try{
        const {itemId, bidAmount} = req.body;
        const userId =req.user.userId;

        const marketItem = await MarketItem.findById(itemId);

        if(marketItem.type !== 'auction'){
            return res.status(400).json({error: 'To nie jest licytacja.'});
        }
        if(bidAmount <= (marketItem.currentBid || marketItem.startingPrice)){
            return res.status(400).json({error: 'Oferta musi być wyższa niż obecna cena.'});
        }

        marketItem.currentBid = bidAmount;
        marketItem.bidder = userId;

        await marketItem.save();
    }catch(error){
        res.status(500).json({error: 'Błąd serwera.'});
    }
};