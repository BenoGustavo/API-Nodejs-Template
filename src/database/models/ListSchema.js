import mongoose from 'mongoose';
import { User } from './UserSchema';

export const listSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ToDo' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Middleware to link the list to the user before saving
listSchema.pre('save', async function (next) {
    if (this.isNew) {
        const user = await User.findById(this.user);
        if (!user) {
            throw new Error('User not found');
        }
        user.lists.push(this._id);
        await user.save();
    }
    next();
});

export const List = mongoose.model('List', listSchema);