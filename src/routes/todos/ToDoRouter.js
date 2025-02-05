import { Router } from "express";
import { ToDoController } from "../../controllers/ToDoController";
import { ToDoService } from "../../services/ToDoService";
import { authMiddleware } from '../../middlewares/AuthMiddleware';

const router = Router();
const toDoService = new ToDoService();
const toDoController = new ToDoController(toDoService);

router.post("/",authMiddleware,toDoController.createToDo);
router.get("/",authMiddleware,toDoController.getToDos);
router.get("/:id", authMiddleware,toDoController.getToDoById);
router.get("/list/:id",authMiddleware,toDoController.getToDosByListId);
router.put("/:id",authMiddleware,toDoController.updateToDo);
router.delete("/:id",authMiddleware,toDoController.deleteToDo);

export { router as toDoRouter };