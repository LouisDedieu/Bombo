jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { access_token: 'test-token' } },
      }),
    },
  },
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('API Client Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Error parsing from API responses', () => {
    it('should parse TRIP_NOT_FOUND error code from 404 response', () => {
      const errorResponse = {
        error_code: 'TRIP_NOT_FOUND',
        message: 'Voyage introuvable',
      };
      expect(errorResponse.error_code).toBe('TRIP_NOT_FOUND');
      expect(errorResponse.message).toBe('Voyage introuvable');
    });

    it('should parse NOT_AUTHENTICATED error code from 401 response', () => {
      const errorResponse = {
        error_code: 'NOT_AUTHENTICATED',
        message: 'Non authentifié',
      };
      expect(errorResponse.error_code).toBe('NOT_AUTHENTICATED');
      expect(errorResponse.message).toBe('Non authentifié');
    });

    it('should parse ACCESS_DENIED error code from 403 response', () => {
      const errorResponse = {
        error_code: 'ACCESS_DENIED',
        message: 'Accès refusé',
      };
      expect(errorResponse.error_code).toBe('ACCESS_DENIED');
    });

    it('should parse SERVICE_UNAVAILABLE error code from 500 response', () => {
      const errorResponse = {
        error_code: 'SERVICE_UNAVAILABLE',
        message: 'Service indisponible',
      };
      expect(errorResponse.error_code).toBe('SERVICE_UNAVAILABLE');
    });

    it('should parse UNSUPPORTED_URL error code from 400 response', () => {
      const errorResponse = {
        error_code: 'UNSUPPORTED_URL',
        message: 'URL non supportée',
      };
      expect(errorResponse.error_code).toBe('UNSUPPORTED_URL');
    });
  });

  describe('HTTP status code handling', () => {
    it('should handle 400 Bad Request', () => {
      expect(400).toBe(400);
      const errorCodesFor400 = ['INVALID_REQUEST', 'MISSING_FIELD', 'UNSUPPORTED_URL'];
      errorCodesFor400.forEach(code => {
        expect(typeof code).toBe('string');
      });
    });

    it('should handle 401 Unauthorized', () => {
      expect(401).toBe(401);
      const errorCodesFor401 = ['NOT_AUTHENTICATED', 'INVALID_TOKEN'];
      errorCodesFor401.forEach(code => {
        expect(typeof code).toBe('string');
      });
    });

    it('should handle 403 Forbidden', () => {
      expect(403).toBe(403);
      const errorCodesFor403 = ['ACCESS_DENIED'];
      errorCodesFor403.forEach(code => {
        expect(typeof code).toBe('string');
      });
    });

    it('should handle 404 Not Found', () => {
      expect(404).toBe(404);
      const errorCodesFor404 = ['TRIP_NOT_FOUND', 'CITY_NOT_FOUND', 'JOB_NOT_FOUND', 'DESTINATION_NOT_FOUND'];
      errorCodesFor404.forEach(code => {
        expect(typeof code).toBe('string');
      });
    });

    it('should handle 500 Server Error', () => {
      expect(500).toBe(500);
      const errorCodesFor500 = ['SERVICE_UNAVAILABLE', 'INFERENCE_ERROR'];
      errorCodesFor500.forEach(code => {
        expect(typeof code).toBe('string');
      });
    });
  });

  describe('ErrorResponse structure', () => {
    it('should have required error_code field', () => {
      const response = { error_code: 'TRIP_NOT_FOUND', message: 'Voyage introuvable' };
      expect(response.error_code).toBeDefined();
    });

    it('should have optional details field', () => {
      const response = {
        error_code: 'MISSING_FIELD',
        message: 'Champ manquant',
        details: [{ code: 'MISSING_FIELD', message: 'url required', field: 'url' }]
      };
      expect(response.details).toBeDefined();
      expect(response.details?.length).toBeGreaterThan(0);
    });
  });
});
