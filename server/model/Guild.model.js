import mongoose from 'mongoose';

const GuildSchema = new mongoose.Schema({
  name: { type: String, required: true },
  goal: { type: String, required: true },
  maxMembers: { type: Number, default: 10 },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bonus_exp: { type: Number, required: true },
  bonus_gold: { type: Number, required: true },
});

GuildSchema.pre('save', async function (next) {
  const owner = await mongoose.model('User').findById(this.ownerId);

  if (owner.exp < 50) {
    if (this.bonus_exp < 1 || this.bonus_exp > 10 || this.bonus_gold < 1 || this.bonus_gold > 10) {
      return next(new Error(`Bonusy muszą być w zakresie 1-10%. Podano: EXP ${this.bonus_exp}%, Gold ${this.bonus_gold}%`));
    }
  } else {
    if (this.bonus_exp < 10 || this.bonus_exp > 20 || this.bonus_gold < 10 || this.bonus_gold > 20) {
      return next(new Error(`Bonusy muszą być w zakresie 10-20%. Podano: EXP ${this.bonus_exp}%, Gold ${this.bonus_gold}%`));
    }
  }

  next();
});


const GuildModel = mongoose.model('Guild', GuildSchema);

export default GuildModel;
