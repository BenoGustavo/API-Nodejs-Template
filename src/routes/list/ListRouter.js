import { Router } from 'express';
import { ListController } from '../../controllers/ListController';
import { ListService } from '../../services/ListService';
import { authMiddleware } from '../../middlewares/AuthMiddleware';

const router = Router();
const listService = new ListService();
const listController = new ListController(listService);

router.post('/', authMiddleware, listController.createList);
router.get('/', (req, res, next) => listController.getLists(req, res, next));
router.get('/:id', (req, res, next) => listController.getListById(req, res, next));
router.put('/:id', (req, res, next) => listController.updateList(req, res, next));
router.delete('/:id', (req, res, next) => listController.deleteList(req, res, next));

export { router as listRouter };