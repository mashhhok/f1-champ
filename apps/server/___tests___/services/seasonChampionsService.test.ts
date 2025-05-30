import { SeasonChampionsService } from '../../services/seasonChampionsService';
import { redisClient } from '../../utils/redisClient';
import SeasonWinner from '../../models/seasonWinner';
import { fetchWithRetry } from '../../utils/fetchRetryFunction';

// Mock dependencies
jest.mock('../../utils/redisClient');
jest.mock('../../models/seasonWinner');
jest.mock('../../utils/fetchRetryFunction');

const mockRedisClient = redisClient as jest.Mocked<typeof redisClient>;
const mockSeasonWinner = SeasonWinner as jest.Mocked<typeof SeasonWinner>;
const mockFetchWithRetry = fetchWithRetry as jest.MockedFunction<typeof fetchWithRetry>;

describe('SeasonChampionsService', () => {
  let service: SeasonChampionsService;

  beforeEach(() => {
    service = new SeasonChampionsService();
    jest.clearAllMocks();
    
    // Ensure the mock is properly set up for each test
    (mockSeasonWinner.find as jest.Mock).mockReturnValue({
      lean: jest.fn()
    });
    
    // Mock the create method
    (mockSeasonWinner.create as jest.Mock) = jest.fn();
    
    // Mock Redis methods
    mockRedisClient.setEx = jest.fn();
    
    // Mock current year to make tests predictable
    jest.spyOn(Date.prototype, 'getFullYear').mockReturnValue(2007); // Use 2007 to have fewer years to mock
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getSeasonChampions', () => {
    it('should return cached champions when all data is in Redis', async () => {
      const cachedChampions = [
        { season: '2005', givenName: 'Fernando', familyName: 'Alonso' },
        { season: '2006', givenName: 'Fernando', familyName: 'Alonso' },
        { season: '2007', givenName: 'Kimi', familyName: 'Raikkonen' }
      ];

      // Mock Redis to return cached data for all years (2005-2007)
      mockRedisClient.get
        .mockResolvedValueOnce(JSON.stringify(cachedChampions[0]))
        .mockResolvedValueOnce(JSON.stringify(cachedChampions[1]))
        .mockResolvedValueOnce(JSON.stringify(cachedChampions[2]));

      const result = await service.getSeasonChampions();

      expect(result).toHaveLength(3);
      expect(result[0].season).toBe('2005');
      expect(result[1].season).toBe('2006');
      expect(result[2].season).toBe('2007');
      expect(mockSeasonWinner.find).not.toHaveBeenCalled();
    });

    it('should fetch from database when cache is empty', async () => {
      const dbChampions = [
        { season: '2005', givenName: 'Fernando', familyName: 'Alonso' },
        { season: '2006', givenName: 'Fernando', familyName: 'Alonso' },
        { season: '2007', givenName: 'Kimi', familyName: 'Raikkonen' }
      ];

      // Mock Redis to return null for all years
      mockRedisClient.get.mockResolvedValue(null);
      const mockLean = jest.fn().mockResolvedValue(dbChampions);
      (mockSeasonWinner.find as jest.Mock).mockReturnValue({ lean: mockLean });

      const result = await service.getSeasonChampions();

      expect(mockSeasonWinner.find).toHaveBeenCalled();
      expect(mockLean).toHaveBeenCalled();
      expect(mockRedisClient.set).toHaveBeenCalledTimes(3); // Cache each champion
      expect(result).toEqual(dbChampions);
    });

    it('should fetch from API when data is missing from cache and DB', async () => {
      const apiResponse = {
        MRData: {
          StandingsTable: {
            StandingsLists: [
              {
                DriverStandings: [
                  {
                    position: '1',
                    Driver: {
                      givenName: 'Fernando',
                      familyName: 'Alonso'
                    }
                  }
                ]
              }
            ]
          }
        }
      };

      mockRedisClient.get.mockResolvedValue(null);
      const mockLean = jest.fn().mockResolvedValue([]);
      (mockSeasonWinner.find as jest.Mock).mockReturnValue({ lean: mockLean });
      mockFetchWithRetry.mockResolvedValue(apiResponse);
      
      // Mock the create method to return documents with toObject method
      const createdChampion = {
        season: '2005',
        givenName: 'Fernando',
        familyName: 'Alonso',
        isSeasonEnded: true,
        toObject: jest.fn().mockReturnValue({
          season: '2005',
          givenName: 'Fernando',
          familyName: 'Alonso',
          isSeasonEnded: true
        })
      };
      (mockSeasonWinner.create as jest.Mock).mockResolvedValue([createdChampion]);

      const result = await service.getSeasonChampions();

      expect(mockFetchWithRetry).toHaveBeenCalled();
      expect(mockSeasonWinner.create).toHaveBeenCalled();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle API failures gracefully', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      const mockLean = jest.fn().mockResolvedValue([]);
      (mockSeasonWinner.find as jest.Mock).mockReturnValue({ lean: mockLean });
      mockFetchWithRetry.mockResolvedValue(null);

      const result = await service.getSeasonChampions();

      expect(result).toEqual([]);
    });

    it('should sort champions by season', async () => {
      const unsortedChampions = [
        { season: '2007', givenName: 'Kimi', familyName: 'Raikkonen' },
        { season: '2005', givenName: 'Fernando', familyName: 'Alonso' },
        { season: '2006', givenName: 'Fernando', familyName: 'Alonso' }
      ];

      mockRedisClient.get.mockResolvedValue(null);
      const mockLean = jest.fn().mockResolvedValue(unsortedChampions);
      (mockSeasonWinner.find as jest.Mock).mockReturnValue({ lean: mockLean });

      const result = await service.getSeasonChampions();

      expect(result[0].season).toBe('2005');
      expect(result[1].season).toBe('2006');
      expect(result[2].season).toBe('2007');
    });

    it('should cache data from database', async () => {
      const dbChampions = [
        { season: '2005', givenName: 'Fernando', familyName: 'Alonso' }
      ];

      mockRedisClient.get.mockResolvedValue(null);
      const mockLean = jest.fn().mockResolvedValue(dbChampions);
      (mockSeasonWinner.find as jest.Mock).mockReturnValue({ lean: mockLean });

      await service.getSeasonChampions();

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'season:2005',
        JSON.stringify(dbChampions[0])
      );
    });
  });

  describe('fetchChampion (private method)', () => {
    it('should handle API response with no standings', async () => {
      const apiResponse = {
        MRData: {
          StandingsTable: {
            StandingsLists: []
          }
        }
      };

      mockRedisClient.get.mockResolvedValue(null);
      const mockLean = jest.fn().mockResolvedValue([]);
      (mockSeasonWinner.find as jest.Mock).mockReturnValue({ lean: mockLean });
      mockFetchWithRetry.mockResolvedValue(apiResponse);

      const result = await service.getSeasonChampions();

      expect(result).toEqual([]);
    });

    it('should handle API response with no champion (position 1)', async () => {
      const apiResponse = {
        MRData: {
          StandingsTable: {
            StandingsLists: [
              {
                DriverStandings: [
                  {
                    position: '2',
                    Driver: {
                      givenName: 'Lewis',
                      familyName: 'Hamilton'
                    }
                  }
                ]
              }
            ]
          }
        }
      };

      mockRedisClient.get.mockResolvedValue(null);
      const mockLean = jest.fn().mockResolvedValue([]);
      (mockSeasonWinner.find as jest.Mock).mockReturnValue({ lean: mockLean });
      mockFetchWithRetry.mockResolvedValue(apiResponse);

      const result = await service.getSeasonChampions();

      expect(result).toEqual([]);
    });
  });
}); 