import { ToDoController } from '../controllers/ToDoController';
import { ToDoService } from '../services/ToDoService';
import { jest } from '@jest/globals';

jest.mock('../services/ToDoService');

describe('ToDoController', () => {
    let toDoService;
    let toDoController;
    let req;
    let res;
    let next;

    beforeEach(() => {
        toDoService = new ToDoService();
        toDoController = new ToDoController(toDoService);
        req = {
            params: {},
            user: { id: 'userId' },
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
        next = jest.fn();
    });

    describe('createToDo', () => {
        it('should create a new ToDo and return 201 status', async () => {
            const toDo = { id: 'toDoId' };
            toDoService.createToDo.mockResolvedValue(toDo);
            req.params.listId = 'listId';
            req.body = { title: 'Test ToDo' };

            await toDoController.createToDo(req, res, next);

            expect(toDoService.createToDo).toHaveBeenCalledWith('listId', 'userId', req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(toDo);
        });

        it('should call next with error if service fails', async () => {
            const error = new Error('Service Error');
            toDoService.createToDo.mockRejectedValue(error);

            await toDoController.createToDo(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getToDos', () => {
        it('should retrieve all ToDos and return 200 status', async () => {
            const toDos = [{ id: 'toDoId' }];
            toDoService.getToDos.mockResolvedValue(toDos);

            await toDoController.getToDos(req, res, next);

            expect(toDoService.getToDos).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(toDos);
        });

        it('should call next with error if service fails', async () => {
            const error = new Error('Service Error');
            toDoService.getToDos.mockRejectedValue(error);

            await toDoController.getToDos(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getToDosByListId', () => {
        it('should retrieve ToDos by list id and return 200 status', async () => {
            const toDos = [{ id: 'toDoId' }];
            toDoService.getToDosByListId.mockResolvedValue(toDos);
            req.params.id = 'listId';

            await toDoController.getToDosByListId(req, res, next);

            expect(toDoService.getToDosByListId).toHaveBeenCalledWith('userId', 'listId');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(toDos);
        });

        it('should call next with error if service fails', async () => {
            const error = new Error('Service Error');
            toDoService.getToDosByListId.mockRejectedValue(error);

            await toDoController.getToDosByListId(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getToDoById', () => {
        it('should retrieve a ToDo by id and return 200 status', async () => {
            const toDo = { id: 'toDoId' };
            toDoService.getToDoById.mockResolvedValue(toDo);
            req.params.id = 'toDoId';

            await toDoController.getToDoById(req, res, next);

            expect(toDoService.getToDoById).toHaveBeenCalledWith('userId', 'toDoId');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(toDo);
        });

        it('should return 404 if ToDo not found', async () => {
            toDoService.getToDoById.mockResolvedValue(null);
            req.params.id = 'toDoId';

            await toDoController.getToDoById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'ToDo not found' });
        });

        it('should call next with error if service fails', async () => {
            const error = new Error('Service Error');
            toDoService.getToDoById.mockRejectedValue(error);

            await toDoController.getToDoById(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('updateToDo', () => {
        it('should update a ToDo and return 200 status', async () => {
            const toDo = { id: 'toDoId' };
            toDoService.updateToDo.mockResolvedValue(toDo);
            req.params.id = 'toDoId';
            req.body = { title: 'Updated ToDo' };

            await toDoController.updateToDo(req, res, next);

            expect(toDoService.updateToDo).toHaveBeenCalledWith('toDoId', 'userId', req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(toDo);
        });

        it('should call next with error if service fails', async () => {
            const error = new Error('Service Error');
            toDoService.updateToDo.mockRejectedValue(error);

            await toDoController.updateToDo(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteToDo', () => {
        it('should delete a ToDo and return 204 status', async () => {
            toDoService.deleteToDo.mockResolvedValue();
            req.params.id = 'toDoId';

            await toDoController.deleteToDo(req, res, next);

            expect(toDoService.deleteToDo).toHaveBeenCalledWith('userId', 'toDoId');
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('should call next with error if service fails', async () => {
            const error = new Error('Service Error');
            toDoService.deleteToDo.mockRejectedValue(error);

            await toDoController.deleteToDo(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});