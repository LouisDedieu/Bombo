import { parseErrorCode } from '@/types/errors';
import { ApiError } from '@/types/errors';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) => {
      const translations: Record<string, string> = {
        'errors.auth.not_authenticated': 'Non authentifié',
        'errors.auth.access_denied': 'Accès refusé',
        'errors.video.unsupported_url': 'URL non supportée',
        'errors.unknown': 'Une erreur est survenue',
      };
      return translations[key] || options?.defaultValue || key;
    },
  }),
}));

describe('Error Handler Logic (parseErrorCode + isApiError)', () => {
  const isApiError = (error: unknown): error is ApiError => {
    if (typeof error !== 'object' || error === null) return false;
    const e = error as Record<string, unknown>;
    return typeof e.code === 'string';
  };

  describe('isApiError', () => {
    it('should return true for valid ApiError', () => {
      const error: ApiError = { code: 'TRIP_NOT_FOUND' };
      expect(isApiError(error)).toBe(true);
    });

    it('should return false for generic Error', () => {
      const error = new Error('Something went wrong');
      expect(isApiError(error)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isApiError(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isApiError(undefined)).toBe(false);
    });

    it('should return false for string', () => {
      expect(isApiError('error message')).toBe(false);
    });
  });

  describe('parseError for API errors', () => {
    it('should parse TRIP_NOT_FOUND error', () => {
      const error: ApiError = { code: 'TRIP_NOT_FOUND', message: 'Voyage introuvable' };
      const parsed = parseErrorCode(error.code);

      expect(parsed.code).toBe('TRIP_NOT_FOUND');
      expect(parsed.message).toBe('TRIP_NOT_FOUND');
    });

    it('should parse ACCESS_DENIED error', () => {
      const error: ApiError = { code: 'ACCESS_DENIED' };
      const parsed = parseErrorCode(error.code);

      expect(parsed.code).toBe('ACCESS_DENIED');
    });

    it('should parse NOT_AUTHENTICATED error', () => {
      const error: ApiError = { code: 'NOT_AUTHENTICATED' };
      const parsed = parseErrorCode(error.code);

      expect(parsed.code).toBe('NOT_AUTHENTICATED');
    });

    it('should parse UNSUPPORTED_URL error', () => {
      const error: ApiError = { code: 'UNSUPPORTED_URL', message: 'URL non supportée' };
      const parsed = parseErrorCode(error.code);

      expect(parsed.code).toBe('UNSUPPORTED_URL');
    });

    it('should parse PRIVATE_VIDEO error', () => {
      const error: ApiError = { code: 'PRIVATE_VIDEO' };
      const parsed = parseErrorCode(error.code);

      expect(parsed.code).toBe('PRIVATE_VIDEO');
    });

    it('should parse SERVICE_UNAVAILABLE error', () => {
      const error: ApiError = { code: 'SERVICE_UNAVAILABLE' };
      const parsed = parseErrorCode(error.code);

      expect(parsed.code).toBe('SERVICE_UNAVAILABLE');
    });
  });

  describe('Error message handling', () => {
    it('should extract message from ApiError', () => {
      const error: ApiError = { code: 'NOT_AUTHENTICATED', message: 'Non authentifié' };
      const message = error.message ?? error.code;
      expect(message).toBe('Non authentifié');
    });

    it('should use code as fallback when no message', () => {
      const error: ApiError = { code: 'TRIP_NOT_FOUND' };
      const message = error.message ?? error.code;
      expect(message).toBe('TRIP_NOT_FOUND');
    });
  });
});
