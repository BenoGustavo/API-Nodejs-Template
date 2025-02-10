import { ToDo } from "../database/models/TodoSchema";
import { List } from "../database/models/ListSchema";
import { TodoDto } from "../dto/TodoDto";
import mongoose from "mongoose";
import { User } from "../database/models/UserSchema";
import { NotFound } from "../errors/http/NotFound";
import { Unauthorized } from "../errors/http/Unauthorized";
import { adaptMongooseError } from "../errors/database/AdaptMongooseError";
import { Forbidden } from "../errors/http/Forbidden";

export class ToDoService {
	constructor() {
		this.createToDo = this.createToDo.bind(this);
		this.getToDos = this.getToDos.bind(this);
		this.getToDoById = this.getToDoById.bind(this);
		this.updateToDo = this.updateToDo.bind(this);
		this.deleteToDo = this.deleteToDo.bind(this);
	}

	/**
	 * Creates a new ToDo
	 * @param {string} listId
	 * @param {string} userRequesterId
	 * @param {TodoDto} data
	 * @returns {ToDo}
	 */
	async createToDo(listId, userRequesterId, data) {
		try {
			const list = await List.findById(listId);

			if (list.user != userRequesterId) {
				throw new Unauthorized(
					"You are not allowed to create a ToDo in this list, try creating a new list"
				);
			}

			if (!list) {
				throw new NotFound("List not found");
			}

			const toDo = new ToDo(data);

			list.items.push(toDo);

			await list.save();
			return await toDo.save();
		} catch (error) {
			throw adaptMongooseError(error);
		}
	}

	/**
	 * Gets all ToDos
	 * @param {String} userRequesterId
	 *
	 * @returns {ToDo[]}
	 */
	async getToDos(userRequesterId) {
		const user = await User.findById(userRequesterId);

		if (!(user.role === "admin")) {
			throw new Forbidden(
				"You're not authorized to access this route, because you don't have the necessary permissions"
			);
		}

		return await ToDo.find();
	}

	/**
	 * Gets all ToDos from a list
	 *
	 * @param {string} userRequesterId
	 * @param {string} id
	 * @returns {List<ToDo[]>}
	 */
	async getToDosByListId(userRequesterId, id) {
		try {
			const list = await List.findById(id).populate("items");

			if (!list) {
				throw new NotFound(
					"To-do List not found, parhaps it doesn't exists or the id might be invalid"
				);
			}

			if (list.user != userRequesterId) {
				throw new Unauthorized(
					"You are not allowed to view this list because its not yours, try creating a new list"
				);
			}

			return list;
		} catch (error) {
			throw adaptMongooseError(error);
		}
	}

	/**
	 * Gets a ToDo by id
	 *
	 * @param {string} userRequesterId
	 * @param {string} id
	 * @returns {ToDo}
	 */
	async getToDoById(userRequesterId, id) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new NotFound(
				"To-do not found, parhaps it doesn't exists or the id might be invalid"
			);
		}

		const toDo = await ToDo.findById(id);
		const list = await List.findOne({ items: id });

		if (!toDo) {
			throw new NotFound("ToDo not found");
		}

		if (list.user != userRequesterId) {
			throw new Unauthorized("You are not allowed to view this ToDo");
		}

		return toDo;
	}

	/**
	 * Updates a ToDo
	 * @param {string} id
	 * @param {string} userRequesterId
	 * @param {TodoDto} data
	 * @returns {ToDo}
	 */
	async updateToDo(id, userRequesterId, data) {
		try {
			const toDoList = await List.findOne({ items: id });
			const toDoOwner = toDoList.user ?? null;

			if (!toDoOwner) {
				throw new NotFound("ToDo not found");
			}

			if (toDoOwner._id.toString() !== userRequesterId) {
				throw new Unauthorized("You are not allowed to update this ToDo");
			}

			const toDo = await ToDo.findByIdAndUpdate(id, data, {
				new: true,
				runValidators: true,
			});

			if (!toDo) {
				throw new NotFound(
					"To-do not found, parhaps it doesn't exists or the id might be invalid"
				);
			}

			return toDo;
		} catch (error) {
			throw adaptMongooseError(error);
		}
	}

	/**
	 * Deletes a ToDo
	 * @param {string} userRequesterId
	 * @param {string} id
	 * @returns {void}
	 */
	async deleteToDo(userRequesterId, id) {
		try {
			const toDoList = await List.findOne({ items: id });
			const toDoOwner = toDoList.user ?? null;

			if (!toDoOwner) {
				throw new NotFound("ToDo not found");
			}

			if (toDoOwner._id.toString() !== userRequesterId) {
				throw new Unauthorized("You are not allowed to update this ToDo");
			}

			const toDo = await ToDo.findOneAndDelete(id);

			if (!toDo) {
				throw new NotFound(
					"To-do not found, parhaps it doesn't exists or the id might be invalid"
				);
			}

			return toDo;
		} catch (error) {
			throw adaptMongooseError(error);
		}
	}
}
