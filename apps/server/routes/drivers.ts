import express from "express";
import { ctrlWrapper } from "../middleware/ctrlWrapper";
import { getRaceWinners } from "../controllers/getRaceWinners";
import { getSeasonChampions } from "../controllers/getSeasonChampions";
import { getSeasonDetails } from "../controllers/getSeasonDetails";

export const driversRouter = express.Router();

/**
 * @swagger
 * /api/v1/{season}/race-winners:
 *   get:
 *     summary: Get race winners for a specific season
 *     description: Retrieves all race winners for the specified F1 season
 *     tags:
 *       - Drivers
 *     parameters:
 *       - in: path
 *         name: season
 *         required: true
 *         schema:
 *           type: string
 *         description: The F1 season year (e.g., "2023")
 *         example: "2023"
 *     responses:
 *       200:
 *         description: Successfully retrieved race winners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   race:
 *                     type: string
 *                     description: Race name
 *                   winner:
 *                     type: string
 *                     description: Driver name
 *                   team:
 *                     type: string
 *                     description: Team name
 *       404:
 *         description: Season not found or no data available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No data found for season 2023"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 */
driversRouter.get("/v1/:season/race-winners", ctrlWrapper(getRaceWinners));

/**
 * @swagger
 * /api/v1/champions:
 *   get:
 *     summary: Get all season champions
 *     description: Retrieves a list of all F1 season champions
 *     tags:
 *       - Drivers
 *     responses:
 *       200:
 *         description: Successfully retrieved season champions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   season:
 *                     type: string
 *                     description: Championship season year
 *                   champion:
 *                     type: string
 *                     description: Champion driver name
 *                   team:
 *                     type: string
 *                     description: Champion's team
 *                   points:
 *                     type: number
 *                     description: Championship points
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 */
driversRouter.get("/v1/champions", ctrlWrapper(getSeasonChampions));

/**
 * @swagger
 * /api/v1/{season}/qualifying:
 *   get:
 *     summary: Get latest qualifying results for a specific season
 *     description: Retrieves the latest qualifying results for the specified F1 season
 *     tags:
 *       - Drivers
 *     parameters:
 *       - in: path
 *         name: season
 *         required: true
 *         schema:
 *           type: string
 *         description: The F1 season year (e.g., "2023")
 *         example: "2023"
 *     responses:
 *       200:
 *         description: Successfully retrieved latest qualifying results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   position:
 *                     type: string
 *                     description: Qualifying position
 *                   Driver:
 *                     type: object
 *                     properties:
 *                       driverId:
 *                         type: string
 *                         description: Driver ID
 *                       givenName:
 *                         type: string
 *                         description: Driver's first name
 *                       familyName:
 *                         type: string
 *                         description: Driver's last name
 *                       nationality:
 *                         type: string
 *                         description: Driver's nationality
 *                   Constructor:
 *                     type: object
 *                     properties:
 *                       constructorId:
 *                         type: string
 *                         description: Constructor ID
 *                       name:
 *                         type: string
 *                         description: Constructor name
 *                       nationality:
 *                         type: string
 *                         description: Constructor nationality
 *                   Q1:
 *                     type: string
 *                     description: Q1 qualifying time
 *                   Q2:
 *                     type: string
 *                     description: Q2 qualifying time (if applicable)
 *                   Q3:
 *                     type: string
 *                     description: Q3 qualifying time (if applicable)
 *       404:
 *         description: Season not found or no qualifying data available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No qualifying data found for season 2023"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server Error"
 */
driversRouter.get("/v1/:season/details", ctrlWrapper(getSeasonDetails));