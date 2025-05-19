import express from "express";
import { ctrlWrapper } from "../middleware/ctrlWrapper";
import { getDrivers } from "../controllers/getDrivers";

export const driversRouter = express.Router();

driversRouter.get("/v1/:seasons/drivers", ctrlWrapper(getDrivers));
