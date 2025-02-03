import mongoose from 'mongoose';
import { toDoSchema } from './TodoSchema';

export const listSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    items: [toDoSchema]
});

export const List = mongoose.model('List', listSchema);