/**
 * HighlightFormModal - Reusable modal for adding/editing highlights
 * Glassmorphism design
 */
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-remix-icon';
import { HighlightCategory, HIGHLIGHT_CATEGORIES } from '@/types/api';
import { CATEGORY_COLORS } from '@/components/city/CategoryFilterChips';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SecondaryButton, type ColorScheme } from '@/components/SecondaryButton';

const CATEGORY_TO_COLOR_SCHEME: Record<HighlightCategory, ColorScheme> = {
  food: 'restaurant',
  culture: 'culture',
  nature: 'nature',
  shopping: 'shopping',
  nightlife: 'nightlife',
  other: 'default',
};

interface HighlightFormModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  form: any;
  setForm: (form: any) => void;
  addressStatus?: 'loading' | 'found' | 'not_found' | null;
  onSubmit: () => void;
  submitting: boolean;
  submitLabel?: string;
}

export function HighlightFormModal({
  visible,
  onClose,
  title,
  form,
  setForm,
  addressStatus,
  onSubmit,
  submitting,
  submitLabel = 'Enregistrer',
}: HighlightFormModalProps) {
  const canSubmit = form.name?.trim() && addressStatus !== 'loading';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close-line" size={22} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name */}
            <View>
              <Text style={styles.label}>Nom *</Text>
              <TextInput
                value={form.name ?? ''}
                onChangeText={(v) => setForm({ ...form, name: v })}
                placeholder="Nom du point"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                style={styles.input}
              />
            </View>

            {/* Category */}
            <View>
              <Text style={styles.label}>Catégorie</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryRow}>
                  {(Object.keys(HIGHLIGHT_CATEGORIES) as HighlightCategory[]).map((cat) => {
                    const isSelected = form.category === cat;
                    return (
                      <SecondaryButton
                        key={cat}
                        title={HIGHLIGHT_CATEGORIES[cat].label}
                        active={isSelected}
                        colorScheme={CATEGORY_TO_COLOR_SCHEME[cat]}
                        variant="pill"
                        size="sm"
                        onPress={() => setForm({ ...form, category: cat })}
                      />
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            {/* Subtype */}
            <View>
              <Text style={styles.label}>Sous-type</Text>
              <TextInput
                value={form.subtype ?? ''}
                onChangeText={(v) => setForm({ ...form, subtype: v || undefined })}
                placeholder="Ex: Restaurant italien..."
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                style={styles.input}
              />
            </View>

            {/* Address */}
            <View>
              <Text style={styles.label}>Adresse</Text>
              <TextInput
                value={form.address ?? ''}
                onChangeText={(v) => setForm({ ...form, address: v || undefined })}
                placeholder="Ex: 15 rue de Rivoli, Paris"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                style={[
                  styles.input,
                  addressStatus === 'found' && styles.inputSuccess,
                  addressStatus === 'not_found' && styles.inputWarning,
                ]}
              />
              {addressStatus === 'loading' && (
                <Text style={styles.statusText}>Vérification de l'adresse...</Text>
              )}
              {addressStatus === 'found' && (
                <Text style={styles.successText}>✓ Position localisée</Text>
              )}
              {addressStatus === 'not_found' && (
                <Text style={styles.warningText}>⚠ Adresse non trouvée – sera localisée automatiquement</Text>
              )}
            </View>

            {/* Description */}
            <View>
              <Text style={styles.label}>Description</Text>
              <TextInput
                value={form.description ?? ''}
                onChangeText={(v) => setForm({ ...form, description: v || undefined })}
                placeholder="Optionnel"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                multiline
                numberOfLines={3}
                style={[styles.input, styles.textArea]}
              />
            </View>

            {/* Tips */}
            <View>
              <Text style={styles.label}>Conseils</Text>
              <TextInput
                value={form.tips ?? ''}
                onChangeText={(v) => setForm({ ...form, tips: v || undefined })}
                placeholder="Optionnel"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                multiline
                numberOfLines={2}
                style={[styles.input, styles.textAreaSmall]}
              />
            </View>

            {/* Must-see toggle */}
            <SecondaryButton
              title="Incontournable"
              leftIcon="star-fill"
              active={form.is_must_see}
              colorScheme="mustsee"
              variant="pill"
              onPress={() => setForm({ ...form, is_must_see: !form.is_must_see })}
            />

            {/* Submit */}
            <PrimaryButton
              title={submitLabel}
              leftIcon={submitting ? undefined : 'save-line'}
              onPress={onSubmit}
              disabled={!canSubmit || submitting}
              loading={submitting}
              fullWidth
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    backgroundColor: 'rgba(30, 26, 100, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  content: {
    padding: 16,
    paddingBottom: 34,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Righteous',
    fontWeight: 'bold',
    color: '#FAFAFF',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: 'rgba(30, 26, 100, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#FAFAFF',
  },
  inputSuccess: {
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  inputWarning: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  statusText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 4,
  },
  successText: {
    fontSize: 11,
    color: '#22c55e',
    marginTop: 4,
  },
  warningText: {
    fontSize: 11,
    color: '#f59e0b',
    marginTop: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  textAreaSmall: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#a855f7',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
