import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { ResponseDto } from "../dto/response/ResponseDto";
import { Unauthorized } from "../errors/http/Unauthorized";
import { NotFound } from "../errors/http/NotFound";
import emailSenderInstance from "../components/EmailSender";

jest.mock("../services/UserService");
jest.mock("../components/EmailSender");

describe("UserController", () => {
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
			get: jest.fn(),
			user: { id: "userId" },
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		next = jest.fn();
	});

	describe("register", () => {
		it("should register a user and return a response", async () => {
			const user = { id: "userId" };
			const token = "token";
			userService.register.mockResolvedValue({ user, token });

			await userController.register(req, res, next);

			expect(userService.register).toHaveBeenCalledWith(
				req.body,
				req.get("origin")
			);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(
				new ResponseDto(201, "User registered successfully", { token, user })
			);
		});

		it("should call next with an error if registration fails", async () => {
			const error = new Error("Registration failed");
			userService.register.mockRejectedValue(error);

			await userController.register(req, res, next);

			expect(next).toHaveBeenCalledWith(error);
		});
	});

	describe("activateAccount", () => {
		it("should activate a user account and return a response", async () => {
			const user = { id: "userId" };
			req.params.token = "token";
			userService.activateAccount.mockResolvedValue(user);

			await userController.activateAccount(req, res, next);

			expect(userService.activateAccount).toHaveBeenCalledWith(
				req.params.token
			);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				new ResponseDto(200, "User activated successfully", user)
			);
		});

		it("should call next with an error if activation fails", async () => {
			const error = new Error("Activation failed");
			userService.activateAccount.mockRejectedValue(error);

			await userController.activateAccount(req, res, next);

			expect(next).toHaveBeenCalledWith(error);
		});
	});

	describe("login", () => {
		it("should log in a user and return a response", async () => {
			const user = { id: "userId" };
			const token = "token";
			userService.login.mockResolvedValue({ user, token });

			await userController.login(req, res, next);

			expect(userService.login).toHaveBeenCalledWith(req.body);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				new ResponseDto(200, "User logged in successfully", { token, user })
			);
		});

		it("should call next with an error if login fails", async () => {
			const error = new Error("Login failed");
			userService.login.mockRejectedValue(error);

			await userController.login(req, res, next);

			expect(next).toHaveBeenCalledWith(error);
		});
	});

	describe("recoverPassword", () => {
		it("should send a password recovery email and return a response", async () => {
			const token = "token";
			userService.recoverPassword.mockResolvedValue(token);

			await userController.recoverPassword(req, res, next);

			expect(userService.recoverPassword).toHaveBeenCalledWith(req.body);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				new ResponseDto(200, "Password recovery email sent", { token })
			);
		});

		it("should call next with an error if password recovery fails", async () => {
			const error = new Error("Password recovery failed");
			userService.recoverPassword.mockRejectedValue(error);

			await userController.recoverPassword(req, res, next);

			expect(next).toHaveBeenCalledWith(error);
		});
	});

	describe("sendRecoverPasswordToken", () => {
		it("should send a password recovery token and return a response", async () => {
			const token = "token";
			req.params.email = "email@example.com";
			userService.sendRecoverPasswordToken.mockResolvedValue(token);

			await userController.sendRecoverPasswordToken(req, res, next);

			expect(userService.sendRecoverPasswordToken).toHaveBeenCalledWith(
				req.params.email
			);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				new ResponseDto(200, "Password recovery email sent", token)
			);
		});

		it("should call next with an error if sending token fails", async () => {
			const error = new Error("Sending token failed");
			userService.sendRecoverPasswordToken.mockRejectedValue(error);

			await userController.sendRecoverPasswordToken(req, res, next);

			expect(next).toHaveBeenCalledWith(error);
		});
	});

	describe("getUserById", () => {
		it("should return a user if found and authorized", async () => {
			const user = { id: "userId" };
			req.params.id = "userId";
			userService.getUserById.mockResolvedValue(user);

			await userController.getUserById(req, res, next);

			expect(userService.getUserById).toHaveBeenCalledWith(req.params.id);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				new ResponseDto(200, "User found", user)
			);
		});

		it("should throw NotFound if user is not found", async () => {
			req.params.id = "userId";
			userService.getUserById.mockResolvedValue(null);

			await userController.getUserById(req, res, next);

			expect(next).toHaveBeenCalledWith(new NotFound("User not found"));
		});

		it("should throw Unauthorized if user is not authorized", async () => {
			const user = { id: "anotherUserId" };
			req.params.id = "userId";
			userService.getUserById.mockResolvedValue(user);

			await userController.getUserById(req, res, next);

			expect(next).toHaveBeenCalledWith(
				new Unauthorized("You can only access your own user information")
			);
		});
	});

	describe("getAllUsers", () => {
		it("should return all users", async () => {
			const users = [{ id: "userId" }];
			userService.getAllUsers.mockResolvedValue(users);

			await userController.getAllUsers(req, res, next);

			expect(userService.getAllUsers).toHaveBeenCalledWith(
				req.query.page,
				req.query.limit,
				req.query.sort,
				req.query.order,
				req.query.search
			);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				new ResponseDto(200, "Users found", users)
			);
		});

		it("should call next with an error if fetching users fails", async () => {
			const error = new Error("Fetching users failed");
			userService.getAllUsers.mockRejectedValue(error);

			await userController.getAllUsers(req, res, next);

			expect(next).toHaveBeenCalledWith(error);
		});
	});

	describe("getUserByUsername", () => {
		it("should return a user if found and authorized", async () => {
			const user = { id: "userId" };
			req.params.username = "username";
			userService.getUserByUsername.mockResolvedValue(user);

			await userController.getUserByUsername(req, res, next);

			expect(userService.getUserByUsername).toHaveBeenCalledWith(
				req.params.username
			);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				new ResponseDto(200, "User found", user)
			);
		});

		it("should throw NotFound if user is not found", async () => {
			req.params.username = "username";
			userService.getUserByUsername.mockResolvedValue(null);

			await userController.getUserByUsername(req, res, next);

			expect(next).toHaveBeenCalledWith(new NotFound("User not found"));
		});

		it("should throw Unauthorized if user is not authorized", async () => {
			const user = { id: "anotherUserId" };
			req.params.username = "username";
			userService.getUserByUsername.mockResolvedValue(user);

			await userController.getUserByUsername(req, res, next);

			expect(next).toHaveBeenCalledWith(
				new Unauthorized("You can only access your own user information")
			);
		});
	});

	describe("getUserByEmail", () => {
		it("should return a user if found and authorized", async () => {
			const user = { id: "userId" };
			req.params.email = "email@example.com";
			userService.getUserByEmail.mockResolvedValue(user);

			await userController.getUserByEmail(req, res, next);

			expect(userService.getUserByEmail).toHaveBeenCalledWith(req.params.email);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(
				new ResponseDto(200, "User found", user)
			);
		});

		it("should throw NotFound if user is not found", async () => {
			req.params.email = "email@example.com";
			userService.getUserByEmail.mockResolvedValue(null);

			await userController.getUserByEmail(req, res, next);

			expect(next).toHaveBeenCalledWith(new NotFound("User not found"));
		});

		it("should throw Unauthorized if user is not authorized", async () => {
			const user = { id: "anotherUserId" };
			req.params.email = "email@example.com";
			userService.getUserByEmail.mockResolvedValue(user);

			await userController.getUserByEmail(req, res, next);

			expect(next).toHaveBeenCalledWith(
				new Unauthorized("You can only access your own user information")
			);
		});
	});
});
