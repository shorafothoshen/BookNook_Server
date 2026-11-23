import { db } from "../config/db.ts";

export interface Borrow {
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userName: string;
  userEmail: string;
  borrowedDate: Date;
  returnDate: Date;
  returnedAt?: Date;
  status: "borrowed" | "returned";
  createdAt: Date;
}

export const borrowsCollection = db?.collection<Borrow>("borrows");