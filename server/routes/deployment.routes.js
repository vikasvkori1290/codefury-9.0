import express from "express";
import { deployModel, proxyPredict } from "../controllers/deployment.controller.js";

const router = express.Router();
router.post("/deploy", deployModel);
router.post("/proxy/predict", proxyPredict);
export default router;
