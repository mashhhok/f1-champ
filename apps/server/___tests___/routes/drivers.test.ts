import request from 'supertest';
import { app } from '../../app';
import { RaceWinnersService } from '../../services/raceWinnersService';
import { SeasonChampionsService } from '../../services/seasonChampionsService';
import { IDriver } from '../../models/drivers';

// Mock the services
jest.mock('../../services/raceWinnersService');
jest.mock('../../services/seasonChampionsService');

const mockRaceWinnersService = RaceWinnersService as jest.MockedClass<typeof RaceWinnersService>;
const mockSeasonChampionsService = SeasonChampionsService as jest.MockedClass<typeof SeasonChampionsService>;

describe('Drivers Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/:season/race-winners', () => {
    it('should return race winners for a valid season', async () => {
      const mockDrivers = [
        {
          driverId: 'verstappen',
          givenName: 'Max',
          familyName: 'Verstappen',
          season: '2023',
          dateOfBirth: '1997-09-30',
          nationality: 'Dutch',
          permanentNumber: '33',
          driverUrl: 'http://en.wikipedia.org/wiki/Max_Verstappen',
          teamName: 'Red Bull Racing',
          teamUrl: 'http://en.wikipedia.org/wiki/Red_Bull_Racing',
          laps: '57',
          time: '1:31:12.258',
          race: [{ raceName: 'Bahrain Grand Prix', raceUrl: 'http://example.com', raceDate: '2023-03-05' }]
        }
      ];

      const mockGetRaceWinners = jest.fn().mockResolvedValue(mockDrivers);
      mockRaceWinnersService.mockImplementation(() => ({
        getRaceWinners: mockGetRaceWinners
      }) as any);

      const response = await request(app)
        .get('/api/v1/2023/race-winners')
        .expect(200);

      expect(response.body).toEqual(mockDrivers);
      expect(mockGetRaceWinners).toHaveBeenCalledWith('2023');
    });

    it('should handle service errors', async () => {
      const mockGetRaceWinners = jest.fn().mockRejectedValue(new Error('Service error'));
      mockRaceWinnersService.mockImplementation(() => ({
        getRaceWinners: mockGetRaceWinners
      }) as any);

      const response = await request(app)
        .get('/api/v1/2023/race-winners')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message');
    });

    it('should handle different season formats', async () => {
      const mockDrivers: IDriver[] = [];
      const mockGetRaceWinners = jest.fn().mockResolvedValue(mockDrivers);
      mockRaceWinnersService.mockImplementation(() => ({
        getRaceWinners: mockGetRaceWinners
      }) as any);

      await request(app)
        .get('/api/v1/2022/race-winners')
        .expect(200);

      expect(mockGetRaceWinners).toHaveBeenCalledWith('2022');
    });
  });

  describe('GET /api/v1/champions', () => {
    it('should return season champions', async () => {
      const mockChampions = [
        {
          season: '2022',
          givenName: 'Max',
          familyName: 'Verstappen'
        },
        {
          season: '2023',
          givenName: 'Max',
          familyName: 'Verstappen'
        }
      ];

      const mockGetSeasonChampions = jest.fn().mockResolvedValue(mockChampions);
      mockSeasonChampionsService.mockImplementation(() => ({
        getSeasonChampions: mockGetSeasonChampions
      }) as any);

      const response = await request(app)
        .get('/api/v1/champions')
        .expect(200);

      expect(response.body).toEqual(mockChampions);
      expect(mockGetSeasonChampions).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const mockGetSeasonChampions = jest.fn().mockRejectedValue(new Error('Service error'));
      mockSeasonChampionsService.mockImplementation(() => ({
        getSeasonChampions: mockGetSeasonChampions
      }) as any);

      const response = await request(app)
        .get('/api/v1/champions')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message');
    });

    it('should return empty array when no champions found', async () => {
      const mockGetSeasonChampions = jest.fn().mockResolvedValue([]);
      mockSeasonChampionsService.mockImplementation(() => ({
        getSeasonChampions: mockGetSeasonChampions
      }) as any);

      const response = await request(app)
        .get('/api/v1/champions')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown-route')
        .expect(404);

      expect(response.body).toEqual({
        error: {
          message: 'Not Found',
          path: '/api/unknown-route',
          method: 'GET'
        }
      });
    });

    it('should return 404 for invalid API versions', async () => {
      const response = await request(app)
        .get('/api/v2/champions')
        .expect(404);

      expect(response.body).toEqual({
        error: {
          message: 'Not Found',
          path: '/api/v2/champions',
          method: 'GET'
        }
      });
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const mockGetSeasonChampions = jest.fn().mockResolvedValue([]);
      mockSeasonChampionsService.mockImplementation(() => ({
        getSeasonChampions: mockGetSeasonChampions
      }) as any);

      const response = await request(app)
        .get('/api/v1/champions')
        .set('Origin', 'http://localhost:3000')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
  });

  describe('JSON Parsing', () => {
    it('should handle JSON requests', async () => {
      const mockGetSeasonChampions = jest.fn().mockResolvedValue([]);
      mockSeasonChampionsService.mockImplementation(() => ({
        getSeasonChampions: mockGetSeasonChampions
      }) as any);

      const response = await request(app)
        .get('/api/v1/champions')
        .set('Content-Type', 'application/json')
        .expect(200);

      expect(response.type).toBe('application/json');
    });
  });
}); 