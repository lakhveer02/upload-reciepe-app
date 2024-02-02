import { Injectable } from '@angular/core';
import { getFirestore, collection, doc, setDoc, getDoc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MealPlan } from './mealplan.model';

@Injectable({
  providedIn: 'root',
})
export class MealPlanService {
  private mealPlanCollection = collection(getFirestore(), 'mealPlans');

  constructor() { }

  getMealPlan(userId: string): Observable<MealPlan | null> {
    const userMealPlanDoc = doc(this.mealPlanCollection, userId);

    return new Observable<MealPlan | null>((observer) => {
      getDoc(userMealPlanDoc)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            observer.next(docSnapshot.data() as MealPlan);
          } else {
            observer.next(null);
          }
          observer.complete();
        })
        .catch((error) => {
          console.error('Error fetching meal plan:', error);
          observer.error(error);
        });
    });
  }

  saveMealPlan(userId: string, mealPlan: MealPlan): Promise<void> {
    const userMealPlanDoc = doc(this.mealPlanCollection, userId);

    if (!userId) {
      throw new Error('Invalid user ID');
    }

    return setDoc(userMealPlanDoc, mealPlan);
  }

  addMealToMealPlan(userId: string, day: string, mealData: { recipeId: string }): Promise<void> {
    const userMealPlanDoc = doc(this.mealPlanCollection, userId);
    const mealsCollection = collection(userMealPlanDoc, 'meals');

    return addDoc(mealsCollection, {
      day,
      recipeId: mealData.recipeId,
    }).then((mealDocRef) => {
      console.log(`Meal added to meal plan for ${day} with ID: ${mealDocRef.id}`);
    });

  }
}
