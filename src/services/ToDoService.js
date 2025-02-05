import { ToDo } from '../database/models/TodoSchema';
import { List } from '../database/models/ListSchema';
import { TodoDto } from '../dto/TodoDto';
import mongoose from 'mongoose';
import { InvalidIdError } from '../errors/InvalidIdError';
import { NotFound } from '../errors/http/NotFound';
// import { BadRequest } from '../errors/http/BadRequest';
import { adaptMongooseError } from '../errors/database/AdaptMongooseError';

export class ToDoService {
    constructor() {
        this.createToDo = this.createToDo.bind(this);
        this.getToDos = this.getToDos.bind(this);
        this.getToDoById = this.getToDoById.bind(this);
        this.updateToDo = this.updateToDo.bind(this);
        this.deleteToDo = this.deleteToDo.bind(this);
    }

    /**
     * Creates a new ToDo
     * @param {string} listId
     * @param {TodoDto} data
     * @returns {ToDo}
     */
    async createToDo(listId,data) {
        try {
            const list = await List.findById(listId);

            if (!list) {
                throw new NotFound('List not found');
            }

            const toDo = new ToDo(data);

            list.items.push(toDo);

            await list.save();
            return await toDo.save();
        } catch (error) {
            throw adaptMongooseError(error);
        }
    }

    /**
     * Gets all ToDos
     * @returns {ToDo[]}
     */
    async getToDos() {
        try {
            return await ToDo.find();
        } catch (error) {
            throw adaptMongooseError(error);
        }
    }


    /**
     * Gets all ToDos from a list
     * @param {string} id
     * @returns {List<ToDo[]>}
     */
    async getToDosByListId(id) {
        try {
            return await List.findById(id).populate('items');
        } catch (error) {
            throw adaptMongooseError(error);
        }
    }

    /**
     * Gets a ToDo by id
     * @param {string} id
     * @returns {ToDo}
     */
    async getToDoById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new InvalidIdError('Invalid ID format');
        }
        const toDo = await ToDo.findById(id);
        if (!toDo) {
            throw new NotFound('ToDo not found');
        }
        return toDo;
    }

    /**
     * Updates a ToDo
     * @param {string} id
     * @param {TodoDto} data
     * @returns {ToDo}
     */
    async updateToDo(id, data) {
        try {
            return await ToDo.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        } catch (error) {
            throw adaptMongooseError(error);
        }
    }

    /**
     * Deletes a ToDo
     * @param {string} id
     * @returns {void}
     */
    async deleteToDo(id) {
        try {
            return await ToDo.findOneAndDelete(id);
        } catch (error) {
            throw adaptMongooseError(error);
        }
    }
}