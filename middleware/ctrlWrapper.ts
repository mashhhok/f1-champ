export const ctrlWrapper = (ctrl: any) => {
    return async (req: any, res: any, next: any) => {
      try {
        await ctrl(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  };
