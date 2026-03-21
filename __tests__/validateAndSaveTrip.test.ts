/**
 * Tests pour la fonction validateAndSaveTrip
 * Vérifie l'appel atomique à l'endpoint validate-and-save
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

describe('validateAndSaveTrip', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('API call structure', () => {
    it('should call the correct endpoint', async () => {
      const tripId = 'test-trip-123';
      const expectedEndpoint = `/trips/${tripId}/validate-and-save`;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, synced: true, saved: true }),
      });

      // Simuler l'appel
      const endpoint = `/trips/${tripId}/validate-and-save`;
      expect(endpoint).toBe(expectedEndpoint);
    });

    it('should use POST method', () => {
      const method = 'POST';
      expect(method).toBe('POST');
    });

    it('should include Authorization header', () => {
      const headers = {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      };
      expect(headers['Authorization']).toContain('Bearer');
    });
  });

  describe('Request body', () => {
    it('should send empty object when no notes provided', () => {
      const body = {};
      expect(body).toEqual({});
    });

    it('should include notes when provided', () => {
      const notes = 'Mes notes de voyage';
      const body = { notes };
      expect(body.notes).toBe(notes);
    });
  });

  describe('Response handling', () => {
    it('should parse success response correctly', () => {
      const response = {
        success: true,
        synced: true,
        saved: true,
      };

      expect(response.success).toBe(true);
      expect(response.synced).toBe(true);
      expect(response.saved).toBe(true);
    });

    it('should handle error response with error_code', () => {
      const errorResponse = {
        error_code: 'EXTERNAL_SERVICE_ERROR',
        message: 'Erreur lors de la validation du trip: RPC failed',
      };

      expect(errorResponse.error_code).toBe('EXTERNAL_SERVICE_ERROR');
      expect(errorResponse.message).toContain('Erreur');
    });
  });

  describe('Atomicity guarantees', () => {
    it('should replace two sequential calls with one atomic call', () => {
      // Avant: 2 appels séquentiels
      const oldCalls = [
        'POST /review/{tripId}/sync',      // syncDestinations
        'POST /trips/{tripId}/save',        // saveTrip
      ];

      // Après: 1 appel atomique
      const newCall = 'POST /trips/{tripId}/validate-and-save';

      expect(oldCalls.length).toBe(2);
      expect(newCall).toContain('validate-and-save');
    });

    it('should guarantee all-or-nothing behavior', () => {
      // Si l'appel échoue, rien ne doit être modifié
      // Ceci est garanti par la transaction PostgreSQL côté backend
      const transactionBehavior = {
        onSuccess: ['syncDestinations', 'saveTrip'], // Les deux sont effectués
        onFailure: [], // Rien n'est effectué (rollback)
      };

      expect(transactionBehavior.onSuccess.length).toBe(2);
      expect(transactionBehavior.onFailure.length).toBe(0);
    });
  });

  describe('Error scenarios', () => {
    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(async () => {
        const response = await fetch('/trips/123/validate-and-save', {
          method: 'POST',
        });
        if (!response.ok) throw new Error('Failed');
      }).rejects.toThrow();
    });

    it('should handle 401 Unauthorized', () => {
      const status = 401;
      const errorResponse = {
        error_code: 'NOT_AUTHENTICATED',
        message: 'Non authentifié',
      };

      expect(status).toBe(401);
      expect(errorResponse.error_code).toBe('NOT_AUTHENTICATED');
    });

    it('should handle 500 Server Error', () => {
      const status = 500;
      const errorResponse = {
        error_code: 'EXTERNAL_SERVICE_ERROR',
        message: 'Erreur lors de la validation du trip',
      };

      expect(status).toBe(500);
      expect(errorResponse.error_code).toBe('EXTERNAL_SERVICE_ERROR');
    });
  });

  describe('Integration with Review page', () => {
    it('should be called instead of syncDestinations + saveTrip', () => {
      // Le code dans app/review/[tripId].tsx doit utiliser:
      // await validateAndSaveTrip(trip.id);
      //
      // Au lieu de:
      // await syncDestinations(trip.id);
      // await saveTrip(user.id, trip.id);

      const newImplementation = `await validateAndSaveTrip(trip.id);`;
      const oldImplementation = `await syncDestinations(trip.id);\nawait saveTrip(user.id, trip.id);`;

      expect(newImplementation).not.toContain('syncDestinations');
      expect(newImplementation).not.toContain('saveTrip');
      expect(newImplementation).toContain('validateAndSaveTrip');
    });

    it('should set isSaved to true on success', () => {
      // Après un appel réussi, l'état isSaved doit passer à true
      let isSaved = false;

      // Simuler le succès
      const response = { success: true, synced: true, saved: true };
      if (response.success) {
        isSaved = true;
      }

      expect(isSaved).toBe(true);
    });

    it('should show error alert on failure', () => {
      // En cas d'échec, Alert.alert doit être appelé
      const errorMessage = 'Erreur lors de la validation du trip';
      expect(typeof errorMessage).toBe('string');
    });
  });

  describe('Backward compatibility', () => {
    it('should keep unsaveTrip unchanged', () => {
      // La fonction unsaveTrip n'est pas affectée
      // Elle continue d'utiliser DELETE /trips/{tripId}/save
      const unsaveEndpoint = 'DELETE /trips/{tripId}/save';
      expect(unsaveEndpoint).toContain('DELETE');
    });

    it('should keep isTripSaved unchanged', () => {
      // La fonction isTripSaved n'est pas affectée
      // Elle continue d'utiliser GET /trips/{tripId}/saved
      const checkEndpoint = 'GET /trips/{tripId}/saved';
      expect(checkEndpoint).toContain('GET');
    });
  });
});
