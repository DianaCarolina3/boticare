import { Router } from 'express';
import { createUserRouter } from './modules/user/user.routes.js';
import { createAuthRouter } from './modules/auth/auth.routes.js';
import { createCategoryRouter } from './modules/category/category.routes.js';
// import { createRecipeRouter } from './modules/recipe/recipe.routes.js';

const router: Router = Router();

router.use('/users', createUserRouter());
router.use('/auth', createAuthRouter());
router.use('/category', createCategoryRouter());
// router.use('/recipe', createRecipeRouter());

export default router;
