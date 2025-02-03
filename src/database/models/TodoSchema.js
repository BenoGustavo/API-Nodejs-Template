import mongoose from "mongoose";

export const toDoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    done: { type: Boolean, required: true }
});

export const ToDo = mongoose.model('ToDo', toDoSchema);
