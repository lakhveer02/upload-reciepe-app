import { Injectable, Inject } from '@angular/core';
import { Observable,of } from 'rxjs';
import { Rating, Recipe,Comment } from './recipe.model';
import { getFirestore, addDoc, collection, doc, updateDoc, deleteDoc, getDocs, DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { error } from 'console';
@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
  private afAuth: Auth) {
    if (isPlatformBrowser(this.platformId)) {
      const storedRecipes = localStorage.getItem('recipes');
      if (storedRecipes) {
        this.recipes = JSON.parse(storedRecipes);
      }
    }
  }
  getRecipes(userId: string): Observable<Recipe[]> {
    const recipesCollection = collection(getFirestore(), 'recipes');

    return new Observable<Recipe[]>((observer) => {
      getDocs(recipesCollection)
      .then((querySnapshot: QuerySnapshot<DocumentData>) => {
        const recipes: Recipe[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const recipe: Recipe = {
            id: doc.id, 
            title: data['title'] || '',  
            img: data['img'] || '',
            ingredients: data['ingredients'] || [],
            instructions: data['instructions'] || '',
            category: data['category'] || '',
            name: data['name'] || '',
            ingredientsString: data['ingredientsString'] || '',
            imageFile: null,
            userId: data['userId'] || userId,
            type:data['type']||'',
          };
          recipes.push(recipe);
        });
        observer.next(recipes);
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });
    })
  }

  getRecipesByCategory(userId: string, category: string): Observable<Recipe[]> {
    const filteredRecipes = this.recipes.filter(
      (recipe) => recipe.userId === userId && (!category || recipe.category === category)
    );

    return of(filteredRecipes); 
  }
  async addRecipeToFirebase(recipe: Recipe, recipeImageFile: File | null, userId: string): Promise<void> {
    try {
      let imageUrl: string | undefined;
      if (recipeImageFile) {
        const storageRef = ref(getStorage(), 'recipe-images/' + recipeImageFile.name);
        await uploadBytes(storageRef, recipeImageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const recipesCollection = collection(getFirestore(), 'recipes');
      const recipeData = {
        ...recipe,
        img: imageUrl || '',
        id: doc(recipesCollection).id,
        userId: userId,
        imageFile: null,
      };

      await addDoc(recipesCollection, recipeData);

      console.log('Recipe added to Firebase.');
      this.recipes.push(recipeData);
      this.saveRecipesToLocalStorage();
    } catch (error) {
      console.error('Error adding recipe to Firebase: ', error);
    }
  }

  async updateRecipeInFirebase(recipe: Recipe): Promise<void> {
    try {
      const user = await this.afAuth.currentUser;

      if (user && recipe.userId === user.uid) {
        const db = getFirestore();
        const recipeDocRef = doc(db, 'recipes', recipe.id.toString());

        const recipeToUpdate: Partial<Recipe> = { ...recipe };
        delete recipeToUpdate.id;

        await updateDoc(recipeDocRef, recipeToUpdate);
        console.log('Recipe updated in Firebase with ID: ', recipe.id);

      
        const index = this.recipes.findIndex((r) => r.id === recipe.id);
        if (index !== -1) {
          this.recipes[index] = recipe;
          this.saveRecipesToLocalStorage();
        }
      } else {
        console.error('Unauthorized to update this recipe. User:', user);
      }
    } catch (error) {
      console.error('Error updating recipe in Firebase: ', error);
    }
  }


  async deleteRecipeInFirebase(recipe: Recipe, userId: string): Promise<void> {
    try {
      const user = await this.afAuth.currentUser;
  
      if (user && recipe.userId === userId) {
        const db = getFirestore();
        const recipeDocRef = doc(db, 'recipes', recipe.id.toString());
        await deleteDoc(recipeDocRef);
        console.log('Recipe deleted from Firebase with ID: ', recipe.id);
  
        const index = this.recipes.findIndex((r) => r.id === recipe.id);
        if (index !== -1) {
          this.recipes.splice(index, 1);
          this.saveRecipesToLocalStorage();
        }
      } else {
        console.error('Unauthorized to delete this recipe. User:', user);
        throw new Error('Unauthorized to delete this recipe.');
      }
    } catch (error) {
      console.error('Error deleting recipe from Firebase:', error);
      throw error;
    }
  }
  
async addRatingToRecipe(recipeId:string,rating:Rating):Promise<void>{
  try{
    const db=getFirestore();
    const recipeRef=doc(db,'recipes',recipeId);
    const ratingsCollection=collection(recipeRef,'ratings');
    await addDoc(ratingsCollection,rating);
  }catch(error){
    console.error('Error Adding Rating  ',error);
    throw error;
  }
}
async addCommentToRecipe(recipeId:string,comment:Comment):Promise<void>{
  try{
    const db=getFirestore();
    const recipeRef=doc(db,'recipes',recipeId);
    const commentsCollection=collection(recipeRef,'comments');
    await addDoc(commentsCollection,comment);
  }catch(error){
    console.error('Error Adding Comment',error)
    throw error;
  }
}
getAllCommentsForRecipe(recipeId: string): Observable<Comment[]> {
  const db = getFirestore();
  const recipeRef = doc(db, 'recipes', recipeId);
  const commentsCollection = collection(recipeRef, 'comments');

  return new Observable<Comment[]>((observer) => {
    getDocs(commentsCollection)
      .then((querySnapshot: QuerySnapshot<DocumentData>) => {
        const comments: Comment[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const comment: Comment = {
            userId: data['userId'] || '',
            text: data['text'] || '',
          };
          comments.push(comment);
        });
        observer.next(comments);
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });
  });
}

getAllRatingsForRecipe(recipeId: string): Observable<Rating[]> {
  const db = getFirestore();
  const recipeRef = doc(db, 'recipes', recipeId);
  const ratingsCollection = collection(recipeRef, 'ratings');

  return new Observable<Rating[]>((observer) => {
    getDocs(ratingsCollection)
      .then((querySnapshot: QuerySnapshot<DocumentData>) => {
        const ratings: Rating[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const rating: Rating = {
            userId: data['userId'] || '',
            value: data['value'] || 0,
          };
          ratings.push(rating);
        });
        observer.next(ratings);
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });
  });
}
  public saveRecipesToLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('recipes', JSON.stringify(this.recipes));
    }
  }
}
