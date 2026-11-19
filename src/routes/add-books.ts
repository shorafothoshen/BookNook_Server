import { Router, type Request, type Response } from "express";
import { booksCollection } from "../models/books.ts";
import { verifyToken } from "./verify-user.ts";

const router = Router();

router.post("/books", verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!booksCollection) {
      res.status(503).json({ message: "Database is unavailable" });
      return;
    }

    const result = await booksCollection.insertOne(req.body);
    res.status(201).json({ _id: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add book" });
  }
});


export default router;