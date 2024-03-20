import crypto from "crypto";

class Cryptography {
  private readonly key: string;
  private readonly algorithm: string;
  private readonly ivLength: number;

  constructor(key: string) {
    if (key.length !== 64) {
      throw new Error(
        "Invalid key length. Key length should be 32 bytes (256 bits) for AES-256-CBC."
      );
    }
    this.key = key;
    this.algorithm = "aes-256-cbc"; // AES encryption algorithm
    this.ivLength = 16; // Initialization vector length
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(this.ivLength); // Generate random initialization vector
    const keyBuffer = Buffer.from(this.key, "hex"); // Convert key to Buffer from hexadecimal string

    const cipher = crypto.createCipheriv(this.algorithm, keyBuffer, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  }

  decrypt(text: string): string {
    const [ivHex, encryptedText] = text.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const keyBuffer = Buffer.from(this.key, "hex"); // Convert key to Buffer from hexadecimal string

    const decipher = crypto.createDecipheriv(this.algorithm, keyBuffer, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}

export default Cryptography;
