import{Router} from "express";
import { EmployeeController } from "../controllers/employeeController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.post('/register',EmployeeController.register);
router.post('/login',EmployeeController.login);
router.get('/',authenticateJWT,EmployeeController.getAll);
router.get('/:id',authenticateJWT,EmployeeController.getById);
router.put('/:id',authenticateJWT,EmployeeController.update);
router.delete('/:id',authenticateJWT,EmployeeController.delete);

export default router;