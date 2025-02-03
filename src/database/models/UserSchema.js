import mongoose from 'mongoose';
import { listSchema } from './ListSchema';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    lists: [listSchema]
});

export const User = mongoose.model('User', userSchema);