import {db} from "../config/db.ts";

type BookCategory =  "Fiction" | "Science" | "History" | "Kids" | "Others"

export interface Book {
  title: string;
  author: string;
  category: BookCategory;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  userName: string;
  userEmail: string;
  createdAt: Date;
  isFeatured?: boolean;  
  borrowCount?: number;
}

export const booksCollection = db?.collection<Book>("books");