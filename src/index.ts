import express, { type Express, type Request, type Response } from "express";
import { cryptographySchema } from "./utility/validations/cryptographySchema";
import Cryptography from "./utility/cryptography";

const app: Express = express();
const port = process.env.PORT != null || 3000;

app.get("/decrypt", (req: Request, res: Response) => {
  const { error } = cryptographySchema.validate(req.query);
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (error) {
    return res
      .status(400)
      .json({ status: "failed", error: error.details[0].message });
  }

  const { text, key } = req.query;
  const cryptoService = new Cryptography(String(key));
  try {
    const decryptedText = cryptoService.decrypt(String(text));
    res.json({ status: "Success", data: decryptedText });
  } catch (err) {
    res.status(400).json({ error: "Decryption failed" });
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
