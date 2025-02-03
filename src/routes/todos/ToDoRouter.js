import { Router } from "express";
import { ToDoController } from "../../controllers/ToDoController";
import { ToDoService } from "../../services/ToDoService";

const router = Router();
const toDoService = new ToDoService();
const toDoController = new ToDoController(toDoService);

router.post("/", (req, res, next) => toDoController.createToDo(req, res, next));
router.get("/", (req, res, next) => toDoController.getToDos(req, res, next));
router.get("/:id", (req, res, next) => toDoController.getToDoById(req, res, next));
router.get("/list/:id", (req, res, next) => toDoController.getToDosByListId(req, res, next));
router.put("/:id", (req, res, next) => toDoController.updateToDo(req, res, next));
router.delete("/:id", (req, res, next) => toDoController.deleteToDo(req, res, next));

export { router as toDoRouter };