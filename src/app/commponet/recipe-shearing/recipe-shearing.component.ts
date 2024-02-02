import { Component, OnInit } from '@angular/core';
import { Recipe,Rating,Comment } from '../../services/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'firebase/auth';
import { Auth, authState } from '@angular/fire/auth';
import { MealPlanService } from '../../services/mealplan.service';
import { MealPlan } from '../../services/mealplan.model';
@Component({
  selector: 'app-recipe-shearing',
  standalone: true,
  imports: [NgFor, FormsModule, NgIf, MatCardModule, MatIconModule, MatMenuModule,],
  templateUrl: './recipe-shearing.component.html',
  styleUrl: './recipe-shearing.component.css',
  providers: [RecipeService, MealPlanService]
})
export class RecipeShearingComponent implements OnInit {
  recipes: Recipe[] = [];
  showCommentAndRatingFormFlag: boolean = false;
  selectedRecipeForComment: Recipe | null = null;
  showForm: boolean = false;
  mealPlan: MealPlan | null = null
  searchValue: string = '';
  filteredRecipes: Recipe[] = [];
  categories: string[] = [];
    newRecipe: Recipe & { ingredientsString: string; imageFile: File | null; userId: string } = {
    id: '',
    title: '',
    img: '',
    ingredients: [],
    instructions: '',
    category: '',
    name: '',
    ingredientsString: '',
    imageFile: null,
    userId: '',
    type: ''
  };
  editRecipe: Recipe | null = null;
  showShareOptions: boolean = false;
  selectedRecipe: Recipe | null = null;
  user: User | null = null;
  selectedCategory: string ='';
  showMealPlan: boolean = false;
  showAllCommentsAndRatingsFlag: boolean = false;
  allCommentsAndRatings: { comment: string, rating: number }[] = [];
  constructor(
    private recipeService: RecipeService,
    private snackBar: MatSnackBar,
    private auth: Auth,
    private mealPlanService: MealPlanService
  ) { }

  ngOnInit(): void {
    this.loadRecipes();
    authState(this.auth).subscribe((user: User | null) => {
      if (user) {
        this.user = user;
        console.log('User:', this.user);
        this.loadRecipes();
        this.loadMealPlan();
        console.log('User is logdin .')
      } else {
        this.user = null;
        // console.log('User is not logged in.');
      }
    });
  }
   loadMealPlan(): void {
    const userId = this.user?.uid;
    if (userId) {
      this.mealPlanService.getMealPlan(userId).subscribe((mealPlan: MealPlan | null) => {
        if (mealPlan) {
          this.mealPlan = mealPlan;
          console.log('Meal Plan:', this.mealPlan);
        } else {
          console.error('Meal Plan is null. Initializing a new meal plan.');

          this.mealPlan = {
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
            saturday: null,
            sunday: null,

          };
        }
      });
    }
  }

