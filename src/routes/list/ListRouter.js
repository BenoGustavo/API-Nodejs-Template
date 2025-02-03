import { Router } from 'express';
import { ListController } from '../../controllers/ListController';
import { ListService } from '../../services/ListService';

const router = Router();
const listService = new ListService();
const listController = new ListController(listService);

router.post('/', (req, res, next) => listController.createList(req, res, next));
router.get('/', (req, res, next) => listController.getLists(req, res, next));
router.get('/:id', (req, res, next) => listController.getListById(req, res, next));
router.put('/:id', (req, res, next) => listController.updateList(req, res, next));
router.delete('/:id', (req, res, next) => listController.deleteList(req, res, next));

export { router as listRouter };