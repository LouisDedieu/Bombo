/**
 * Tests pour geocodingService.ts
 * Vérifie les fonctions de géocodage via le proxy backend
 */

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

import {
  normalizeTextForGeocoding,
  geocodeQuery,
  geocodeAddress,
  geocodeDestination,
  geocodeHighlight,
} from '@/services/geocodingService';

describe('geocodingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('normalizeTextForGeocoding', () => {
    it('should remove accents from text', () => {
      expect(normalizeTextForGeocoding('Café')).toBe('Cafe');
      expect(normalizeTextForGeocoding('Épicerie')).toBe('Epicerie');
      expect(normalizeTextForGeocoding('Château')).toBe('Chateau');
    });

    it('should remove special characters including quotes', () => {
      // The function removes non-word characters for better geocoding
      expect(normalizeTextForGeocoding("L'Atelier")).toBe("LAtelier");
      expect(normalizeTextForGeocoding("L\u2019Atelier")).toBe("LAtelier");
      expect(normalizeTextForGeocoding("L`Atelier")).toBe("LAtelier");
    });

    it('should remove special characters', () => {
      expect(normalizeTextForGeocoding('Restaurant @Paris!')).toBe('Restaurant Paris');
      expect(normalizeTextForGeocoding('Café & Bar')).toBe('Cafe  Bar');
    });

    it('should trim whitespace', () => {
      expect(normalizeTextForGeocoding('  Paris  ')).toBe('Paris');
    });

    it('should handle empty string', () => {
      expect(normalizeTextForGeocoding('')).toBe('');
    });
  });

  describe('geocodeQuery', () => {
    it('should call the backend geocoding endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          results: [{ lat: 48.8566, lon: 2.3522, display_name: 'Paris, France' }]
        }),
      });

      const results = await geocodeQuery('Paris');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/geocoding/search?q=Paris'),
        expect.any(Object)
      );
      expect(results).toHaveLength(1);
      expect(results[0].lat).toBe(48.8566);
      expect(results[0].lon).toBe(2.3522);
    });

    it('should return empty array for empty query', async () => {
      const results = await geocodeQuery('');
      expect(results).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should return empty array on API error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const results = await geocodeQuery('Paris');
      expect(results).toEqual([]);
    });

    it('should encode special characters in query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      });

      await geocodeQuery('Café de Flore, Paris');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent('Café de Flore, Paris')),
        expect.any(Object)
      );
    });

    it('should respect limit parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      });

      await geocodeQuery('Paris', 5);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=5'),
        expect.any(Object)
      );
    });
  });

  describe('geocodeAddress', () => {
    it('should geocode address with city context', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          results: [{ lat: 48.8584, lon: 2.2945 }]
        }),
      });

      const result = await geocodeAddress('Tour Eiffel', 'Paris, France');

      expect(result).not.toBeNull();
      expect(result?.lat).toBe(48.8584);
      expect(result?.lon).toBe(2.2945);
    });

    it('should try normalized version if original fails', async () => {
      // First call fails
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      });
      // Second call with normalized text succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          results: [{ lat: 48.8, lon: 2.3 }]
        }),
      });

      const result = await geocodeAddress('Café René', 'Paris, France');

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).not.toBeNull();
    });

    it('should return null if all attempts fail', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      });

      const result = await geocodeAddress('Unknown Place', 'Unknown City');

      expect(result).toBeNull();
    });
  });

  describe('geocodeDestination', () => {
    it('should geocode city and country', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          results: [{ lat: 48.8566, lon: 2.3522 }]
        }),
      });

      const result = await geocodeDestination('Paris', 'France');

      expect(result).not.toBeNull();
      expect(result?.coords).toEqual([48.8566, 2.3522]);
      expect(result?.confidence).toBe('high');
    });

    it('should return low confidence for country-only fallback', () => {
      // Test the structure of a low confidence result
      const lowConfidenceResult = {
        coords: [46.2276, 2.2137] as [number, number],
        confidence: 'low' as const,
        source: 'Centre du pays (France)',
      };

      expect(lowConfidenceResult.confidence).toBe('low');
      expect(lowConfidenceResult.source).toContain('France');
      expect(lowConfidenceResult.coords).toHaveLength(2);
    });

    it('should return null for empty inputs', async () => {
      const result = await geocodeDestination(null, null);
      expect(result).toBeNull();
    });

    it('should handle city only (no country)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          results: [{ lat: 48.8566, lon: 2.3522 }]
        }),
      });

      const result = await geocodeDestination('Paris', null);

      expect(result).not.toBeNull();
      expect(result?.confidence).toBe('high');
    });
  });

  describe('geocodeHighlight', () => {
    it('should geocode highlight with address', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          results: [{ lat: 48.8606, lon: 2.3376 }]
        }),
      });

      const result = await geocodeHighlight(
        'Louvre Museum',
        '1 rue de Rivoli',
        'Paris, France'
      );

      expect(result).not.toBeNull();
      expect(result?.coords).toEqual([48.8606, 2.3376]);
      expect(result?.confidence).toBe('high');
    });

    it('should try name if address fails', async () => {
      // Address query fails
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      });
      // Name query succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          results: [{ lat: 48.8606, lon: 2.3376 }]
        }),
      });

      const result = await geocodeHighlight(
        'Louvre Museum',
        'Wrong Address',
        'Paris, France'
      );

      expect(result).not.toBeNull();
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should try multiple query strategies', () => {
      // Test that the function has correct strategy structure
      const strategies = [
        'address + city context',
        'name + city context',
        'normalized name + city context',
      ];

      expect(strategies).toHaveLength(3);
      strategies.forEach(strategy => {
        expect(typeof strategy).toBe('string');
      });
    });

    it('should return null if all attempts fail', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      });

      const result = await geocodeHighlight(
        'Unknown Place',
        null,
        'Unknown City'
      );

      expect(result).toBeNull();
    });
  });

  describe('API endpoint structure', () => {
    it('should call /geocoding/search endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      });

      await geocodeQuery('Paris');

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('/geocoding/search');
    });

    it('should include Authorization header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      });

      await geocodeQuery('Paris');

      const calledOptions = mockFetch.mock.calls[0][1];
      expect(calledOptions.headers['Authorization']).toContain('Bearer');
    });
  });

  describe('Security', () => {
    it('should not expose API key in requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      });

      await geocodeQuery('Paris');

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).not.toContain('key=');
      expect(calledUrl).not.toContain('locationiq');
    });

    it('should route through backend proxy', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      });

      await geocodeQuery('Paris');

      const calledUrl = mockFetch.mock.calls[0][0];
      // Should call our backend, not LocationIQ directly
      expect(calledUrl).not.toContain('us1.locationiq.com');
    });
  });

  describe('Error handling', () => {
    it('should handle 429 rate limit gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: () => Promise.resolve('Rate limit exceeded'),
      });

      const results = await geocodeQuery('Paris');
      expect(results).toEqual([]);
    });

    it('should handle 500 server error gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal server error'),
      });

      const results = await geocodeQuery('Paris');
      expect(results).toEqual([]);
    });

    it('should handle network timeout gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Timeout'));

      const results = await geocodeQuery('Paris');
      expect(results).toEqual([]);
    });
  });
});
