import { Request, Response } from "express";
import { SeasonDetailsService } from "../services/seasonDetailsService";

export const getSeasonDetails = async (req: Request, res: Response): Promise<void> => {
    const seasonDetailsService = new SeasonDetailsService();
    const season = req.params.season;
    const details = await seasonDetailsService.getSeasonDetails(season);
    
    res.status(200).json(details);
};