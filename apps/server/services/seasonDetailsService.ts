import { fetchWithRetry } from "../utils/fetchRetryFunction";

export class SeasonDetailsService {
    async getNumberOfRaces(season: string): Promise<any> {
        const baseUrl = `https://api.jolpi.ca/ergast/f1/${season}`;
    
        const data = await fetchWithRetry<any>(baseUrl);

        if (!data) {
            console.error(`Failed to fetch race data for season ${season}`);
            return 0;
        }

        const numberOfRaces = data.MRData.total;

        return numberOfRaces;
    }
}