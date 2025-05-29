import axios from "axios";

export class SeasonDetailsService {
    async getNumberOfRaces(season: string): Promise<any> {
        const baseUrl = `https://api.jolpi.ca/ergast/f1/${season}`;
    
        const response = await axios.get(baseUrl);

        const numberOfRaces = response.data.MRData.total;

        return numberOfRaces;
    }
}