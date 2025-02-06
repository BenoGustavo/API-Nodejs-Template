import express from "express";
import { UserController } from "../../controllers/UserController";
import { authMiddleware } from "../../middlewares/AuthMiddleware";
import { UserService } from "../../services/UserService";

const router = express.Router();
const userService = new UserService();
const userController = new UserController(userService);

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/recover-password", userController.recoverPassword);

router.post(
	"/send-recover-password-token/:email",
	userController.sendRecoverPasswordToken
);

router.get("/activate-account/:token", userController.activateAccount);
router.get("/:id", authMiddleware, userController.getUserById);

router.get(
	"/username/:username",
	authMiddleware,
	userController.getUserByUsername
);

router.get("/email/:email", authMiddleware, userController.getUserByEmail);
router.get("/", userController.getAllUsers);

export { router as userRouter };
