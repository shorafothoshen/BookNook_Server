import {Router, type Request, type Response} from 'express';
import {booksCollection} from '../models/books.ts';
import {verifyToken} from '../middleware/verify-user.ts';
import {ObjectId} from 'mongodb';

const router = Router();

router.get('/books', verifyToken, async (req: Request, res: Response) => {
    const books = await booksCollection?.find({}).project({userEmail: 0}).sort({createdAt: -1}).toArray();
    res.status(200).json(books);
})

router.get('/books/:id', verifyToken, async (req: Request, res: Response) => {
    const {id} = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
        res.status(400).json({message: "Invalid book ID"});
        return;
    }
    const book = await booksCollection?.findOne({_id: new ObjectId(id)}).project({userEmail: 0});
    if (!book) {
        res.status(404).json({message: "Book not found"});
        return;
    }
    res.status(200).json(book);
});
router.get("/limit-books", async (req:Request, res:Response) =>{
    const books = await booksCollection?.find({}).project({userEmail: 0}).sort({createdAt: -1}).limit(6).toArray();
    res.status(200).json(books);
})

router.post('/add-books', verifyToken, async (req:Request, res:Response)=>{
    const userEmail = req.user?.email;
    if (!userEmail) {
        res.status(401).json({message: "Authenticated user email not found"});
        return;
    }
    const book = {...req.body, userEmail, createdAt: new Date()};
    const result = await booksCollection?.insertOne(book);
    res.status(201).json({message: "Book added successfully", bookId: result});
})

router.get("/my-books", verifyToken,async (req:Request, res:Response)=>{
    const userEmail = req.user?.email;
    if (!userEmail) {
        res.status(400).json({message: "User email not found"});
        return;
    }
    const books = await booksCollection?.find({userEmail}).project({userEmail: 0}).sort({createdAt: -1}).toArray();
    res.status(200).json(books);
});

export default router;
