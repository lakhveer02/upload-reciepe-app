export interface Recipe {
  id: string;
  title: string;
  img: string;
  ingredients: string[];
  instructions: string;
  category: string;
  name: string;
  ingredientsString: string;
  imageFile: File | null;
  userId: string;
  mealDay?: string;
  type:''
  comments?: Comment[];
  ratings?: Rating[];
}

export interface Comment {
  userId: string;
  text: string;
  userName?: string;
}

export interface Rating {
  userId: string;
  value: number;
  userName?: string;

}
export interface UserDetails{
  name: any;
  userName?: string;

}