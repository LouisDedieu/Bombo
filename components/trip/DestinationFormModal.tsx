/**
 * DestinationFormModal - Modal for editing trip destinations (city name/country)
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-remix-icon';
import { PrimaryButton } from '@/components/PrimaryButton';

interface DestinationFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (cityName: string, country: string) => Promise<void>;
  initialCityName: string;
  initialCountry: string;
  isSaving: boolean;
}

export function DestinationFormModal({
  visible,
  onClose,
  onSave,
  initialCityName,
  initialCountry,
  isSaving,
}: DestinationFormModalProps) {
  const { t } = useTranslation();

  const [cityName, setCityName] = useState(initialCityName);
  const [country, setCountry] = useState(initialCountry);

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setCityName(initialCityName);
      setCountry(initialCountry);
    }
  }, [visible, initialCityName, initialCountry]);

  const handleSave = async () => {
    if (!cityName.trim()) return;
    await onSave(cityName.trim(), country.trim());
  };

  const canSubmit = cityName.trim().length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('tripDetail.editDestination')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close-line" size={22} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* City Name */}
            <View>
              <Text style={styles.label}>{t('tripDetail.cityName')} *</Text>
              <TextInput
                value={cityName}
                onChangeText={setCityName}
                placeholder={t('tripDetail.cityNamePlaceholder')}
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                style={styles.input}
                autoFocus
              />
            </View>

            {/* Country */}
            <View>
              <Text style={styles.label}>{t('tripDetail.country')}</Text>
              <TextInput
                value={country}
                onChangeText={setCountry}
                placeholder={t('tripDetail.countryPlaceholder')}
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                style={styles.input}
              />
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.footer}>
            <PrimaryButton
              title={t('cityDetail.save')}
              onPress={handleSave}
              disabled={!canSubmit}
              loading={isSaving}
              fullWidth
            />
          </View>
        </View>
      </KeyboardAvoidingView>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Righteous',
    fontSize: 20,
    color: '#FAFAFF',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    gap: 20,
  },
  label: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FAFAFF',
    fontFamily: 'DMSans',
    fontSize: 14,
  },
  footer: {
    marginTop: 24,
  },
});
