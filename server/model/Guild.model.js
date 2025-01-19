import mongoose from 'mongoose';

const GuildSchema = new mongoose.Schema({
  name: { type: String, required: true },
  goal: { type: String, required: true },
  maxMembers: { type: Number, default: 10 },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'  }],
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
});




const GuildModel = mongoose.model('Guild', GuildSchema);

export default GuildModel; // Eksport domyślny
