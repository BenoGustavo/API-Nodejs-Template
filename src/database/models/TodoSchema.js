import mongoose from "mongoose";
import { List } from '../../database/models/ListSchema';

export const toDoSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    done: { type: Boolean, required: true }
});

// Middleware to remove references from lists when a ToDo is deleted
toDoSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await List.updateMany(
            { items: doc._id },
            { $pull: { items: doc._id } }
        );
    }
});

export const ToDo = mongoose.model('ToDo', toDoSchema);
