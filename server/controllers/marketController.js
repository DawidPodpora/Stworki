import MarketItem from "../model/MarketItem.js";
import UserModel from "../model/User.model.js";
import mongoose from "mongoose";

// Dodawanie przedmiotu na rynek
export const addItemToMarket = async (req, res) => {
    try {
        const { itemId, type, price, duration } = req.body;
        const userId = req.user.userId;

        const user = await UserModel.findById(userId); // Pobierz użytkownika jako zwykły obiekt
        const item = user.items.find(i => i._id.toString() === itemId);

        if (!item) {
            return res.status(404).json({ error: 'Nie posiadasz tego przedmiotu.' });
        }

        const maxPrice = item.price * 10;
        if (price > maxPrice) {
            return res.status(400).json({ error: `Maksymalna cena sprzedaży to ${maxPrice}.` });
        }
        //Prowizja
        let commissionRate = duration === "2" ? 0.02 : duration === "8" ? 0.03 : 0.04;
        let commissionFee = Math.floor(price * commissionRate);

        if (user.money < commissionFee){
            return res.status(400).json({error: "Nie masz wystarczających środków na pokrycie prowizji"})
        }
        user.money -= commissionFee;
        await user.save();

        const endTime = new Date(Date.now() + duration * 60 * 60 * 1000);

        // Utworzenie nowego przedmiotu na rynku
        const marketItem = new MarketItem({
            item: {item},
            seller: userId,
            type,
            buyoutPrice: type === 'fixed' ? price : undefined,
            startingPrice: type === 'auction' ? price : undefined,
            endTime,
        });

        await marketItem.save();

        // Usuń przedmiot z ekwipunku użytkownika
        user.items = user.items.filter(i => i._id.toString() !== itemId);
        await UserModel.updateOne({ _id: userId }, { items: user.items });

        res.status(201).json({ message: 'Przedmiot dodany do rynku.', marketItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd serwera.' });
    }
};

// Pobranie dostępnych przedmiotów
export const getMarketItems = async (req, res) => {
    try {
        const { category, element, sortBy = 'endTime', sortOrder = 'asc', timeLeft } = req.query;

        let filter = {status: "active"};
        if (category) filter['item.type'] = category;
        if (element) filter['item.element'] = element;
        if (timeLeft) filter['endTime'] = { $lte: new Date(Date.now() + timeLeft * 60 * 60 * 1000) };

        const items = await MarketItem.find(filter)
            .populate('item')
            .populate('seller', 'username') // Pobiera dane sprzedawcy
            .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 });

        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd serwera.' });
    }
};

// Składanie ofert na licytację
export const placeBid = async (req, res) => {
    try {
        const { marketItemId, bidAmount } = req.body;
        const userId = req.user.userId;

        const marketItem = await MarketItem.findById(marketItemId).populate('seller');

        if (!marketItem || marketItem.status !== 'active') {
            return res.status(404).json({ error: 'Przedmiot nie jest dostępny.' });
        }

        if (marketItem.type !== 'auction') {
            return res.status(400).json({ error: 'To nie jest licytacja.' });
        }

        const currentHighestBid = marketItem.currentBid || marketItem.startingPrice;
        if (bidAmount <= currentHighestBid * 1.05) {
            return res.status(400).json({ error: 'Oferta musi być wyższa o co najmniej 5%.' });
        }

        const buyer = await UserModel.findById(userId);
        if (buyer.money < bidAmount) {
            return res.status(400).json({ error: 'Nie masz wystarczająco dużo pieniędzy.' });
        }

        if (marketItem.bidder) {
            const previousBidder = await UserModel.findById(marketItem.bidder);
            previousBidder.money += marketItem.currentBid;
            await previousBidder.save();
        }

        buyer.money -= bidAmount;
        marketItem.currentBid = bidAmount;
        marketItem.bidder = userId;

        await buyer.save();
        await marketItem.save();

        res.status(200).json({ message: 'Oferta została złożona.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd serwera.' });
    }
};

// Kupowanie przedmiotu
export const buyMarketItem = async (req, res) => {
    try {
        const { marketItemId } = req.body;
        const userId = req.user.userId;

        if (!marketItemId) {
            return res.status(400).json({ error: "Brak marketItemId" });
        }

        // Pobranie przedmiotu z rynku i jego pełnych danych
        const marketItem = await MarketItem.findById(marketItemId);

        if (!marketItem) {
            return res.status(404).json({ error: "Przedmiot nie został znaleziony." });
        }

        // Pobranie użytkownika
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Użytkownik nie został znaleziony." });
        }

        // Sprawdzenie środków użytkownika
        if (user.money < marketItem.buyoutPrice) {
            return res.status(400).json({ error: "Nie masz wystarczających środków na koncie." });
        }

        // Kopiowanie danych przedmiotu bez `_id`
        const itemData = { ...marketItem.item.item };
        delete itemData._id;

        // Dodanie przedmiotu do ekwipunku użytkownika
        user.items.push(itemData);

        // Odjęcie pieniędzy
        user.money -= marketItem.buyoutPrice;
        marketItem.seller.money += marketItem.buyoutPrice;
        // Aktualizacja użytkownika
        await user.save();

        // Usunięcie przedmiotu z rynku
        await MarketItem.findByIdAndDelete(marketItemId);

        return res.status(200).json({ message: "Zakupiono przedmiot!", userItems: user.items });
    } catch (error) {
        console.error("Błąd zakupu przedmiotu:", error);
        return res.status(500).json({ error: "Wystąpił błąd podczas zakupu przedmiotu." });
    }
};

// Aktualizacja statusu wygasłych przedmiotów
export const updateExpiredMarketItems = async () => {
    try {
        const now = new Date();
        const expiredItems = await MarketItem.find({
            endTime: { $lt: now },
            status: 'active'
        }).populate('item seller bidder');

        for (const marketItem of expiredItems) {
            if (marketItem.currentBid && marketItem.bidder) {
                // Licytacja zakończona sukcesem
                const buyer = await UserModel.findById(marketItem.bidder._id);
                const seller = await UserModel.findById(marketItem.seller._id);

                if (!buyer || !seller) {
                    console.error('Nie znaleziono użytkownika w transakcji.');
                    continue;
                }

                buyer.items.push(marketItem.item);
                seller.money += marketItem.currentBid;
                await buyer.save();
                await seller.save();
                await marketItem.delete();
                console.log('Przedmiot został sprzedany');
            } else {
                // Licytacja zakończona bez ofert - zwrot przedmiotu
                const seller = await UserModel.findById(marketItem.seller._id);
                if (seller) {
                    seller.items.push(marketItem.item);
                    await seller.save();
                }
            }

            await marketItem.delete();
            console.log('Przedmiot wygasł i został zwrócony sprzedającemu.');
        }
        console.log(`Zaktualizowano status dla ${expiredItems.length} przedmiotów.`);
    } catch (error) {
        console.error('Błąd serwera', error);
    }
};

