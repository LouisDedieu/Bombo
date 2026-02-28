/**
 * AddCityToTripModal - Modal to add an existing city to a trip
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  Search,
  MapPin,
  Plus,
  Calendar,
  Loader2,
  Building2,
  ChevronRight,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { getUserSavedCities } from '@/services/cityService';
import { addCityToTrip, DbDay } from '@/services/reviewService';
import { CityData } from '@/types/api';

interface SavedCityItem {
  id: string;
  notes: string | null;
  created_at: string;
  cities: CityData | null;
}

interface AddCityToTripModalProps {
  visible: boolean;
  onClose: () => void;
  tripId: string;
  tripDays: DbDay[];
  existingDestinations: string[]; // List of city names already in trip
  onCityAdded: () => void;
}

function SpinningLoader({ size = 16, color = '#a855f7' }: { size?: number; color?: string }) {
  const rotation = React.useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Loader2 size={size} color={color} />
    </Animated.View>
  );
}

export function AddCityToTripModal({
  visible,
  onClose,
  tripId,
  tripDays,
  existingDestinations,
  onCityAdded,
}: AddCityToTripModalProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [cities, setCities] = useState<SavedCityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [step, setStep] = useState<'select-city' | 'select-day'>('select-city');
  const [adding, setAdding] = useState(false);

  // Load saved cities
  useEffect(() => {
    if (visible && user?.id) {
      setLoading(true);
      getUserSavedCities(user.id, 1, 100)
        .then((res) => setCities(res.items))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [visible, user?.id]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setSelectedCity(null);
      setStep('select-city');
      setSearchQuery('');
    }
  }, [visible]);

  // Filter cities by search query
  const filteredCities = cities.filter((item) => {
    if (!item.cities) return false;
    const query = searchQuery.toLowerCase();
    return (
      item.cities.city_name?.toLowerCase().includes(query) ||
      item.cities.city_title?.toLowerCase().includes(query) ||
      item.cities.country?.toLowerCase().includes(query)
    );
  });

  // Check if city already exists in trip
  const isCityInTrip = useCallback(
    (cityName: string) => {
      return existingDestinations.some(
        (dest) => dest.toLowerCase() === cityName.toLowerCase()
      );
    },
    [existingDestinations]
  );

  // Get days for a specific city (destination)
  const getDaysForCity = useCallback(
    (cityName: string) => {
      return tripDays.filter(
        (day) => day.location?.toLowerCase() === cityName.toLowerCase()
      );
    },
    [tripDays]
  );

  // Handle city selection
  const handleSelectCity = (city: CityData) => {
    setSelectedCity(city);

    // Check if this city already exists as a destination
    if (isCityInTrip(city.city_name)) {
      // Show day selection
      setStep('select-day');
    } else {
      // Create new day directly
      handleAddCity(city.id, undefined, true);
    }
  };

  // Handle adding city to trip
  const handleAddCity = async (
    cityId: string,
    dayId?: string,
    createNewDay = false
  ) => {
    setAdding(true);
    try {
      const result = await addCityToTrip(tripId, {
        city_id: cityId,
        day_id: dayId,
        create_new_day: createNewDay,
      });

      Alert.alert(
        'Ajouté !',
        `${result.spots_count} point${result.spots_count > 1 ? 's' : ''} ajouté${result.spots_count > 1 ? 's' : ''} à ${result.city_name}`,
        [{ text: 'OK', onPress: onClose }]
      );
      onCityAdded();
    } catch (err: any) {
      Alert.alert('Erreur', err.message || "Impossible d'ajouter la ville");
    } finally {
      setAdding(false);
    }
  };

  // Render city item
  const renderCityItem = ({ item }: { item: SavedCityItem }) => {
    if (!item.cities) return null;
    const city = item.cities;
    const alreadyInTrip = isCityInTrip(city.city_name);
    const highlightsCount = city.city_highlights?.length || 0;

    return (
      <TouchableOpacity
        onPress={() => handleSelectCity(city)}
        className="flex-row items-center p-3 rounded-xl mb-2"
        style={{
          backgroundColor: '#27272a',
          borderWidth: 1,
          borderColor: alreadyInTrip ? '#a855f74D' : '#3f3f46',
        }}
      >
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: '#a855f733' }}
        >
          <Building2 size={20} color="#a855f7" />
        </View>
        <View className="flex-1">
          <Text className="text-white font-medium">{city.city_title || city.city_name}</Text>
          <View className="flex-row items-center gap-2 mt-0.5">
            <MapPin size={12} color="#71717a" />
            <Text className="text-zinc-500 text-xs">
              {city.city_name}, {city.country}
            </Text>
            <Text className="text-zinc-600 text-xs">•</Text>
            <Text className="text-zinc-500 text-xs">{highlightsCount} points</Text>
          </View>
          {alreadyInTrip && (
            <Text className="text-purple-400 text-xs mt-1">Déjà dans cet itinéraire</Text>
          )}
        </View>
        <ChevronRight size={20} color="#71717a" />
      </TouchableOpacity>
    );
  };

  // Render day selection
  const renderDaySelection = () => {
    if (!selectedCity) return null;

    const existingDays = getDaysForCity(selectedCity.city_name);

    return (
      <View className="flex-1">
        <Text className="text-white text-lg font-bold mb-2">
          {selectedCity.city_name} existe déjà
        </Text>
        <Text className="text-zinc-400 text-sm mb-4">
          Ajouter les points à un jour existant ou créer un nouveau jour ?
        </Text>

        {/* Existing days */}
        {existingDays.map((day) => (
          <TouchableOpacity
            key={day.id}
            onPress={() => handleAddCity(selectedCity.id, day.id, false)}
            disabled={adding}
            className="flex-row items-center p-3 rounded-xl mb-2"
            style={{ backgroundColor: '#27272a', borderWidth: 1, borderColor: '#3f3f46' }}
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: '#3b82f633' }}
            >
              <Calendar size={20} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium">Jour {day.day_number}</Text>
              <Text className="text-zinc-500 text-xs">
                {day.theme || day.location} • {day.spots.length} spots
              </Text>
            </View>
            {adding ? (
              <SpinningLoader size={18} color="#3b82f6" />
            ) : (
              <Plus size={20} color="#3b82f6" />
            )}
          </TouchableOpacity>
        ))}

        {/* Create new day option */}
        <TouchableOpacity
          onPress={() => handleAddCity(selectedCity.id, undefined, true)}
          disabled={adding}
          className="flex-row items-center p-3 rounded-xl"
          style={{
            backgroundColor: '#a855f71A',
            borderWidth: 1,
            borderColor: '#a855f74D',
          }}
        >
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: '#a855f733' }}
          >
            <Plus size={20} color="#a855f7" />
          </View>
          <View className="flex-1">
            <Text className="text-purple-400 font-medium">Créer un nouveau jour</Text>
            <Text className="text-purple-500 text-xs">
              Jour {tripDays.length + 1} - {selectedCity.city_name}
            </Text>
          </View>
          {adding && <SpinningLoader size={18} color="#a855f7" />}
        </TouchableOpacity>

        {/* Back button */}
        <TouchableOpacity
          onPress={() => {
            setSelectedCity(null);
            setStep('select-city');
          }}
          className="mt-4 py-3 items-center"
        >
          <Text className="text-zinc-400">Retour</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <View
          className="bg-zinc-900 rounded-t-3xl"
          style={{ maxHeight: '80%', paddingBottom: insets.bottom + 16 }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-zinc-800">
            <Text className="text-lg font-bold text-white">
              {step === 'select-city' ? 'Ajouter une ville' : 'Choisir un jour'}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={20} color="#71717a" />
            </TouchableOpacity>
          </View>

          {step === 'select-city' ? (
            <>
              {/* Search */}
              <View className="px-4 py-3">
                <View
                  className="flex-row items-center rounded-lg px-3 py-2"
                  style={{ backgroundColor: '#27272a' }}
                >
                  <Search size={18} color="#71717a" />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Rechercher une ville..."
                    placeholderTextColor="#52525b"
                    className="flex-1 ml-2 text-white"
                  />
                </View>
              </View>

              {/* Cities list */}
              {loading ? (
                <View className="flex-1 items-center justify-center py-12">
                  <SpinningLoader size={32} color="#a855f7" />
                </View>
              ) : filteredCities.length === 0 ? (
                <View className="flex-1 items-center justify-center py-12 px-4">
                  <Building2 size={48} color="#52525b" />
                  <Text className="text-zinc-500 text-center mt-4">
                    {searchQuery
                      ? 'Aucune ville trouvée'
                      : 'Aucune ville sauvegardée'}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={filteredCities}
                  keyExtractor={(item) => item.id}
                  renderItem={renderCityItem}
                  contentContainerStyle={{ padding: 16 }}
                />
              )}
            </>
          ) : (
            <View className="p-4">{renderDaySelection()}</View>
          )}
        </View>
      </View>
    </Modal>
  );
}
