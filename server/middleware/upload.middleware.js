import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || "";
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `${cleanName}-${uniqueSuffix}${ext || (file.fieldname === "modelfile" ? ".Modelfile" : "")}`);
  },
});

// Only accept the formats the model registration endpoint can process.
const fileFilter = (req, file, cb) => {
  const allowedExts = [".gguf", ".bin", ".modelfile", ".txt"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.includes(ext) || file.originalname.toLowerCase().includes("modelfile")) {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
  }
};

export const uploadModelFiles = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 * 5 }, // up to 5GB for GGUF weights
  fileFilter,
});

export default uploadModelFiles;
