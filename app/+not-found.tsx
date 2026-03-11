/**
 * pages/NotFound.tsx (React Native)
 *
 * Équivalent de la page NotFound React — écran affiché pour les routes inconnues.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';


export default function NotFound() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center p-6 bg-[#1e1a64]">
      <Text className="text-[72px] font-bold text-white/20 mb-2 font-righteous">404</Text>
      <Text className="text-lg font-semibold text-white mb-2 font-righteous">Page introuvable</Text>
      <Text className="text-sm text-white/50 text-center mb-8 font-dmsans">
        Cette page n'existe pas ou a été déplacée.
      </Text>
      <TouchableOpacity
        className="bg-[#1e1a64] border border-white/10 px-6 py-3 rounded-lg"
        onPress={() => router.replace('/')}
        activeOpacity={0.8}
      >
        <Text className="text-white font-medium font-dmsans">Retour à l'accueil</Text>
      </TouchableOpacity>
    </View>
  );
}