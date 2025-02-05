import { ToDoService } from "../services/ToDoService";

export class ToDoController {

    /**
     * ListController constructor
     * @param {ToDoService} toDoService
    */
    constructor(toDoService) {
        this.toDoService = toDoService;

        this.createToDo = this.createToDo.bind(this);
        this.getToDos = this.getToDos.bind(this);
        this.getToDosByListId = this.getToDosByListId.bind(this);
        this.getToDoById = this.getToDoById.bind(this);
        this.updateToDo = this.updateToDo.bind(this);
        this.deleteToDo = this.deleteToDo.bind(this);
    }

    /**
     * 
     *  Creates a new ToDo
     * 
     * @param {Request} req 
     * @param {Response} res 
     * 
     * @returns {Promise<Response>}
    */
    async createToDo(req, res, next) {
        try {
            const toDo = await this.toDoService.createToDo(req.params.listId,req.user.id,req.body);
            res.status(201).json(toDo);
        } catch (error) {
            next(error);
        }
    }

    /**
     * 
     *  Retrieves all ToDos from database
     * 
     * @param {Request} req 
     * @param {Response} res 
     * 
     * @returns {Promise<Response>}
    */
   async getToDos(req, res, next) {
       try {
           const toDos = await this.toDoService.getToDos();
           res.status(200).json(toDos);
       } catch (error) {
           next(error);
       }
   }

   async getToDosByListId(req, res, next) {
         try {
              const toDos = await this.toDoService.getToDosByListId(req.user.id,req.params.id);

              res.status(200).json(toDos);
         } catch (error) {
              next(error);
         }
   }

    /**
     * 
     * Get a ToDo by id
     * 
     * @param {Request} req 
     * @param {Response} res 
     * 
     * @returns {Promise<Response>}
    */
    async getToDoById(req, res, next) {
        try {
            const toDo = await this.toDoService.getToDoById(req.user.id,req.params.id);
            if (!toDo) {
                return res.status(404).json({ error: 'ToDo not found' });
            }
            res.status(200).json(toDo);
        } catch (error) {
            next(error);
        }
    }

    /**
     * 
     * Updates a ToDo
     * 
     * @param {Request} req 
     * @param {Response} res 
     * 
     * @returns {Promise<Response>}
    */
    async updateToDo(req, res, next) {
        try {
            const toDo = await this.toDoService.updateToDo(req.params.id,req.user.id,req.body);

            res.status(200).json(toDo);
        } catch (error) {
            next(error);
        }
    }

    /**
     * 
     * Deletes a ToDo
     * 
     * @param {Request} req 
     * @param {Response} res 
     * 
     * @returns {Promise<Response>}
    */
    async deleteToDo(req, res, next) {
        try {
            const toDo = await this.toDoService.deleteToDo(req.user.id,req.params.id);

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}