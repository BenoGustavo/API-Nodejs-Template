import { User } from '../database/models/UserSchema';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { adaptMongooseError } from '../errors/database/AdaptMongooseError';
import { JwtService } from './JwtService';
import { UserRegisterDto } from '../dto/user/UserRegisterDto';
import { UserLoginDto } from '../dto/user/UserLoginDto';
import { UserResetPasswordDto } from '../dto/user/UserResetPasswordDto';
import { BadRequest } from '../errors/http/BadRequest';
import { NotFound } from '../errors/http/NotFound';

export class UserService {
    /**
     * Register a new user
     * @param {UserRegisterDto} data 
    **/
    async register(data) {
        try {
            if (data.password !== data.confirmPassword) {
                throw new BadRequest('Passwords do not match');
            }

            const user = new User();
            user.username = data.username;
            user.email = data.email;
            user.password = data.password;
            user.lists = [];


            await user.save();
            const token = JwtService.generateToken(user);
            return { user, token };
        } catch (error) {
            throw adaptMongooseError(error);
        }
    }

    /**
     * Try to login a user
     * @param {UserLoginDto} data 
    **/
    async login(data) {
        const { email, password } = data;

        const user = await User.findOne({ email });
        if (!user) {
            throw new BadRequest('User not found');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new BadRequest('Invalid credentials');
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
            throw new NotFound('User not found');
        }
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        // Should send an email with the token
        console.log(
            `\n🔑 Password recovery token for ${user.email}: ${token} 🔑'`
        )

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
            throw new BadRequest('Passwords do not match');
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new BadRequest('Password reset token is invalid or has expired');
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
    async getAllUsers(page = 1, limit = 10, sort = 'createdAt', order = 'desc', search = '') {
        const query = {};
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .sort({ [sort]: order })
            .skip((page - 1) * limit)
            .limit(limit);

        return users;
    }
}