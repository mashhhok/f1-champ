import { Request, Response } from 'express';
import { getRaceWinners } from '../../controllers/getRaceWinners';
import { RaceWinnersService } from '../../services/raceWinnersService';
import { IDriver } from '../../models/Drivers';

// Mock the service
jest.mock('../../services/raceWinnersService');

describe('getRaceWinners Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockRaceWinnersService: jest.Mocked<RaceWinnersService>;

  beforeEach(() => {
    mockRequest = {
      params: { season: '2023' }
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockRaceWinnersService = {
      getRaceWinners: jest.fn()
    } as any;

    (RaceWinnersService as jest.MockedClass<typeof RaceWinnersService>).mockImplementation(() => mockRaceWinnersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return race winners for a valid season', async () => {
    const mockDrivers: IDriver[] = [
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

    mockRaceWinnersService.getRaceWinners.mockResolvedValue(mockDrivers);

    await getRaceWinners(mockRequest as Request, mockResponse as Response);

    expect(mockRaceWinnersService.getRaceWinners).toHaveBeenCalledWith('2023');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockDrivers);
  });

  it('should handle service errors', async () => {
    const error = new Error('Service error');
    mockRaceWinnersService.getRaceWinners.mockRejectedValue(error);

    await expect(getRaceWinners(mockRequest as Request, mockResponse as Response))
      .rejects.toThrow('Service error');

    expect(mockRaceWinnersService.getRaceWinners).toHaveBeenCalledWith('2023');
  });

  it('should handle missing season parameter', async () => {
    mockRequest.params = {};

    await getRaceWinners(mockRequest as Request, mockResponse as Response);

    expect(mockRaceWinnersService.getRaceWinners).toHaveBeenCalledWith(undefined);
  });
}); 