import { List } from '../database/models/ListSchema';
import { ListDto } from '../dto/ListDto';
import mongoose from 'mongoose';
import { InvalidIdError } from '../errors/InvalidIdError';
import { NotFound } from '../errors/http/NotFound';
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
     * @returns {Promise<ListDto>}
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
     * @returns {Promise<ListDto[]>}
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
     * @param {string} id
     * @returns {Promise<ListDto>}
     */
    async getListById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new InvalidIdError('Invalid ID format');
        }
        const list = await List.findById(id);
        if (!list) {
            throw new NotFound('List not found');
        }
        return list;
    }

    /**
     * Updates a list
     * @param {string} id
     * @param {ListDto} data
     * @returns {Promise<ListDto>}
     */
    async updateList(id, data) {
        try {
            return await List.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        } catch (error) {
            throw adaptMongooseError(error);
        }
    }

    /**
     * Deletes a list
     * @param {string} id
     * @returns {void}
     */
    async deleteList(id) {
        try {
            return await List.findByIdAndDelete(id);
        } catch (error) {
            throw adaptMongooseError(error);
        }
    }
}