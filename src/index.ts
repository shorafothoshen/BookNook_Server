import express, { type Request, type Response } from "express"
import cors from "cors";
import "./config/db.ts"

const app = express()
app.use(cors());
const port: number = Number(process.env.PORT) || 5000

app.get("/", (req: Request, res: Response): void => {
  res.send("BookNook server is running")
})

app.listen(port, (): void => {
  console.log(`BookNook server listening on port ${port}`)
})