import { UserService } from "../services/UserService";
import { ResponseDto } from "../dto/response/ResponseDto";
import { Unauthorized } from "../errors/http/Unauthorized";
import { NotFound } from "../errors/http/NotFound";

export class UserController {
	/**
	 * UserService constructor
	 * @param {UserService} userService
	 */
	constructor(userService) {
		this.userService = userService;
		this.register = this.register.bind(this);
		this.login = this.login.bind(this);
		this.recoverPassword = this.recoverPassword.bind(this);
		this.getUserById = this.getUserById.bind(this);
		this.getUserByUsername = this.getUserByUsername.bind(this);
		this.getUserByEmail = this.getUserByEmail.bind(this);
		this.sendRecoverPasswordToken = this.sendRecoverPasswordToken.bind(this);
		this.getAllUsers = this.getAllUsers.bind(this);
		this.activateAccount = this.activateAccount.bind(this);
	}

	async register(req, res, next) {
		try {
			const { user, token } = await this.userService.register(
				req.body,
				req.get("origin")
			);

			const response = new ResponseDto(201, "User registered successfully", {
				token,
				user,
			});

			res.status(201).json(response);
		} catch (error) {
			next(error);
		}
	}

	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {import('express').NextFunction} next
	 */
	async activateAccount(req, res, next) {
		try {
			const { token } = req.params;
			const user = await this.userService.activateAccount(token);
			const response = new ResponseDto(
				200,
				"User activated successfully",
				user
			);
			res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	async login(req, res, next) {
		try {
			const { user, token } = await this.userService.login(req.body);

			const response = new ResponseDto(200, "User logged in successfully", {
				token,
				user,
			});

			res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	async recoverPassword(req, res, next) {
		try {
			const token = await this.userService.recoverPassword(req.body);

			const response = new ResponseDto(200, "Password recovery email sent", {
				token,
			});

			res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	async sendRecoverPasswordToken(req, res, next) {
		try {
			console.log(this.constructor.name);

			const token = await this.userService.sendRecoverPasswordToken(
				req.params.email
			);

			const response = new ResponseDto(
				200,
				"Password recovery email sent",
				token
			);

			res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	async getUserById(req, res, next) {
		try {
			const user = await this.userService.getUserById(req.params.id);

			if (!user) {
				throw new NotFound("User not found");
			}

			if (user.id !== req.user.id) {
				throw new Unauthorized("You can only access your own user information");
			}

			const response = new ResponseDto(200, "User found", user);

			res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	async getAllUsers(req, res, next) {
		try {
			const users = await this.userService.getAllUsers(
				req.query.page,
				req.query.limit,
				req.query.sort,
				req.query.order,
				req.query.search
			);

			const response = new ResponseDto(200, "Users found", users);

			res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	async getUserByUsername(req, res, next) {
		try {
			const user = await this.userService.getUserByUsername(
				req.params.username
			);

			if (!user) {
				throw new NotFound("User not found");
			}

			if (user.id !== req.user.id) {
				throw new Unauthorized("You can only access your own user information");
			}

			const response = new ResponseDto(200, "User found", user);

			res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	async getUserByEmail(req, res, next) {
		try {
			const user = await this.userService.getUserByEmail(req.params.email);

			if (!user) {
				throw new NotFound("User not found");
			}

			if (user.id !== req.user.id) {
				throw new Unauthorized("You can only access your own user information");
			}

			const response = new ResponseDto(200, "User found", user);

			res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}
}
