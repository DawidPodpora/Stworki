import mongoose from 'mongoose';

const MissionSchema = new mongoose.Schema({
    goldForMission:{
        type: Number,
        default: 0
    },
    expForMission:{
        type: Number,
        default: 0
    },
    timeOfMission:{
        type:Number,
        default: 0
    },
    isThisMissionActive:{
        type: Boolean,
        default: false
    }
});

export default MissionSchema;