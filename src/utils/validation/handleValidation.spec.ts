import { handleValidation } from './handleValidation';

describe('handleValidation', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'development';
  });

  afterAll(() => {
    process.env.NODE_ENV = originalNodeEnv;
    jest.restoreAllMocks();
  });

  it('should throw an error if there are validation errors', () => {
    const errors = ['error1', 'error2'];
    const warnings: string[] = [];

    expect(() => handleValidation(errors, warnings)).toThrow('TextMotion: error1, error2');
    expect(consoleErrorSpy).toHaveBeenCalledWith('TextMotion validation errors:', errors);
  });

  it('should log warnings if there are validation warnings', () => {
    const errors: string[] = [];
    const warnings = ['warning1', 'warning2'];

    handleValidation(errors, warnings);
    expect(consoleWarnSpy).toHaveBeenCalledWith('TextMotion validation warnings:', warnings);
  });

  it('should do nothing if there are no errors or warnings', () => {
    const errors: string[] = [];
    const warnings: string[] = [];

    expect(() => handleValidation(errors, warnings)).not.toThrow();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  describe('in production environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should not throw an error even if there are errors', () => {
      const errors = ['error1'];
      const warnings: string[] = [];

      expect(() => handleValidation(errors, warnings)).not.toThrow();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should not log warnings even if there are warnings', () => {
      const errors: string[] = [];
      const warnings = ['warning1'];

      handleValidation(errors, warnings);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });
});
