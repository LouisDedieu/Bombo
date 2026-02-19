import React from 'react';
import { View, Text } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Destination } from '@/types/api';

interface InteractiveHeroMapProps {
  destinations: Destination[];
}

export function InteractiveHeroMap({ destinations }: InteractiveHeroMapProps) {
  return (
    <View style={{ height: 288, width: '100%', backgroundColor: '#18181b', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
      <MapPin size={32} color="#3b82f6" />
      <Text style={{ color: '#a1a1aa', fontSize: 14, marginTop: 12 }}>
        Carte disponible sur mobile uniquement
      </Text>
      <Text style={{ color: '#71717a', fontSize: 12, marginTop: 4 }}>
        {destinations.length} destination{destinations.length > 1 ? 's' : ''}
      </Text>
    </View>
  );
}
