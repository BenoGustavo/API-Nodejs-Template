import { ListService } from "../services/ListService";

export class ListController {

    /**
     * ListController constructor
     * @param {ListService} listService
    */
    constructor(listService) {
        this.listService = listService;
    }

    /**
     * @param {Request} req 
     * @param {Response} res 
     * 
     * @returns {Promise<Response>}
    */
    async createList(req, res, next) {
        try {
            const list = await this.listService.createList(req.body);
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