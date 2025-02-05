import { ToDoController } from '../controllers/ToDoController';
import { ToDoService } from '../services/ToDoService';
import { jest } from '@jest/globals';

describe('ToDoController', () => {
    let toDoService;
    let toDoController;
    let req;
    let res;
    let next;

    beforeEach(() => {
        toDoService = new ToDoService();
        toDoController = new ToDoController(toDoService);
        req = { body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
        next = jest.fn();
    });

    describe('createToDo', () => {
        it('should create a new ToDo and return 201 status', async () => {
            const toDo = { id: 1, title: 'Test ToDo' };
            toDoService.createToDo = jest.fn().mockResolvedValue(toDo);
            req.body = { title: 'Test ToDo' };

            await toDoController.createToDo(req, res, next);

            expect(toDoService.createToDo).toHaveBeenCalledWith(req.params.listId,req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(toDo);
        });

        it('should call next with error if service fails', async () => {
            const error = new Error('Service Error');
            toDoService.createToDo = jest.fn().mockRejectedValue(error);

            await toDoController.createToDo(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getToDos', () => {
        it('should retrieve all ToDos and return 200 status', async () => {
            const toDos = [{ id: 1, title: 'Test ToDo' }];
            toDoService.getToDos = jest.fn().mockResolvedValue(toDos);

            await toDoController.getToDos(req, res, next);

            expect(toDoService.getToDos).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(toDos);
        });

        it('should call next with error if service fails', async () => {
            const error = new Error('Service Error');
            toDoService.getToDos = jest.fn().mockRejectedValue(error);

            await toDoController.getToDos(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getToDosByListId', () => {
        it('should retrieve ToDos by list id and return 200 status', async () => {
            const toDos = [{ id: 1, title: 'Test ToDo' }];
            toDoService.getToDosByListId = jest.fn().mockResolvedValue(toDos);
            req.params.id = 1;

            await toDoController.getToDosByListId(req, res, next);

            expect(toDoService.getToDosByListId).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(toDos);
        });

        it('should call next with error if service fails', async () => {
            const error = new Error('Service Error');
            toDoService.getToDosByListId = jest.fn().mockRejectedValue(error);

            await toDoController.getToDosByListId(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getToDoById', () => {
        it('should retrieve a ToDo by id and return 200 status', async () => {
            const toDo = { id: 1, title: 'Test ToDo' };
            toDoService.getToDoById = jest.fn().mockResolvedValue(toDo);
            req.params.id = 1;

            await toDoController.getToDoById(req, res, next);

            expect(toDoService.getToDoById).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(toDo);
        });

        it('should return 404 if ToDo not found', async () => {
            toDoService.getToDoById = jest.fn().mockResolvedValue(null);
            req.params.id = 1;

            await toDoController.getToDoById(req, res, next);

            expect(toDoService.getToDoById).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'ToDo not found' });
        });

        it('should call next with error if service fails', async () => {
            const error = new Error('Service Error');
            toDoService.getToDoById = jest.fn().mockRejectedValue(error);

            await toDoController.getToDoById(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('updateToDo', () => {
        it('should update a ToDo and return 200 status', async () => {
            const toDo = { id: 1, title: 'Updated ToDo' };
            toDoService.updateToDo = jest.fn().mockResolvedValue(toDo);
            req.params.id = 1;
            req.body = { title: 'Updated ToDo' };

            await toDoController.updateToDo(req, res, next);

            expect(toDoService.updateToDo).toHaveBeenCalledWith(req.params.id, req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(toDo);
        });

        it('should call next with error if service fails', async () => {
            const error = new Error('Service Error');
            toDoService.updateToDo = jest.fn().mockRejectedValue(error);

            await toDoController.updateToDo(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteToDo', () => {
        it('should delete a ToDo and return 204 status', async () => {
            toDoService.deleteToDo = jest.fn().mockResolvedValue();
            req.params.id = 1;

            await toDoController.deleteToDo(req, res, next);

            expect(toDoService.deleteToDo).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('should call next with error if service fails', async () => {
            const error = new Error('Service Error');
            toDoService.deleteToDo = jest.fn().mockRejectedValue(error);

            await toDoController.deleteToDo(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});