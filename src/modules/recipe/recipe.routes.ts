import { Router } from 'express';
import { RecipeController } from './recipe.controller.js';
import { RecipeService } from './recipe.service.js';
import { validate } from '../../core/middlewares/validation.middleware.js';
import { authenticateJWT, authorizeRoles } from '../../core/middlewares/auth.middleware.js';
import { createRecipe } from './recipe.schema.js';
import { RecipeRepository } from './recipe.repository.js';

export const createRecipeRouter = () => {
   const router = Router();

   const recipeRepository = new RecipeRepository();
   const recipeService = new RecipeService(recipeRepository);
   const recipeController = new RecipeController(recipeService);

   router.post(
      '/',
      authenticateJWT,
      authorizeRoles('ADMIN', 'USER'),
      validate(createRecipe, 'body'),
      recipeController.postNewRecipe,
   );

   return router;
};
