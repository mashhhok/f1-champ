import { Request, Response } from 'express';
import { getSeasonChampions } from '../../controllers/getSeasonChampions';
import { SeasonChampionsService } from '../../services/seasonChampionsService';
import { ISeasonWinner } from '../../models/seasonWinner';

// Mock the service
jest.mock('../../services/seasonChampionsService');

describe('getSeasonChampions Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockSeasonChampionsService: jest.Mocked<SeasonChampionsService>;

  beforeEach(() => {
    mockRequest = {};
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockSeasonChampionsService = {
      getSeasonChampions: jest.fn()
    } as any;

    (SeasonChampionsService as jest.MockedClass<typeof SeasonChampionsService>).mockImplementation(() => mockSeasonChampionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return season champions', async () => {
    const mockChampions: ISeasonWinner[] = [
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

    mockSeasonChampionsService.getSeasonChampions.mockResolvedValue(mockChampions);

    await getSeasonChampions(mockRequest as Request, mockResponse as Response);

    expect(mockSeasonChampionsService.getSeasonChampions).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockChampions);
  });

  it('should handle service errors', async () => {
    const error = new Error('Service error');
    mockSeasonChampionsService.getSeasonChampions.mockRejectedValue(error);

    await expect(getSeasonChampions(mockRequest as Request, mockResponse as Response))
      .rejects.toThrow('Service error');

    expect(mockSeasonChampionsService.getSeasonChampions).toHaveBeenCalled();
  });

  it('should handle empty champions list', async () => {
    const mockChampions: ISeasonWinner[] = [];
    mockSeasonChampionsService.getSeasonChampions.mockResolvedValue(mockChampions);

    await getSeasonChampions(mockRequest as Request, mockResponse as Response);

    expect(mockSeasonChampionsService.getSeasonChampions).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockChampions);
  });
}); 