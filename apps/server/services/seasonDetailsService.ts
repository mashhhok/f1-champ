import { fetchWithRetry } from "../utils/fetchRetryFunction";
import { logger } from "../utils/logger";

export class SeasonDetailsService {
    private readonly logger = logger.child({ className: 'SeasonDetailsService' });
    
    async getNumberOfRaces(season: string): Promise<any> {
        const baseUrl = `https://api.jolpi.ca/ergast/f1/${season}`;
    
        const data = await fetchWithRetry<any>(baseUrl);

        if (!data) {
            this.logger.error(`Failed to fetch race data for season ${season}`);
            return 0;
        }

        const numberOfRaces = data.MRData.total;

        return numberOfRaces;
    }
}