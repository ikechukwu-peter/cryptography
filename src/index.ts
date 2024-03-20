import express, { type Express, type Request, type Response } from "express";

const app: Express = express();
const port = process.env.PORT != null || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Crypto");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
