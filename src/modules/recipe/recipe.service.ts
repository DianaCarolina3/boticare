import type { CreateRecipeDto, RecipeResponseDto } from './recipe.schema.js';
import type { RecipeRepository } from './recipe.repository.js';
import { Errors } from '../../utils/errors.js';

export class RecipeService {
   constructor(private readonly recipeRepository: RecipeRepository) {}

   async createNewRecipe(body: CreateRecipeDto, userId: string): Promise<RecipeResponseDto> {
      if (!userId) {
         throw new Errors('User ID is required', 400);
      }
      return await this.recipeRepository.createNewRecipe(body, userId);
   }
}
