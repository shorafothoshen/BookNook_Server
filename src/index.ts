import express from "express"
import cors from "cors";
import "./config/db.ts"
import addBooksRouter from "./routes/add-books.ts"

const app = express()
app.use(cors());
const port: number = Number(process.env.PORT) || 5000

app.use(express.json())
app.use("/api", addBooksRouter)

app.listen(port, (): void => {
  console.log(`BookNook server listening on port ${port}`)
})