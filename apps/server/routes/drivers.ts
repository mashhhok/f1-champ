import express from "express";
import { ctrlWrapper } from "../middleware/ctrlWrapper";
import { getRaceWinners } from "../controllers/getRaceWinners";
import { getSeasonChampions } from "../controllers/getSeasonChampions";

export const driversRouter = express.Router();

driversRouter.get("/v1/:season/race-winners", ctrlWrapper(getRaceWinners));

driversRouter.get("/v1/champions", ctrlWrapper(getSeasonChampions));