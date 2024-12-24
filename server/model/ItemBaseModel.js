import mongoose from 'mongoose';

const ItemBaseDataSchema = new mongoose.Schema({
    type:{
        type: String,
        enum: ['equipable', 'usable', 'orb'],
        required: true
    },
    photos:{
        type: [String],
        required: true
    },
    names:{
        type: [String],
        required: true
    },
    section:
    {
        type: String,
        required: true
    }
});
const ItemBaseData = mongoose.model('ItemBaseData', ItemBaseDataSchema);
export default ItemBaseData;