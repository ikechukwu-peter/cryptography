import express, { type Express, type Request, type Response } from "express";
import { cryptographySchema } from "./utility/validations/cryptographySchema";
import Cryptography from "./utility/cryptography";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import path from "path";

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many  requests. Please try again in about 10 minutes.",
});

const app: Express = express();

//setting view engine to ejs
app.set("view engine", "ejs");

app.use(express.json({ limit: "10kb" }));

//set http headers
app.use(helmet());
//compress the node application
app.use(compression());
//serve as a limiter for accessing our api
app.use(apiLimiter);

const port = process.env.PORT != null ? process.env.PORT : 3000;

app.get("/", (_, res: Response) => {
  res.render("index");
});

app.post("/decrypt", (req: Request, res: Response) => {
  const { error } = cryptographySchema.validate(req.body);
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (error) {
    return res
      .status(400)
      .json({ status: "failed", error: error.details[0].message });
  }

  const { text, key } = req.body;

  const cryptoService = new Cryptography(String(key));
  try {
    const decryptedText = cryptoService.decrypt(String(text));
    res.json({ status: "Success", data: decryptedText });
  } catch (err) {
    res
      .status(400)
      .json({ status: "failed", error: "Decryption failed or invalid key" });
  }
});

app.post("/encrypt", (req: Request, res: Response) => {
  const { error } = cryptographySchema.validate(req.body);
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (error) {
    return res
      .status(400)
      .json({ status: "failed", error: error.details[0].message });
  }

  const { text, key } = req.body;
  const cryptoService = new Cryptography(String(key));
  const encryptedText = cryptoService.encrypt(String(text));
  res.json({ status: "Success", data: encryptedText });
});

// Handle undefined routes
app.all("*", (_, res: Response) => {
  return res.status(404).json({ status: "failed", error: "Route not found" });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at PORT: ${port}`);
});
