import {Router, type Request, type Response} from 'express';
import {booksCollection} from '../models/books.ts';
import {verifyToken} from '../middleware/verify-user.ts';

const router = Router();

router.get('/books', async (req: Request, res: Response) => {
    const books = await booksCollection?.find({}).toArray();
    res.status(200).json(books);
})

router.get('/books/:id', verifyToken, async (req: Request, res: Response) => {
    const {id} = req.params;
    const book = await booksCollection?.findOne({_id: id});
    if (!book) {
        res.status(404).json({message: "Book not found"});
        return;
    }
    res.status(200).json(book);
});
router.get("/limit-books", async (req:Request, res:Response) =>{
    const books = await booksCollection?.find({}).limit(6).toArray();
    res.status(200).json(books);
})

router.post('/books', verifyToken, async (req:Request, res:Response)=>{
    const book =req.body;
    const result = await booksCollection?.insertOne(book);
    res.status(201).json({message: "Book added successfully", bookId: result});
})
