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
    
    const responses = await Promise.all(urls.map(url => axios.get(url)));

    const responseData = responses.map((response) => response.data);

    const driverArray = responseData.map((race: any) => {
        console.log(race.MRData.RaceTable.Races);
        return {
            raceName: [race.MRData.RaceTable.Races[0].raceName],
            season: race.MRData.RaceTable.Races[0].season,
            givenName: race.MRData.RaceTable.Races[0].Results[0].Driver.givenName,
            familyName: race.MRData.RaceTable.Races[0].Results[0].Driver.familyName,
            dateOfBirth: race.MRData.RaceTable.Races[0].Results[0].Driver.dateOfBirth,
            nationality: race.MRData.RaceTable.Races[0].Results[0].Driver.nationality
        }
    })

    await Driver.insertMany(driverArray);


    const drivers = await Driver.find({ season: seasons });
    res.json(drivers);
}


