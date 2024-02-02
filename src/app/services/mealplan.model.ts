import { Recipe } from './recipe.model'; 

export interface MealPlan {
  monday: Recipe | null;
  tuesday: Recipe | null;
  wednesday: Recipe | null;
  thursday: Recipe | null;
  friday: Recipe | null;
  saturday: Recipe | null;
  sunday: Recipe | null;
  [key: string]: Recipe | null; 
}