import { Router } from "express";
import { createUserRouter } from "./modules/user/user.routes.ts";

const router: Router = Router()

router.use('/users', createUserRouter())

export default router