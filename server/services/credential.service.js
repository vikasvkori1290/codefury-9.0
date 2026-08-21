import crypto from "crypto";

const algorithm = "aes-256-gcm";

const getKey = () => {
  const secret = process.env.CREDENTIAL_ENCRYPTION_KEY || process.env.JWT_SECRET;
  if (!secret) throw new Error("CREDENTIAL_ENCRYPTION_KEY must be configured before storing API keys.");
  return crypto.createHash("sha256").update(secret).digest();
};

export const encryptCredential = (value) => {
  if (!value) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${cipher.getAuthTag().toString("hex")}:${encrypted.toString("hex")}`;
};

export const decryptCredential = (value) => {
  if (!value) return null;
  const [ivHex, tagHex, encryptedHex] = value.split(":");
  if (!ivHex || !tagHex || !encryptedHex) throw new Error("Invalid encrypted credential.");
  const decipher = crypto.createDecipheriv(algorithm, getKey(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([decipher.update(Buffer.from(encryptedHex, "hex")), decipher.final()]).toString("utf8");
};

export const redactSecret = (message) => String(message || "").replace(/(sk-|AIza|Bearer\s+)[A-Za-z0-9_.:/+-]+/gi, "$1[REDACTED]");
