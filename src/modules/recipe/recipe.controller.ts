import type { RecipeService } from './recipe.service.js';
import type { RequestHandler } from 'express';
import type { CreateRecipeDto, RecipeResponseDto } from './recipe.schema.js';
import * as result from '../../shared/response/ApiResponse.js';

export class RecipeController {
   constructor(private readonly recipeService: RecipeService) {}

   postNewRecipe: RequestHandler<
      Record<string, never>,
      RecipeResponseDto,
      CreateRecipeDto,
      Record<string, never>
   > = async (_req, res, next) => {
      try {
         const newRecipe: RecipeResponseDto = await this.recipeService.createNewRecipe(
            _req.validatedBody!,
            _req.user?.userId as string,
         );

         result.success(_req, res, newRecipe, 201);
      } catch (err) {
         next(err);
      }
   };

   listAllRecipes: RequestHandler<
      Record<string, never>,
      RecipeResponseDto[],
      Record<string, never>,
      Record<string, never>
   > = async (_req, res, next) => {
      try {
         const recipes: RecipeResponseDto[] = await this.recipeService.listAllRecipes();

         result.success(_req, res, recipes, 200);
      } catch (err) {
         next(err);
      }
   };
}
