import mongoose from 'mongoose';

const MarketItemSchema = new mongoose.Schema({
    item: {
        type: Object, // Przechowujemy uproszczone dane przedmiotu
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['fixed', 'auction'],
        required: true
    },
    startingPrice: {
        type: Number,
        required: function () { return this.type === 'auction'; },
        min: [1, 'Cena początkowa musi być większa niż 0']
    },
    buyoutPrice: {
        type: Number,
        required: function () { return this.type === 'fixed'; }
    },
    currentBid: {
        type: Number,
        default: null
    },
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'sold', 'expired'],
        default: 'active'
    },
    isProcessing: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.models.MarketItem || mongoose.model('MarketItem', MarketItemSchema);
