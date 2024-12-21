import mongoose from 'mongoose';
import { setExpiresAt } from '../middleware/messagesMiddleware.js';

const MessagesSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',//odniesienie do modelu user
        required: true,
      },
      receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      title:{
        type: String,
        required : true,
        maxlength: 100,
      },
      content:{
        type: String,
        required: true,
      },
      isRead:{
        type: Boolean,
        default: false,//domyślnie wiadomość nieprzeczytana 
      },
      createdAt: {
        type: Date,
        default: Date.now,//automatyczne ustawienie daty utworzenia
      },
      expiresAt: {
        type: Date,
        required: true,
      },
});

MessagesSchema.pre('save',setExpiresAt);
MessagesSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});

const Messages = mongoose.model('Messages', MessagesSchema);
export default Messages;