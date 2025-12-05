import { BaseRepository } from '../../shared/repositories/BaseRepository.js';
import { prisma } from '../../core/config/database.js';
import type { CreateRecipeDto, RecipeResponseDto } from './recipe.schema.js';

export class RecipeRepository extends BaseRepository<RecipeResponseDto> {
   constructor() {
      super(prisma, prisma.recipe);
   }

   async createNewRecipe(body: CreateRecipeDto, userId: string): Promise<RecipeResponseDto> {
      return await this.modelDelegate.create({
         data: {
            title: body.title,
            description: body.description,
            prepTime: body.prepTime,
            cookTime: body.cookTime,
            servings: body.servings,
            difficulty: body.difficulty,
            image: body.image,
            author: {
               connect: { id: userId },
            },
            category: {
               connect: { id: body.categoryId },
            },
            ingredients: {
               create: body.ingredients,
            },
            steps: {
               create: body.steps,
            },
         },

         select: {
            title: true,
            description: true,
            prepTime: true,
            cookTime: true,
            servings: true,
            difficulty: true,
            image: true,
            category: { select: { id: true, name: true } },
            author: { select: { id: true, name: true, lastname: true } },
            ingredients: { select: { name: true, quantity: true, unit: true } },
            steps: { select: { order: true, description: true } },
            createdAt: true,
            updatedAt: true,
         },
      });
   }
}
