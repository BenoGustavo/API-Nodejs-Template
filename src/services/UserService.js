import { User } from "../database/models/UserSchema";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { adaptMongooseError } from "../errors/database/AdaptMongooseError";
import { JwtService } from "./JwtService";
import { UserRegisterDto } from "../dto/user/UserRegisterDto";
import { UserLoginDto } from "../dto/user/UserLoginDto";
import { UserResetPasswordDto } from "../dto/user/UserResetPasswordDto";
import { BadRequest } from "../errors/http/BadRequest";
import { NotFound } from "../errors/http/NotFound";
import { emailSenderInstance } from "../components/EmailSender";

export class UserService {
	/**
	 * Register a new user
	 * @param {UserRegisterDto} data
	 * @param {string} baseUrl
	 **/
	async register(data, baseUrl) {
		try {
			if (data.password !== data.confirmPassword) {
				throw new BadRequest("Passwords do not match");
			}

			const token = crypto.randomBytes(35).toString("hex");

			const user = new User();
			user.username = data.username;
			user.email = data.email;
			user.password = data.password;
			user.lists = [];
			user.accountActivationToken = token;
			user.accountActivationTokenExpires = Date.now() + 3600000; // 1 hour

			// Validates if the user already exists and the account is activated
			const existingUser = await User.findOne({ email: data.email });
			if (existingUser) {
				if (existingUser.isAccountActivated) {
					throw new BadRequest("Email already exists");
				}
				await existingUser.deleteOne();
			}

			await user.save();
			const jwtToken = JwtService.generateToken(user);

			// Should send an email with the token
			//TODO: SHOULD SEND THE USER TO THE FRONT-END TO ACTIVATE THE ACCOUNT
			const accountActivationUrl = `${baseUrl}/api/user/activate-account/${token}`;

			const email = emailSenderInstance.createNewEmail(
				user.email,
				"Account activation",
				`Hello ${user.username},\n\n` +
					`Please click on the following link to activate your account:\n\n` +
					`${accountActivationUrl}\n\n` +
					"If you did not request this, please ignore this email and your password will remain unchanged.\n",
				`Hello <b>${user.username}</b>,<br><br>` +
					`Please click on the following link to activate your account:<br><br>` +
					`<a href="${accountActivationUrl}">Activate account</a><br><br>` +
					"If you did not request this, please ignore this email and your password will remain unchanged.<br>"
			);

			emailSenderInstance.sendEmail(email);

			return { user, jwtToken };
		} catch (error) {
			throw adaptMongooseError(error);
		}
	}

	/**
	 *
	 * @param {string} token
	 * @returns
	 */
	async activateAccount(token) {
		const user = await User.findOne({
			accountActivationToken: token,
			accountActivationTokenExpires: { $gt: Date.now() },
		});

		if (!user) {
			throw new NotFound("Account activation token is invalid or has expired");
		}

		user.isAccountActivated = true;

		try {
			await user.save();
		} catch (error) {
			throw adaptMongooseError(error);
		}

		return user;
	}

	/**
	 * Try to login a user
	 * @param {UserLoginDto} data
	 **/
	async login(data) {
		const { email, password } = data;

		const user = await User.findOne({ email });

		if (!user) {
			throw new BadRequest("User not found");
		}

		// Check if the account is not activated and the token has expired, then delete the user
		if (
			!user.isAccountActivated &&
			user.accountActivationTokenExpires < Date.now()
		) {
			await user.deleteOne();
			throw new BadRequest("User not found");
		}

		if (!user.isAccountActivated) {
			throw new BadRequest("Account is not activated, please check your email");
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new BadRequest("Invalid credentials");
		}
		const token = JwtService.generateToken(user);
		return { user, token };
	}

	/**
	 * Send the recover password token to the user by email
	 * @param {string} email
	 **/
	async sendRecoverPasswordToken(email) {
		const user = await User.findOne({ email });
		if (!user) {
			throw new NotFound("User not found");
		}
		const token = crypto.randomBytes(15).toString("hex");
		user.resetPasswordToken = token;
		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

		// Should send an email with the token
		if (process.env.NODE_ENV === "development") {
			console.log(
				`\n🔑 Password recovery token for ${user.email}: ${token} 🔑'`
			);
		}

		await user.save();
		return token;
	}

	/**
	 * Resets the user password
	 * @param {UserResetPasswordDto} data
	 **/
	async recoverPassword(data) {
		const { token, password, confirmPassword } = data;

		if (password !== confirmPassword) {
			throw new BadRequest("Passwords do not match");
		}

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() },
		});

		if (!user) {
			throw new BadRequest("Password reset token is invalid or has expired");
		}

		user.password = password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;

		try {
			await user.save();
		} catch (error) {
			throw adaptMongooseError(error);
		}

		return user;
	}

	/**
	 * get a user by id
	 * @param {string} id
	 **/
	async getUserById(id) {
		return await User.findById(id);
	}

	/**
	 * get a user by username
	 * @param {string} username
	 **/
	async getUserByUsername(username) {
		return await User.findOne({ username });
	}

	/**
	 * get a user by email
	 * @param {string} email
	 **/
	async getUserByEmail(email) {
		return await User.findOne({ email });
	}

	/**
	 * get all users
	 * @param {number} page
	 * @param {number} limit
	 * @param {string} sort
	 * @param {string} order
	 * @param {string} search
	 **/
	async getAllUsers(
		page = 1,
		limit = 10,
		sort = "createdAt",
		order = "desc",
		search = ""
	) {
		const query = {};
		if (search) {
			query.$or = [
				{ username: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
			];
		}

		const users = await User.find(query)
			.sort({ [sort]: order })
			.skip((page - 1) * limit)
			.limit(limit);

		return users;
	}
}
