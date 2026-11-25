import express from "express"
import cors from "cors";
import "./config/db.ts"
import booksRouter from "./routes/books.routes.ts"
import borrowsRouter from "./routes/borrows.routes.ts"
import trendingBooksRouter from "./routes/trendingBook.routes.ts"

const app = express()
app.use(cors({
    origin: process.env.CLIENT_URL, 
    credentials: true,
  }));
const port: number = Number(process.env.PORT) || 5000

app.use(express.json())
app.use("/api", booksRouter)
app.use("/api", borrowsRouter)
app.use("/api", trendingBooksRouter)

app.listen(port, (): void => {
  console.log(`BookNook server listening on port ${port}`)
})