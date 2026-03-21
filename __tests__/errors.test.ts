import { parseErrorCode, ApiError, ParsedError, ErrorCategory, ERROR_CATEGORY_MAP } from '@/types/errors';

describe('parseErrorCode', () => {
  it('should extract first part as category key', () => {
    const result = parseErrorCode('TRIP_NOT_FOUND');
    expect(result.code).toBe('TRIP_NOT_FOUND');
  });

  it('should handle AUTH prefixed codes', () => {
    const result = parseErrorCode('AUTH_FAILED');
    expect(result.category).toBe('auth');
    expect(result.i18nKey).toBe('errors.auth.failed');
  });

  it('should handle TOKEN prefixed codes', () => {
    const result = parseErrorCode('TOKEN_EXPIRED');
    expect(result.category).toBe('auth');
  });

  it('should handle SESSION prefixed codes', () => {
    const result = parseErrorCode('SESSION_EXPIRED');
    expect(result.category).toBe('auth');
  });

  it('should handle VIDEO prefixed codes', () => {
    const result = parseErrorCode('VIDEO_UNAVAILABLE');
    expect(result.category).toBe('video');
  });

  it('should handle URL prefixed codes', () => {
    const result = parseErrorCode('URL_INVALID');
    expect(result.category).toBe('video');
  });

  it('should handle NETWORK prefixed codes', () => {
    const result = parseErrorCode('NETWORK_ERROR');
    expect(result.category).toBe('network');
  });

  it('should handle SERVER prefixed codes', () => {
    const result = parseErrorCode('SERVER_ERROR');
    expect(result.category).toBe('server');
  });

  it('should return unknown for unrecognized prefixes', () => {
    const result = parseErrorCode('SOME_RANDOM_ERROR');
    expect(result.category).toBe('unknown');
    expect(result.i18nKey).toBe('errors.unknown');
  });

  it('should handle empty string', () => {
    const result = parseErrorCode('');
    expect(result.category).toBe('unknown');
  });
});

describe('ERROR_CATEGORY_MAP', () => {
  it('should have auth mappings', () => {
    expect(ERROR_CATEGORY_MAP['AUTH']).toBe('auth');
    expect(ERROR_CATEGORY_MAP['TOKEN']).toBe('auth');
    expect(ERROR_CATEGORY_MAP['SESSION']).toBe('auth');
  });

  it('should have video mappings', () => {
    expect(ERROR_CATEGORY_MAP['VIDEO']).toBe('video');
    expect(ERROR_CATEGORY_MAP['URL']).toBe('video');
    expect(ERROR_CATEGORY_MAP['ANALYSIS']).toBe('video');
  });

  it('should have network mappings', () => {
    expect(ERROR_CATEGORY_MAP['NETWORK']).toBe('network');
    expect(ERROR_CATEGORY_MAP['TIMEOUT']).toBe('network');
    expect(ERROR_CATEGORY_MAP['CONNECTION']).toBe('network');
  });

  it('should have server mappings', () => {
    expect(ERROR_CATEGORY_MAP['SERVER']).toBe('server');
    expect(ERROR_CATEGORY_MAP['DATABASE']).toBe('server');
    expect(ERROR_CATEGORY_MAP['INTERNAL']).toBe('server');
  });
});

describe('ApiError interface', () => {
  it('should accept valid ApiError structure', () => {
    const error: ApiError = {
      code: 'TRIP_NOT_FOUND',
      message: 'Voyage introuvable',
      details: 'Additional details',
    };
    expect(error.code).toBe('TRIP_NOT_FOUND');
    expect(error.message).toBe('Voyage introuvable');
  });

  it('should work with optional fields', () => {
    const error: ApiError = {
      code: 'SERVER_ERROR',
    };
    expect(error.code).toBe('SERVER_ERROR');
    expect(error.message).toBeUndefined();
    expect(error.details).toBeUndefined();
  });
});
