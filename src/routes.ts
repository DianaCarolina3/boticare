import { Router } from "express";
import { createUserRouter } from "./modules/user/user.routes.js";

const router: Router = Router()

router.use('users', createUserRouter)

export default router