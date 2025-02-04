import { ListService } from "../services/ListService";

export class ListController {

    /**
     * ListController constructor
     * @param {ListService} listService
    */
    constructor(listService) {
        this.listService = listService;
        this.createList = this.createList.bind(this);
        this.getLists = this.getLists.bind(this);
        this.getListById = this.getListById.bind(this);
        this.updateList = this.updateList.bind(this);
        this.deleteList = this.deleteList.bind(this);
    }

    async createList(req, res, next) {
        try {
            const data = { ...req.body, user: req.user.id };
            const list = await this.listService.createList(data);
            res.status(201).json(list);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @param {Request} req 
     * @param {Response} res 
     * 
     * @returns {Promise<Response>}
    */
    async getLists(req, res, next) {
        try {
            const lists = await this.listService.getLists();
            res.status(200).json(lists);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @param {Request} req 
     * @param {Response} res 
     * 
     * @returns {Promise<Response>}
    */
    async getListById(req, res, next) {
        try {
            const list = await this.listService.getListById(req.params.id);
            if (!list) {
                return res.status(404).json({ error: 'List not found' });
            }
            res.status(200).json(list);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @param {Request} req 
     * @param {Response} res 
     * 
     * @returns {Promise<Response>}
    */
    async updateList(req, res, next) {
        try {
            const list = await this.listService.updateList(req.params.id, req.body);
            if (!list) {
                return res.status(404).json({ error: 'List not found' });
            }
            res.status(200).json(list);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next
     * @returns {Promise<Response>}
    */
    async deleteList(req, res, next) {
        try {
            const list = await this.listService.deleteList(req.params.id);
            if (!list) {
                return res.status(404).json({ error: 'List not found' });
            }
            res.status(204).json();
        } catch (error) {
            next(error);
        }
    }
}