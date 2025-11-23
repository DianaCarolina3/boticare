import { Router } from 'express';
import { createUserRouter } from './modules/user/user.routes.js';
// import { createRecipeRouter } from './modules/recipe/recipe.routes.js';

const router: Router = Router();

router.use('/users', createUserRouter());
// router.use('auth')
// router.use('/recipe', createRecipeRouter());

export default router;
