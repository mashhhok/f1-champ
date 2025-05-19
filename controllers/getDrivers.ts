import axios from "axios";
import Driver from "../models/Drivers";

export const getDrivers = async (req: any, res: any) => {
    const { seasons } = req.params;
  
    const urls = [
      "https://api.jolpi.ca/ergast/f1/2025/results/",
      "https://api.jolpi.ca/ergast/f1/2025/results/?offset=30",
      "https://api.jolpi.ca/ergast/f1/2025/results/?offset=60",
      "https://api.jolpi.ca/ergast/f1/2025/results/?offset=90",
      "https://api.jolpi.ca/ergast/f1/2025/results/?offset=120"
    ];
  
  
      const responses = await Promise.all(urls.map((url) => axios.get(url)));
      const responseData = responses.map((response) => response.data);
  
      const driverArray: any[] = [];
  
      responseData.forEach((raceData: any) => {
        const races = raceData.MRData.RaceTable.Races;

        const winners = races.results.map((result: any) => result.position == 1);
  
        races.forEach((race: any) => {
        
          const raceName = race.raceName;
          const season = race.season;
  
          const winnerResult = race.Results[0];
          const driver = winnerResult.Driver;
  
          driverArray.push({
            raceName,
            season,
            givenName: driver.givenName,
            familyName: driver.familyName,
            dateOfBirth: driver.dateOfBirth,
            nationality: driver.nationality,
          });
        });
      });
  
      await Driver.insertMany(driverArray);
  
  
      const drivers = await Driver.find({ season: seasons });
      res.json(drivers);
  
  };