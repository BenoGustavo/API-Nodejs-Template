import { ListController } from '../controllers/ListController';
import { ListService } from '../services/ListService';

describe('ListController', () => {
    let listService;
    let listController;
    let req;
    let res;
    let next;

    beforeEach(() => {
        listService = new ListService();
        listController = new ListController(listService);
        req = {
            body: {},
            params: {},
            user: { id: 'userId' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('createList', () => {
        it('should create a list and return 201 status', async () => {
            const list = { id: 'listId', name: 'Test List' };
            listService.createList = jest.fn().mockResolvedValue(list);
            req.body = { name: 'Test List' };

            await listController.createList(req, res, next);

            expect(listService.createList).toHaveBeenCalledWith({ name: 'Test List', user: 'userId' });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(list);
        });

        it('should call next with error if createList fails', async () => {
            const error = new Error('Create list failed');
            listService.createList = jest.fn().mockRejectedValue(error);

            await listController.createList(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getLists', () => {
        it('should return lists and 200 status', async () => {
            const lists = [{ id: 'listId', name: 'Test List' }];
            listService.getLists = jest.fn().mockResolvedValue(lists);

            await listController.getLists(req, res, next);

            expect(listService.getLists).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(lists);
        });

        it('should call next with error if getLists fails', async () => {
            const error = new Error('Get lists failed');
            listService.getLists = jest.fn().mockRejectedValue(error);

            await listController.getLists(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getListById', () => {
        it('should return list and 200 status if list is found', async () => {
            const list = { id: 'listId', name: 'Test List' };
            listService.getListById = jest.fn().mockResolvedValue(list);
            req.params.id = 'listId';

            await listController.getListById(req, res, next);

            expect(listService.getListById).toHaveBeenCalledWith('listId');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(list);
        });

        it('should return 404 status if list is not found', async () => {
            listService.getListById = jest.fn().mockResolvedValue(null);
            req.params.id = 'listId';

            await listController.getListById(req, res, next);

            expect(listService.getListById).toHaveBeenCalledWith('listId');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'List not found' });
        });

        it('should call next with error if getListById fails', async () => {
            const error = new Error('Get list by id failed');
            listService.getListById = jest.fn().mockRejectedValue(error);
            req.params.id = 'listId';

            await listController.getListById(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('updateList', () => {
        it('should update list and return 200 status if list is found', async () => {
            const list = { id: 'listId', name: 'Updated List' };
            listService.updateList = jest.fn().mockResolvedValue(list);
            req.params.id = 'listId';
            req.body = { name: 'Updated List' };

            await listController.updateList(req, res, next);

            expect(listService.updateList).toHaveBeenCalledWith('listId', { name: 'Updated List' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(list);
        });

        it('should return 404 status if list is not found', async () => {
            listService.updateList = jest.fn().mockResolvedValue(null);
            req.params.id = 'listId';
            req.body = { name: 'Updated List' };

            await listController.updateList(req, res, next);

            expect(listService.updateList).toHaveBeenCalledWith('listId', { name: 'Updated List' });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'List not found' });
        });

        it('should call next with error if updateList fails', async () => {
            const error = new Error('Update list failed');
            listService.updateList = jest.fn().mockRejectedValue(error);
            req.params.id = 'listId';
            req.body = { name: 'Updated List' };

            await listController.updateList(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteList', () => {
        it('should delete list and return 204 status if list is found', async () => {
            const list = { id: 'listId', name: 'Test List' };
            listService.deleteList = jest.fn().mockResolvedValue(list);
            req.params.id = 'listId';

            await listController.deleteList(req, res, next);

            expect(listService.deleteList).toHaveBeenCalledWith('listId');
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalled();
        });

        it('should return 404 status if list is not found', async () => {
            listService.deleteList = jest.fn().mockResolvedValue(null);
            req.params.id = 'listId';

            await listController.deleteList(req, res, next);

            expect(listService.deleteList).toHaveBeenCalledWith('listId');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'List not found' });
        });

        it('should call next with error if deleteList fails', async () => {
            const error = new Error('Delete list failed');
            listService.deleteList = jest.fn().mockRejectedValue(error);
            req.params.id = 'listId';

            await listController.deleteList(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});