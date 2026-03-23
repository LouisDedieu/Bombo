/**
 * MoveSpotModal - Modal for moving a spot to another day
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-remix-icon';
import { PrimaryButton } from '@/components/PrimaryButton';

interface Day {
  id: string;
  day_number: number;
  location: string | null;
  theme: string | null;
}

interface MoveSpotModalProps {
  visible: boolean;
  onClose: () => void;
  onMove: (targetDayId: string) => Promise<void>;
  currentDayId: string;
  days: Day[];
  spotName: string;
  isMoving: boolean;
}

export function MoveSpotModal({
  visible,
  onClose,
  onMove,
  currentDayId,
  days,
  spotName,
  isMoving,
}: MoveSpotModalProps) {
  const { t } = useTranslation();
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  const handleMove = async () => {
    if (!selectedDayId) return;
    await onMove(selectedDayId);
  };

  const otherDays = days.filter(d => d.id !== currentDayId);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('tripDetail.moveSpot')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close-line" size={22} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          </View>

          {/* Spot name */}
          <Text style={styles.spotName}>{spotName}</Text>

          {/* Day list */}
          <Text style={styles.label}>{t('tripDetail.selectDay')}</Text>
          <ScrollView style={styles.dayList}>
            {otherDays.length === 0 ? (
              <Text style={styles.emptyText}>{t('tripDetail.noOtherDays')}</Text>
            ) : (
              otherDays.map((day) => {
                const isSelected = selectedDayId === day.id;
                const dayLabel = day.theme || day.location || t('tripDetail.day', { number: day.day_number });
                return (
                  <TouchableOpacity
                    key={day.id}
                    onPress={() => setSelectedDayId(day.id)}
                    style={[
                      styles.dayItem,
                      isSelected && styles.dayItemSelected,
                    ]}
                  >
                    <View style={styles.dayNumber}>
                      <Text style={styles.dayNumberText}>{day.day_number}</Text>
                    </View>
                    <Text style={styles.dayLabel}>{dayLabel}</Text>
                    {isSelected && (
                      <Icon name="check-line" size={18} color="#5248D4" />
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          {/* Submit Button */}
          <View style={styles.footer}>
            <PrimaryButton
              title={t('tripDetail.move')}
              onPress={handleMove}
              disabled={!selectedDayId || otherDays.length === 0}
              loading={isMoving}
              fullWidth
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#1E1A64',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Righteous',
    fontSize: 20,
    color: '#FAFAFF',
  },
  closeButton: {
    padding: 4,
  },
  spotName: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    color: '#FAFAFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayList: {
    maxHeight: 300,
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  dayItemSelected: {
    borderColor: '#5248D4',
    backgroundColor: 'rgba(82, 72, 212, 0.15)',
  },
  dayNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3529C1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dayNumberText: {
    fontFamily: 'Righteous',
    fontSize: 12,
    color: '#fff',
  },
  dayLabel: {
    flex: 1,
    fontFamily: 'DMSans',
    fontSize: 14,
    color: '#FAFAFF',
  },
  emptyText: {
    fontFamily: 'DMSans',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    paddingVertical: 20,
  },
  footer: {
    marginTop: 24,
  },
});
