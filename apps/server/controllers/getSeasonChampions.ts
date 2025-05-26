import { Request, Response } from "express";
import { SeasonChampionsService } from "../services/seasonChampionsService";

export const getSeasonChampions = async (req: Request, res: Response): Promise<void> => {
    const seasonChampionsService = new SeasonChampionsService();
    const champions = await seasonChampionsService.getSeasonChampions();
    
    res.status(200).json(champions);
};