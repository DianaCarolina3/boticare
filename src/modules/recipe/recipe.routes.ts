import { Router } from 'express';
import { RecipeController } from './recipe.controller.js';

export const createRecipeRouter = () => {
   const router = Router();

   // repository
   // service
   const recipeController = new RecipeController();

   router.post('/', recipeController.postNewRecipe);

   return router;
};
