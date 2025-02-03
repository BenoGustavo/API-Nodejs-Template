import { ToDoService } from "../services/ToDoService";

export class ToDoController {

    /**
     * ListController constructor
     * @param {ToDoService} toDoService
    */
    constructor(toDoService) {
        this.toDoService = toDoService;
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
            const toDo = await this.toDoService.createToDo(req.body);
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
              const toDos = await this.toDoService.getToDosByListId(req.params.id);
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
            const toDo = await this.toDoService.getToDoById(req.params.id);
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
            const toDo = await this.toDoService.updateToDo(req.params.id, req.body);
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
            await this.toDoService.deleteToDo(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}