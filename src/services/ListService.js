import { List } from '../database/models/ListSchema';
import { ListDto } from '../dto/ListDto';
import mongoose from 'mongoose';
import { InvalidIdError } from '../errors/InvalidIdError';
import { NotFound } from '../errors/http/NotFound';
import { Unauthorized } from '../errors/http/Unauthorized';
import { adaptMongooseError } from '../errors/database/AdaptMongooseError';

export class ListService {
    constructor() {
        this.createList = this.createList.bind(this);
        this.getLists = this.getLists.bind(this);
        this.getListById = this.getListById.bind(this);
        this.updateList = this.updateList.bind(this);
        this.deleteList = this.deleteList.bind(this);
    }

    /**
     * Creates a new list
     * @param {ListDto} data
     * @returns {List}
     */
    async createList(data) {
        try {
            const list = new List(data);
            list.items = [];
            return await list.save();
        } catch (error) {
            throw adaptMongooseError(error);
        }
    }

    /**
     * Gets all lists
     * @returns {List}
     */
    async getLists() { 
        try {
            return await List.find();
        } catch (error) {
            throw adaptMongooseError(error);
        }
    }

    /**
     * Gets a list by id
     * 
     * @param {string} userRequesterId
     * @param {string} id
     * @returns {List}
     */
    async getListById(userRequesterId,id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new InvalidIdError('Invalid ID format');
        }

        const list = await List.findById(id);

        if (!list) {
            throw new NotFound('List not found');
        }

        if (list.user.toString() !== userRequesterId) {
            throw new Unauthorized('You are not authorized to access this list, because youre not the owner');
        }

        return list;
    }

    /**
     * Updates a list
     * 
     * @param {string} userRequesterId
     * @param {string} id
     * @param {ListDto} data
     * @returns {List}
     */
    async updateList(userRequesterId,id, data) {
        try {
            const list = await List.findById(id);

            if (!list) {
                throw new NotFound('List not found');
            }

            if (list.user.toString() !== userRequesterId) {
                throw new Unauthorized('You are not authorized to update this list, because youre not the owner');
            }

            return await await List.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        } catch (error) {
            throw adaptMongooseError(error);
        }
    }

    /**
     * Deletes a list
     * 
     * @param {string} userRequesterId
     * @param {string} id
     * @returns {void}
     */
    async deleteList(userRequesterId,id) {
        try {
            const list = await List.findById(id);

            if (!list) {
                throw new NotFound('List not found');
            }

            console.log(
                list.user.toString(),
                userRequesterId
            )

            if (list.user.toString() !== userRequesterId) {
                throw new Unauthorized('You are not authorized to delete this list, because youre not the owner');
            }

            return await list.deleteOne();
        } catch (error) {
            throw adaptMongooseError(error);
        }
    }
}