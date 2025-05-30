import { RaceWinnersService } from '../../services/raceWinnersService';
import { redisClient } from '../../utils/redisClient';
import Driver from '../../models/drivers';
import { fetchWithRetry } from '../../utils/fetchRetryFunction';

// Mock dependencies
jest.mock('../../utils/redisClient');
jest.mock('../../models/drivers');
jest.mock('../../utils/fetchRetryFunction');

const mockRedisClient = redisClient as jest.Mocked<typeof redisClient>;
const mockDriver = Driver as jest.Mocked<typeof Driver>;
const mockFetchWithRetry = fetchWithRetry as jest.MockedFunction<typeof fetchWithRetry>;

describe('RaceWinnersService', () => {
  let service: RaceWinnersService;

  beforeEach(() => {
    service = new RaceWinnersService();
    jest.clearAllMocks();
  });

  describe('getRaceWinners', () => {
    const season = '2023';
    const cacheKey = `raceWinners:${season}`;

    it('should return cached data when available', async () => {
      const cachedData = [
        {
          driverId: 'verstappen',
          givenName: 'Max',
          familyName: 'Verstappen',
          season: '2023'
        }
      ];

      mockRedisClient.get.mockResolvedValue(JSON.stringify(cachedData));

      const result = await service.getRaceWinners(season);

      expect(mockRedisClient.get).toHaveBeenCalledWith(cacheKey);
      expect(result).toEqual(cachedData);
      expect(mockDriver.find).not.toHaveBeenCalled();
    });

    it('should return database data when cache is empty but DB has data', async () => {
      const dbData = [
        {
          driverId: 'verstappen',
          givenName: 'Max',
          familyName: 'Verstappen',
          season: '2023'
        }
      ];

      mockRedisClient.get.mockResolvedValue(null);
      (mockDriver.find as jest.Mock).mockResolvedValue(dbData);

      const result = await service.getRaceWinners(season);

      expect(mockRedisClient.get).toHaveBeenCalledWith(cacheKey);
      expect(mockDriver.find).toHaveBeenCalledWith({ season });
      expect(mockRedisClient.set).toHaveBeenCalledWith(cacheKey, JSON.stringify(dbData));
      expect(result).toEqual(dbData);
    });

    it('should fetch from API when cache and DB are empty', async () => {
      const apiResponse = {
        MRData: {
          RaceTable: {
            Races: [
              {
                season: '2023',
                raceName: 'Bahrain Grand Prix',
                url: 'http://example.com/race',
                date: '2023-03-05',
                Results: [
                  {
                    position: '1',
                    Driver: {
                      driverId: 'verstappen',
                      givenName: 'Max',
                      familyName: 'Verstappen',
                      url: 'http://example.com/driver',
                      dateOfBirth: '1997-09-30',
                      nationality: 'Dutch',
                      permanentNumber: '33'
                    },
                    Constructor: {
                      name: 'Red Bull Racing',
                      url: 'http://example.com/team'
                    },
                    laps: '57',
                    Time: { time: '1:31:12.258' }
                  }
                ]
              }
            ]
          }
        }
      };

      mockRedisClient.get.mockResolvedValue(null);
      (mockDriver.find as jest.Mock).mockResolvedValue([]);
      mockFetchWithRetry.mockResolvedValue(apiResponse);
      (mockDriver.insertMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getRaceWinners(season);

      expect(mockFetchWithRetry).toHaveBeenCalledTimes(1);
      expect(mockDriver.insertMany).toHaveBeenCalled();
      expect(mockRedisClient.set).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].driverId).toBe('verstappen');
    });

    it('should throw error when no race winners found', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      (mockDriver.find as jest.Mock).mockResolvedValue([]);
      mockFetchWithRetry.mockResolvedValue(null);

      await expect(service.getRaceWinners(season)).rejects.toThrow(
        `Failed to fetch race winners for season ${season}`
      );
    });

    it('should handle API fetch failures gracefully', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      (mockDriver.find as jest.Mock).mockResolvedValue([]);
      mockFetchWithRetry.mockResolvedValue(null);

      await expect(service.getRaceWinners(season)).rejects.toThrow();
    });

    it('should aggregate multiple race wins for the same driver', async () => {
      const apiResponse = {
        MRData: {
          RaceTable: {
            Races: [
              {
                season: '2023',
                raceName: 'Bahrain Grand Prix',
                url: 'http://example.com/race1',
                date: '2023-03-05',
                Results: [
                  {
                    position: '1',
                    Driver: {
                      driverId: 'verstappen',
                      givenName: 'Max',
                      familyName: 'Verstappen',
                      url: 'http://example.com/driver',
                      dateOfBirth: '1997-09-30',
                      nationality: 'Dutch',
                      permanentNumber: '33'
                    },
                    Constructor: {
                      name: 'Red Bull Racing',
                      url: 'http://example.com/team'
                    },
                    laps: '57',
                    Time: { time: '1:31:12.258' }
                  }
                ]
              },
              {
                season: '2023',
                raceName: 'Saudi Arabian Grand Prix',
                url: 'http://example.com/race2',
                date: '2023-03-19',
                Results: [
                  {
                    position: '1',
                    Driver: {
                      driverId: 'verstappen',
                      givenName: 'Max',
                      familyName: 'Verstappen',
                      url: 'http://example.com/driver',
                      dateOfBirth: '1997-09-30',
                      nationality: 'Dutch',
                      permanentNumber: '33'
                    },
                    Constructor: {
                      name: 'Red Bull Racing',
                      url: 'http://example.com/team'
                    },
                    laps: '50',
                    Time: { time: '1:21:14.894' }
                  }
                ]
              }
            ]
          }
        }
      };

      mockRedisClient.get.mockResolvedValue(null);
      (mockDriver.find as jest.Mock).mockResolvedValue([]);
      // Mock the first call to return data, others to return null to avoid duplication
      mockFetchWithRetry
        .mockResolvedValueOnce(apiResponse)
        .mockResolvedValue(null);
      (mockDriver.insertMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getRaceWinners(season);

      expect(result).toHaveLength(1);
      expect(result[0].race).toHaveLength(2);
      expect(result[0].race?.[0].raceName).toBe('Bahrain Grand Prix');
      expect(result[0].race?.[1].raceName).toBe('Saudi Arabian Grand Prix');
    });
  });
}); 