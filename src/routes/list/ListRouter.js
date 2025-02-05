import { Router } from 'express';
import { ListController } from '../../controllers/ListController';
import { ListService } from '../../services/ListService';
import { authMiddleware } from '../../middlewares/AuthMiddleware';

const router = Router();
const listService = new ListService();
const listController = new ListController(listService);

router.post('/', authMiddleware, listController.createList);
router.get('/',authMiddleware, listController.getLists);
router.get('/:id',authMiddleware, listController.getListById);
router.put('/:id',authMiddleware, listController.updateList);
router.delete('/:id',authMiddleware, listController.deleteList);

export { router as listRouter };