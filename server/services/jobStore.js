import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storeFile = path.join(__dirname, "..", "data_store.json");

const loadData = () => {
  try {
    if (fs.existsSync(storeFile)) {
      const raw = fs.readFileSync(storeFile, "utf8");
      return JSON.parse(raw);
    }
  } catch (_) {}
  return { models: {}, jobs: {} };
};

const saveData = (data) => {
  try {
    fs.writeFileSync(storeFile, JSON.stringify(data, null, 2), "utf8");
  } catch (_) {}
};

export const jobStore = {
  getJob(id) {
    const data = loadData();
    return data.jobs[id] || null;
  },
  setJob(id, job) {
    const data = loadData();
    data.jobs[id] = job;
    saveData(data);
  },
  getModel(id) {
    const data = loadData();
    return data.models[id] || null;
  },
  setModel(id, model) {
    const data = loadData();
    data.models[id] = model;
    saveData(data);
  },
  getAllModels() {
    const data = loadData();
    return Object.values(data.models);
  },
};

export default jobStore;
