import { Router,type Request, type Response }from "express";
import { booksCollection } from "../models/books.ts";

const router = Router();

router.get("/trending-books", async (req: Request, res: Response) => {
    try {
        const [featured, newBooks, mostBorrowed] = await Promise.all([
            booksCollection
                ?.find({ borrowCount: { $gte: 2 } })
                .sort({ borrowCount: -1 })
                .limit(7)
                .toArray(),
            booksCollection
                ?.find({})
                .sort({ createdAt: -1 })
                .limit(7)
                .toArray(),
            booksCollection
                ?.find({ borrowCount: { $gt: 0 } })
                .sort({ borrowCount: -1 })
                .limit(7)
                .toArray(),
        ]);

        res.status(200).json({
            featured: featured ?? [],
            new: newBooks ?? [],
            mostBorrowed: mostBorrowed ?? [],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load books" });
    }
});

export default router;