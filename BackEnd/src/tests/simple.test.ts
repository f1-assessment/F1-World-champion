/**
 * Simple test file to verify Jest setup works
 * Run with: npm test
 */

describe('Basic Test Suite', () => {
  test('should verify Jest is working', () => {
    expect(1 + 1).toBe(2);
    expect('hello').toBe('hello');
    expect(true).toBeTruthy();
  });

  test('should test array operations', () => {
    const array = [1, 2, 3];
    expect(array).toHaveLength(3);
    expect(array).toContain(2);
    expect(array.map(x => x * 2)).toEqual([2, 4, 6]);
  });

  test('should test object operations', () => {
    const race = {
      season: '2024',
      round: '1',
      name: 'Bahrain Grand Prix'
    };

    expect(race).toHaveProperty('season', '2024');
    expect(race).toMatchObject({
      season: '2024',
      round: '1'
    });
  });

  test('should test async operations', async () => {
    const asyncFunction = async (value: number): Promise<number> => {
      return new Promise(resolve => {
        setTimeout(() => resolve(value * 2), 10);
      });
    };

    const result = await asyncFunction(5);
    expect(result).toBe(10);
  });

  test('should test error handling', () => {
    const throwError = () => {
      throw new Error('Test error');
    };

    expect(throwError).toThrow('Test error');
    expect(throwError).toThrow(Error);
  });
});

describe('F1 Data Utilities', () => {
  const validateSeason = (season: string): boolean => {
    const year = parseInt(season);
    return year >= 1950 && year <= new Date().getFullYear() + 1;
  };

  const validateRound = (round: string): boolean => {
    const roundNum = parseInt(round);
    return roundNum >= 1 && roundNum <= 25;
  };

  test('should validate F1 seasons', () => {
    expect(validateSeason('2024')).toBe(true);
    expect(validateSeason('1950')).toBe(true);
    expect(validateSeason('1949')).toBe(false);
    expect(validateSeason('2030')).toBe(false);
  });

  test('should validate race rounds', () => {
    expect(validateRound('1')).toBe(true);
    expect(validateRound('25')).toBe(true);
    expect(validateRound('0')).toBe(false);
    expect(validateRound('26')).toBe(false);
  });
});

describe('Mock Test Examples', () => {
  test('should mock a function', () => {
    const mockFn = jest.fn();
    mockFn('hello');
    mockFn('world');

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('hello');
    expect(mockFn).toHaveBeenLastCalledWith('world');
  });

  test('should mock return values', () => {
    const mockFn = jest.fn();
    mockFn.mockReturnValue('mocked value');
    mockFn.mockReturnValueOnce('first call');

    expect(mockFn()).toBe('first call');
    expect(mockFn()).toBe('mocked value');
  });

  test('should mock async functions', async () => {
    const mockAsyncFn = jest.fn();
    mockAsyncFn.mockResolvedValue('async result');

    const result = await mockAsyncFn();
    expect(result).toBe('async result');
  });
});

describe('Test Environment', () => {
  test('should have access to process.env', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  test('should be running in test environment', () => {
    // This would be true if NODE_ENV is set to 'test'
    // For now, just verify we can check the environment
    expect(typeof process.env.NODE_ENV).toBe('string');
  });
}); 