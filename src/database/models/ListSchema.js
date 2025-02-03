import mongoose from 'mongoose';

export const listSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ToDo' }]
});

export const List = mongoose.model('List', listSchema);