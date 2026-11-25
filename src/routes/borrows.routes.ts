import { Router, type Request, type Response } from "express";
import { borrowsCollection } from "../models/borrows.ts";
import { booksCollection } from "../models/books.ts";
import { verifyToken } from "../middleware/verify-user.ts";
import { ObjectId } from "mongodb";

const router = Router();

router.get("/my-borrows", verifyToken, async (req: Request, res: Response) => {
    const borrows = await borrowsCollection
        ?.find({ userEmail: req.user?.email, status: "borrowed" })
        .sort({ createdAt: -1 })
        .toArray();

    res.status(200).json(
        (borrows ?? []).map((b) => ({
            _id: b._id,
            title: b.bookTitle,
            image: b.bookImage,
            borrowDate: b.borrowedDate,
            returnDate: b.returnDate,
        }))
    );
});

router.post("/borrow/:id", verifyToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid book ID" });
        return;
    }
    if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const previousBorrow = await borrowsCollection?.findOne({
        bookId: id,
        userEmail: user.email,
        status: "borrowed"
    });
    if (previousBorrow) {
        res.status(400).json({ message: "You have already borrowed this book before" });
        return;
    }

    const bookId = new ObjectId(id);
    const book = await booksCollection?.findOne({ _id: bookId });
    if (!book) {
        res.status(404).json({ message: "Book not found" });
        return;
    }

    const stockUpdate = await booksCollection?.updateOne(
        { _id: bookId, availableCopies: { $gt: 0 } },
        { $inc: { availableCopies: -1, borrowCount: 1 } },
    );
    if (!stockUpdate?.modifiedCount) {
        res.status(400).json({ message: "Book not found or not available" });
        return;
    }

    let result;
    try {
        result = await borrowsCollection?.insertOne({
            bookId: id,
            bookTitle: book.title,
            bookImage: book.image,
            userName: user.name,
            userEmail: user.email,
            borrowedDate: new Date(),
            returnDate: new Date(req.body.returnDate),
            status: "borrowed",
            createdAt: new Date(),
        });
    } catch (error) {
        await booksCollection?.updateOne(
            { _id: bookId },
            { $inc: { availableCopies: 1, borrowCount: -1 } },
        );
        throw error;
    }

    if (!result) {
        await booksCollection?.updateOne(
            { _id: bookId },
            { $inc: { availableCopies: 1, borrowCount: -1 } },
        );
        res.status(500).json({ message: "Failed to create borrow record" });
        return;
    }

    res.status(201).json({
        message: "Book borrowed successfully",
        borrowId: result.insertedId,
    });
});

router.patch("/return/:id", verifyToken, async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid borrow ID" });
        return;
    }

    const borrowId = new ObjectId(id);
    const userEmail = req.user?.email;
    const borrow = await borrowsCollection?.findOne({
        _id: borrowId,
        userEmail,
        status: "borrowed",
    });
    if (!borrow) {
        res.status(404).json({ message: "Borrow record not found" });
        return;
    }

    const result = await borrowsCollection?.updateOne(
        { _id: borrowId, userEmail, status: "borrowed" },
        { $set: { status: "returned", returnedAt: new Date() } },
    );
    if (!result?.modifiedCount) {
        res.status(404).json({ message: "Borrow record not found" });
        return;
    }

    await booksCollection?.updateOne(
        { _id: new ObjectId(borrow.bookId) },
        { $inc: { availableCopies: 1 } },
    );

    res.status(200).json({ message: "Book returned successfully" });
});

export default router;