import {Router, type Request, type Response} from "express";
import {booksCollection} from "../models/books.ts";
import {verifyToken} from "./verify-user.ts";

const router = Router();

router.get("/books", async (req:Request, res:Response): Promise<void> => {
  try {
    if (!booksCollection) {
      res.status(503).json({message: "Database is unavailable"});
      return;
    }
    const books = await booksCollection.find({});
    res.json(books);
  } catch (error) {
    res.status(500).json({message: "Internal Server Error"});
  }
});

router.get("/books/:id", verifyToken, async (req:Request, res:Response): Promise<void> => {
  try {
    if (!booksCollection) {
      res.status(503).json({message: "Database is unavailable"});
      return;
    }
    const book = await booksCollection.findOne({_id: req.params.id});
    if (!book) {
      res.status(404).json({message: "Book not found"});
      return;
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({message: "Internal Server Error"});
  }
});
