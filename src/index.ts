import express from "express"
import cors from "cors";
import "./config/db.ts"
import booksRouter from "./routes/books.routes.ts"

const app = express()
app.use(cors());
const port: number = Number(process.env.PORT) || 5000

app.use(express.json())
app.use("/api", booksRouter)

app.listen(port, (): void => {
  console.log(`BookNook server listening on port ${port}`)
})