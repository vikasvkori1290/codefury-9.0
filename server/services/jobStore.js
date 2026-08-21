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
  return { models: {}, jobs: {}, deployments: {} };
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
  setDeployment(id, deployment) {
    const data = loadData();
    data.deployments = data.deployments || {};
    data.deployments[id] = deployment;
    saveData(data);
  },
  getDeployment(id) {
    const data = loadData();
    return data.deployments?.[id] || null;
  },
  getDeployments() {
    const data = loadData();
    return Object.values(data.deployments || {});
  },
  setUser(id, user) {
    const data = loadData();
    data.users = data.users || {};
    data.users[id] = user;
    saveData(data);
  },
  getUser(id) {
    const data = loadData();
    return data.users?.[id] || null;
  },
  getUserByEmail(email) {
    const data = loadData();
    return Object.values(data.users || {}).find((user) => user.email === email.toLowerCase()) || null;
  },
};

export default jobStore;
