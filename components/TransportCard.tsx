/**
 * TransportCard - Display transport/logistics timeline
 * Glassmorphism design matching the new budget and practical cards
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-remix-icon';

interface TransportLeg {
  id: string;
  from_location: string | null;
  to_location: string | null;
  transport_mode: string | null;
  duration: string | null;
  cost: string | null;
  tips: string | null;
}

interface TransportCardProps {
  legs: TransportLeg[];
}

const TRANSPORT_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  plane: { icon: 'plane-line', label: 'Vol', color: '#60a5fa' },
  train: { icon: 'train-line', label: 'Train', color: '#34d399' },
  bus: { icon: 'bus-line', label: 'Bus', color: '#fb923c' },
  car: { icon: 'car-line', label: 'Voiture', color: '#a855f7' },
  ferry: { icon: 'boat-line', label: 'Ferry', color: '#06b6d4' },
  walk: { icon: 'walk-line', label: 'À pied', color: '#22c55e' },
  taxi: { icon: 'taxi-line', label: 'Taxi', color: '#facc15' },
  metro: { icon: 'subway-line', label: 'Métro', color: '#ec4899' },
  bike: { icon: 'bike-line', label: 'Vélo', color: '#84cc16' },
  boat: { icon: 'ship-line', label: 'Bateau', color: '#06b6d4' },
};

export function TransportCard({ legs }: TransportCardProps) {
  if (legs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Icon name="caravan-line" size={28} color="rgba(255, 255, 255, 0.3)" />
        </View>
        <Text style={styles.emptyText}>Aucune information de transport disponible.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {legs.length} trajet{legs.length > 1 ? 's' : ''} planifié{legs.length > 1 ? 's' : ''}
      </Text>

      <View>
        {legs.map((leg, i) => {
          const from = leg.from_location || 'Départ';
          const to = leg.to_location || 'Arrivée';
          const cfg = TRANSPORT_CONFIG[leg.transport_mode ?? ''] ?? { 
            icon: 'bus-line', 
            label: leg.transport_mode ?? 'Transport',
            color: '#60a5fa'
          };
          
          return (
            <View key={leg.id} style={styles.legContainer}>
              {/* Timeline indicator */}
              <View style={styles.timelineColumn}>
                <View style={[styles.timelineDot, { backgroundColor: cfg.color }]}>
                  <Icon name={cfg.icon as any} size={14} color="#FFFFFF" />
                </View>
                {i < legs.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
              </View>

              {/* Card */}
              <View style={styles.card}>
                {/* Route */}
                <View style={styles.routeRow}>
                  <Text style={styles.routeText}>
                    {from} <Text style={styles.routeArrow}>→</Text> {to}
                  </Text>
                </View>

                {/* Transport mode badge */}
                <View style={[styles.badge, { backgroundColor: `${cfg.color}22`, borderColor: `${cfg.color}40` }]}>
                  <Icon name={cfg.icon as any} size={10} color={cfg.color} />
                  <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>

                {/* Info row */}
                <View style={styles.infoRow}>
                  {leg.duration && (
                    <View style={styles.infoItem}>
                      <Icon name="time-line" size={12} color="rgba(255, 255, 255, 0.5)" />
                      <Text style={styles.infoText}>{leg.duration}</Text>
                    </View>
                  )}
                  {leg.cost && (
                    <View style={styles.infoItem}>
                      <Icon name="money-dollar-circle-line" size={12} color="rgba(255, 255, 255, 0.5)" />
                      <Text style={styles.infoText}>{leg.cost}</Text>
                    </View>
                  )}
                </View>

                {/* Tips */}
                {leg.tips && (
                  <View style={styles.tipsContainer}>
                    <Icon name="lightbulb-line" size={10} color="#60a5fa" />
                    <Text style={styles.tipsText}>{leg.tips}</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 56,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  header: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    paddingBottom: 8,
  },
  legContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineColumn: {
    alignItems: 'center',
    width: 36,
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 4,
    minHeight: 20,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(30, 26, 100, 0.4)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
    marginBottom: 12,
  },
  routeRow: {
    marginBottom: 8,
  },
  routeText: {
    fontSize: 14,
    fontFamily: 'Righteous',
    fontWeight: '600',
    color: '#FAFAFF',
  },
  routeArrow: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  tipsText: {
    fontSize: 11,
    color: '#60a5fa',
    fontStyle: 'italic',
    flex: 1,
  },
});
