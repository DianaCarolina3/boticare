import { Router } from "express";
import { createUserRouter } from "./modules/user/user.routes.js";
const router = Router();
router.use('users', createUserRouter);
export default router;
//# sourceMappingURL=routes.js.map