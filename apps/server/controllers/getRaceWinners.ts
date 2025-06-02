import { Request, Response } from "express";
import { RaceWinnersService } from "../services/raceWinnersService";
import { RaceResult, F1ApiResponse } from '@f1-champ/shared-types';


export const getRaceWinners = async (
  req: Request,
  res: Response
): Promise<void> => {

    const { season } = req.params;
    const raceWinnersService = new RaceWinnersService();
    
    const driverArray = await raceWinnersService.getRaceWinners(season);
    res.status(200).json(driverArray);
};
