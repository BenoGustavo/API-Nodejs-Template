import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { ResponseDto } from '../dto/response/ResponseDto';
import { Unauthorized } from '../errors/http/Unauthorized';
import { NotFound } from '../errors/http/NotFound';

jest.mock('../services/UserService');

describe('UserController', () => {
    let userService;
    let userController;
    let req;
    let res;
    let next;

    beforeEach(() => {
        userService = new UserService();
        userController = new UserController(userService);
        req = {
            body: {},
            params: {},
            query: {},
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('register', () => {
        it('should register a user and return a response', async () => {
            const user = { id: 1, username: 'testuser' };
            const token = 'testtoken';
            userService.register.mockResolvedValue({ user, token });

            req.body = { username: 'testuser', password: 'password' };

            await userController.register(req, res, next);

            expect(userService.register).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(new ResponseDto(201, 'User registered successfully', { token, user }));
        });

        it('should call next with an error if registration fails', async () => {
            const error = new Error('Registration failed');
            userService.register.mockRejectedValue(error);

            await userController.register(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('login', () => {
        it('should log in a user and return a response', async () => {
            const user = { id: 1, username: 'testuser' };
            const token = 'testtoken';
            userService.login.mockResolvedValue({ user, token });

            req.body = { username: 'testuser', password: 'password' };

            await userController.login(req, res, next);

            expect(userService.login).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(new ResponseDto(200, 'User logged in successfully', { token, user }));
        });

        it('should call next with an error if login fails', async () => {
            const error = new Error('Login failed');
            userService.login.mockRejectedValue(error);

            await userController.login(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('recoverPassword', () => {
        it('should recover password and return a response', async () => {
            const token = 'testtoken';
            userService.recoverPassword.mockResolvedValue(token);

            req.body = { email: 'test@example.com' };

            await userController.recoverPassword(req, res, next);

            expect(userService.recoverPassword).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(new ResponseDto(200, 'Password recovery email sent', { token }));
        });

        it('should call next with an error if password recovery fails', async () => {
            const error = new Error('Password recovery failed');
            userService.recoverPassword.mockRejectedValue(error);

            await userController.recoverPassword(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('sendRecoverPasswordToken', () => {
        it('should send recover password token and return a response', async () => {
            const token = 'testtoken';
            userService.sendRecoverPasswordToken.mockResolvedValue(token);

            req.params.email = 'test@example.com';

            await userController.sendRecoverPasswordToken(req, res, next);

            expect(userService.sendRecoverPasswordToken).toHaveBeenCalledWith(req.params.email);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(new ResponseDto(200, 'Password recovery email sent', token));
        });

        it('should call next with an error if sending recover password token fails', async () => {
            const error = new Error('Sending recover password token failed');
            userService.sendRecoverPasswordToken.mockRejectedValue(error);

            await userController.sendRecoverPasswordToken(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getUserById', () => {
        it('should get user by id and return a response', async () => {
            const user = { id: 1, username: 'testuser' };
            userService.getUserById.mockResolvedValue(user);

            req.params.id = 1;
            req.user.id = 1;

            await userController.getUserById(req, res, next);

            expect(userService.getUserById).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(new ResponseDto(200, 'User found', user));
        });

        it('should throw NotFound error if user is not found', async () => {
            userService.getUserById.mockResolvedValue(null);

            req.params.id = 1;

            await userController.getUserById(req, res, next);

            expect(next).toHaveBeenCalledWith(new NotFound('User not found'));
        });

        it('should throw Unauthorized error if user id does not match', async () => {
            const user = { id: 2, username: 'testuser' };
            userService.getUserById.mockResolvedValue(user);

            req.params.id = 1;
            req.user.id = 1;

            await userController.getUserById(req, res, next);

            expect(next).toHaveBeenCalledWith(new Unauthorized('You can only access your own user information'));
        });
    });

    describe('getAllUsers', () => {
        it('should get all users and return a response', async () => {
            const users = [{ id: 1, username: 'testuser' }];
            userService.getAllUsers.mockResolvedValue(users);

            req.query = { page: 1, limit: 10, sort: 'username', order: 'asc', search: 'test' };

            await userController.getAllUsers(req, res, next);

            expect(userService.getAllUsers).toHaveBeenCalledWith(req.query.page, req.query.limit, req.query.sort, req.query.order, req.query.search);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(new ResponseDto(200, 'Users found', users));
        });

        it('should call next with an error if getting all users fails', async () => {
            const error = new Error('Getting all users failed');
            userService.getAllUsers.mockRejectedValue(error);

            await userController.getAllUsers(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getUserByUsername', () => {
        it('should get user by username and return a response', async () => {
            const user = { id: 1, username: 'testuser' };
            userService.getUserByUsername.mockResolvedValue(user);

            req.params.username = 'testuser';
            req.user.id = 1;

            await userController.getUserByUsername(req, res, next);

            expect(userService.getUserByUsername).toHaveBeenCalledWith(req.params.username);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(new ResponseDto(200, 'User found', user));
        });

        it('should throw NotFound error if user is not found', async () => {
            userService.getUserByUsername.mockResolvedValue(null);

            req.params.username = 'testuser';

            await userController.getUserByUsername(req, res, next);

            expect(next).toHaveBeenCalledWith(new NotFound('User not found'));
        });

        it('should throw Unauthorized error if user id does not match', async () => {
            const user = { id: 2, username: 'testuser' };
            userService.getUserByUsername.mockResolvedValue(user);

            req.params.username = 'testuser';
            req.user.id = 1;

            await userController.getUserByUsername(req, res, next);

            expect(next).toHaveBeenCalledWith(new Unauthorized('You can only access your own user information'));
        });
    });

    describe('getUserByEmail', () => {
        it('should get user by email and return a response', async () => {
            const user = { id: 1, email: 'test@example.com' };
            userService.getUserByEmail.mockResolvedValue(user);

            req.params.email = 'test@example.com';
            req.user.id = 1;

            await userController.getUserByEmail(req, res, next);

            expect(userService.getUserByEmail).toHaveBeenCalledWith(req.params.email);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(new ResponseDto(200, 'User found', user));
        });

        it('should throw NotFound error if user is not found', async () => {
            userService.getUserByEmail.mockResolvedValue(null);

            req.params.email = 'test@example.com';

            await userController.getUserByEmail(req, res, next);

            expect(next).toHaveBeenCalledWith(new NotFound('User not found'));
        });

        it('should throw Unauthorized error if user id does not match', async () => {
            const user = { id: 2, email: 'test@example.com' };
            userService.getUserByEmail.mockResolvedValue(user);

            req.params.email = 'test@example.com';
            req.user.id = 1;

            await userController.getUserByEmail(req, res, next);

            expect(next).toHaveBeenCalledWith(new Unauthorized('You can only access your own user information'));
        });
    });
});