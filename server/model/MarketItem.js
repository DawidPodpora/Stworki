import mongoose from 'mongoose';

const MarketItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['fixed', 'auction'], // 'fixed' dla sprzedaży, 'auction' dla licytacji
        required: true
    },
    startingPrice: {
        type: Number,
        required: function () { return this.type === 'auction'; } // Wymagane tylko dla licytacji
    },
    buyoutPrice: {
        type: Number,
        required: function () { return this.type === 'fixed'; } // Wymagane tylko dla stałej ceny
    },
    currentBid: {
        type: Number,
        default: null // Aktualna najwyższa oferta w licytacji
    },
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Użytkownik, który złożył najwyższą ofertę
    },
    endTime: {
        type: Date,
        required: true // Czas zakończenia oferty
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('MarketItem', MarketItemSchema);
