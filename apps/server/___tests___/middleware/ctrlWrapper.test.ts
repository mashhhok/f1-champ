import { Request, Response, NextFunction } from 'express';
import { ctrlWrapper } from '../../middleware/ctrlWrapper';

describe('ctrlWrapper', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {};
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the controller function and not call next on success', async () => {
    const mockController = jest.fn().mockResolvedValue(undefined);
    const wrappedController = ctrlWrapper(mockController);

    await wrappedController(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockController).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next with error when controller throws', async () => {
    const error = new Error('Controller error');
    const mockController = jest.fn().mockRejectedValue(error);
    const wrappedController = ctrlWrapper(mockController);

    await wrappedController(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockController).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('should handle controller that returns a Response object', async () => {
    const mockController = jest.fn().mockResolvedValue(mockResponse);
    const wrappedController = ctrlWrapper(mockController);

    await wrappedController(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockController).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle synchronous errors in controller', async () => {
    const error = new Error('Sync error');
    const mockController = jest.fn().mockImplementation(() => {
      throw error;
    });
    const wrappedController = ctrlWrapper(mockController);

    await wrappedController(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockController).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('should preserve the original controller function signature', () => {
    const mockController = jest.fn();
    const wrappedController = ctrlWrapper(mockController);

    expect(typeof wrappedController).toBe('function');
    expect(wrappedController.length).toBe(3); // req, res, next parameters
  });

  it('should handle custom error objects', async () => {
    const customError = {
      status: 404,
      message: 'Not Found',
      custom: true
    };
    const mockController = jest.fn().mockRejectedValue(customError);
    const wrappedController = ctrlWrapper(mockController);

    await wrappedController(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(customError);
  });
}); 