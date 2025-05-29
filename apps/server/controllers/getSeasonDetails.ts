import { Request, Response } from "express";
import { SeasonDetailsService } from "../services/seasonDetailsService";

export const getSeasonDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { season } = req.params;
  
  const seasonDetailsService = new SeasonDetailsService();
  const numberOfRaces = await seasonDetailsService.getNumberOfRaces(season);
  res.status(200).json(numberOfRaces);
};
