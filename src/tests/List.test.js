import { ListController } from '../controllers/ListController';
import { ListService } from '../services/ListService';

describe('ListController', () => {
    let listController;
    let listService;
    let req;
    let res;
    let next;

    beforeEach(() => {
        listService = new ListService();
        listController = new ListController(listService);
        req = {
            user: { id: 'userId' },
            params: { id: 'listId' },
            body: { name: 'test list' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('createList', () => {
        it('should create a list and return 201 status', async () => {
            listService.createList = jest.fn().mockResolvedValue(req.body);

            await listController.createList(req, res, next);

            expect(listService.createList).toHaveBeenCalledWith({ ...req.body, user: req.user.id });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(req.body);
        });

        it('should call next with error if createList fails', async () => {
            const error = new Error('Error creating list');
            listService.createList = jest.fn().mockRejectedValue(error);

            await listController.createList(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getLists', () => {
        it('should get all lists and return 200 status', async () => {
            const lists = [req.body];
            listService.getLists = jest.fn().mockResolvedValue(lists);

            await listController.getLists(req, res, next);

            expect(listService.getLists).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(lists);
        });

        it('should call next with error if getLists fails', async () => {
            const error = new Error('Error getting lists');
            listService.getLists = jest.fn().mockRejectedValue(error);

            await listController.getLists(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getListById', () => {
        it('should get a list by id and return 200 status', async () => {
            listService.getListById = jest.fn().mockResolvedValue(req.body);

            await listController.getListById(req, res, next);

            expect(listService.getListById).toHaveBeenCalledWith(req.user.id, req.params.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(req.body);
        });

        it('should call next with error if getListById fails', async () => {
            const error = new Error('Error getting list by id');
            listService.getListById = jest.fn().mockRejectedValue(error);

            await listController.getListById(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('updateList', () => {
        it('should update a list and return 200 status', async () => {
            listService.updateList = jest.fn().mockResolvedValue(req.body);

            await listController.updateList(req, res, next);

            expect(listService.updateList).toHaveBeenCalledWith(req.user.id, req.params.id, req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(req.body);
        });

        it('should call next with error if updateList fails', async () => {
            const error = new Error('Error updating list');
            listService.updateList = jest.fn().mockRejectedValue(error);

            await listController.updateList(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteList', () => {
        it('should delete a list and return 204 status', async () => {
            listService.deleteList = jest.fn().mockResolvedValue();

            await listController.deleteList(req, res, next);

            expect(listService.deleteList).toHaveBeenCalledWith(req.user.id, req.params.id);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalled();
        });

        it('should call next with error if deleteList fails', async () => {
            const error = new Error('Error deleting list');
            listService.deleteList = jest.fn().mockRejectedValue(error);

            await listController.deleteList(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});