  loadRecipes(): void {
    const userId = this.user?.uid || '';
    this.recipeService.getRecipes(userId).subscribe((recipes) => {
      const uniqueRecipes = new Set<string>();
      this.recipes = recipes.filter((recipe) => {
        const key = recipe.title.toLowerCase() + recipe.ingredients.join(',');
        if (uniqueRecipes.has(key)) {
          return false;
        }
        uniqueRecipes.add(key);
        return true;
      });
      this.recipeService.saveRecipesToLocalStorage();
    });
  }
  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.newRecipe.imageFile = file;
    }
  }
  planMeal(day: string, recipeId: string): void {
    if (this.user && this.user.uid) {
      if (this.mealPlan) {
        this.addRecipeToMealPlan(day, recipeId);
      } else {
        if (!this.mealPlan) {
          this.loadMealPlanForPlanning(day, recipeId);
        }
      }
    } else {
      console.error('User or userId is not available.');
    }
  }


  loadMealPlanForPlanning(day: string, recipeId: string): void {
    const userId = this.user?.uid;
    if (userId) {
      this.mealPlanService.getMealPlan(userId).subscribe((mealPlan: MealPlan | null) => {
        if (mealPlan) {
          this.mealPlan = mealPlan;
          this.addRecipeToMealPlan(day, recipeId);
        } else {
          console.error('Meal Plan is null');
        }
      });
    }
  }
  addRecipeToMealPlan(day: string, recipeId: string): void {
    if (this.user && this.user.uid) {
      if (this.mealPlan) {
        const recipe = this.recipes.find((r) => r.id === recipeId);
        this.mealPlan[day] = recipe || null;

        this.mealPlanService.saveMealPlan(this.user.uid, this.mealPlan)
          .then(() => {
            console.log(`Recipe ${recipeId} planned for ${day}`);

            this.mealPlanService?.addMealToMealPlan(this.user?.uid ?? '', day, {
              recipeId,
            }).then(() => {
              console.log(`Meal added to meal plan for ${day} with recipeId: ${recipeId}`);
              this.loadMealPlan();
            }).catch((error) => {
              console.error('Error adding meal to meal plan:', error);
            });
          })
          .catch((error) => {
            console.error('Error saving meal plan:', error);
          });
      } else {
        console.error('Meal Plan is null');
      }
    } else {
      console.error('User or userId is not available.');
    }
  }

  showRecipeForm(): void {
    this.showForm = true;
    this.newRecipe = {
      id: '',
      title: '',
      img: '',
      ingredients: [],
      instructions: '',
      category: '',
      name: '',
      ingredientsString: '',
      imageFile: null,
      userId: '',
      type: '',
    };
  }

  editRecipeDetails(recipe: Recipe): void {
    this.editRecipe = { ...recipe };
  }

  cancelEdit(): void {
    this.editRecipe = null;
  }
  showCommentAndRatingForm(recipe: Recipe): void {
    this.selectedRecipeForComment = recipe;
    this.showCommentAndRatingFormFlag = true;
  }

  hideCommentAndRatingForm(): void {
    this.showCommentAndRatingFormFlag = false;
    this.selectedRecipeForComment = null;
  }

  showAllCommentsAndRatings(recipe: Recipe): void {
    this.selectedRecipeForComment = recipe;
    this.showAllCommentsAndRatingsFlag = true;
  
    this.recipeService.getAllCommentsForRecipe(recipe.id).subscribe((comments) => {
      this.recipeService.getAllRatingsForRecipe(recipe.id).subscribe((ratings) => {
        this.allCommentsAndRatings = comments.map(comment => {
          const matchingRating = ratings.find(rating => rating.userId === comment.userId);  
          console.log(matchingRating)
          return {
            comment: comment.text,
            rating: matchingRating ? matchingRating.value : 0
          };
        });
      });
    });
  }
  
  hideAllCommentsAndRatings(): void {
    this.showAllCommentsAndRatingsFlag = false;
    this.allCommentsAndRatings = [];
  }

  submitCommentAndRating(comment: string, rating: number): void {
    const userId = this.user?.uid || '';
    const recipeId = this.selectedRecipeForComment?.id || '';
  
    if (userId && recipeId) {
      const commentData: Comment = { userId, text: comment };
      const ratingData: Rating = { userId, value: rating };
  
      this.recipeService.addCommentToRecipe(recipeId, commentData)
        .then(() => {
          console.log('Comment added successfully');
        })
        .catch((error) => {
          console.error('Error adding comment:', error);
        });
  
      this.recipeService.addRatingToRecipe(recipeId, ratingData)
        .then(() => {
          console.log('Rating added successfully');
        })
        .catch((error) => {
          console.error('Error adding rating:', error);
        });
  
      this.hideCommentAndRatingForm();
    }
  }
  

  toggleMealPlan(): void {
    this.showMealPlan = !this.showMealPlan;
  }
  submitRecipe(): void {
    this.newRecipe.ingredients = this.newRecipe.ingredientsString.split(',').map((ingredient) => ingredient.trim());

    const isDuplicateTitle = this.recipes.some(recipe => recipe.title.toLowerCase() === this.newRecipe.title.toLowerCase());

    if (isDuplicateTitle) {
      console.error('Recipe with the same title already exists. Please choose a different title.');
    } else {
      if (this.newRecipe.imageFile) {
        this.newRecipe.ingredientsString = this.newRecipe.ingredients.join(',');

        this.recipeService
          .addRecipeToFirebase(this.newRecipe, this.newRecipe.imageFile, this.user?.uid || '')
          .then(() => {
            this.showForm = false;
            this.newRecipe = {
              id: '',
              title: '',
              img: '',
              ingredients: [],
              instructions: '',
              category: '',
              name: '',
              ingredientsString: '',
              imageFile: null,
              userId: this.user?.uid || '',
              type: '',
            };
            this.loadRecipes();
          })
          .catch((error) => {
            console.error('Error adding recipe:', error);
          });
      } else {
        console.error('No image file selected.');
      }
    }
  }

  deleteRecipe(recipe: Recipe): void {
    if (this.user && recipe.userId === this.user.uid) {
      console.log('Deleting recipe with id:', recipe.id);
      this.recipeService
        .deleteRecipeInFirebase(recipe, this.user.uid)
        .then(() => {
          console.log('Recipe Deleted successfully.');
          this.snackBar.open('Recipe Deleted successfully.', 'Close', { duration: 2000 });
          this.loadRecipes();
        })
        .catch((error) => {
          console.log('Error Deleting Recipe:', error);
          this.snackBar.open('Error Deleting Recipe', 'Close', { duration: 2000 });
        });
    } else {
      console.log('Permission denied. User does not own this recipe');
      this.snackBar.open('Permission denied. User does not own this recipe', 'Close', { duration: 2000 });
    }
  }



  updateRecipe(): void {
    if (this.user && this.editRecipe && this.editRecipe.userId === this.user.uid) {
      this.recipeService
        .updateRecipeInFirebase(this.editRecipe)
        .then(() => {
          this.editRecipe = null;
          this.loadRecipes();
        })
        .catch((error) => {
          console.error('Error updating recipe:', error);
        });
    } else {
      console.error('Cannot update recipe. editRecipe is null or user does not own this recipe.');
    }
  }
  close() {
    this.showForm = false
  }

  share(recipe: Recipe): void {
    this.selectedRecipe = recipe;
    this.showShareOptions = true;
  }

  shareOnWhatsApp(): void {
    const recipeUrl = `https://your-recipe-app.com/recipes/${this.selectedRecipe?.id}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `Check out this recipe: ${this.selectedRecipe?.title}\n${recipeUrl}`
    )}`;
    window.open(whatsappUrl, '_blank');
    this.hideShareOptions();
  }

  shareOnFacebook(): void {
    const recipeUrl = `https://your-recipe-app.com/recipes/${this.selectedRecipe?.id}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(recipeUrl)}`;
    window.open(facebookUrl, '_blank');
    this.hideShareOptions();
  }

  hideShareOptions(): void {
    this.showShareOptions = false;
    this.selectedRecipe = null;
  }
  onSearchChange(): void {
    this.filteredRecipes = this.filterRecipes();
  }


  onCategoryChange(event: any): void {
    const target = event.target as HTMLSelectElement;
    const selectedCategory = target ? target.value : '';
    this.selectedCategory = selectedCategory;
    this.filteredRecipes = this.filterRecipes();
  }
  filterRecipes(): Recipe[] {
    const searchString = this.searchValue.toLowerCase();
    const categoryFilter = this.selectedCategory.toLowerCase();

    return this.recipes.filter((recipe) => {
      const titleMatch = recipe.title.toLowerCase().includes(searchString);
      const categoryMatch = recipe.category.toLowerCase().includes(categoryFilter);

      return titleMatch && categoryMatch;
    });
  }
}


