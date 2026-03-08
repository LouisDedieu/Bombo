import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Pill } from '@/components/Pill';
import { JobCard, ValidateBanner } from '@/components/JobCard';

// ---------------------------------------------------------------------------
// Shared design tokens — defined at the parent level
// ---------------------------------------------------------------------------

const COLORS = {
  cardDone:    '#363276',
  cardTrip:    '#363276',
  cardLoading: 'rgba(54, 50, 118, 0.35)',
  cardError:   'rgba(87, 41, 42, 0.19)',

  pillDone:    '#142C28',
  pillLoading: '#5F57C1',
  pillError:   '#732D2D',

  pillTextDone:    '#79B881',
  pillTextLoading: '#CECBF5',
  pillTextError:   '#CECBF5',

  iconCity:    '#306A9F',
  iconTrip:    '#656E57',
  iconLoading: '#5F57C1',
};

const SAMPLE_URL = 'https://www.tiktok.com/@linda.isabelleeee/video/7495807846957796630';

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof JobCard> = {
  title: 'Components/JobCard',
  component: JobCard,
  decorators: [
    (Story) => (
      <View className="flex-1 p-4 bg-[#1a1744]">
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof JobCard>;

// ---------------------------------------------------------------------------
// Done (Ville)
// ---------------------------------------------------------------------------

export const Done: Story = {
  args: {
    status: 'done',
    title: 'Lisbonne 48h',
    subtitle: '12 Lieux · Hier',
    url: SAMPLE_URL,
    pillLabel: 'Terminé ✓',
    pillBackgroundColor: COLORS.pillDone,
    pillTextColor: COLORS.pillTextDone,
    cardBackgroundColor: COLORS.cardDone,
    iconLabel: 'Ville',
    iconLabelBackgroundColor: COLORS.iconCity,
  },
};

// ---------------------------------------------------------------------------
// Trip
// ---------------------------------------------------------------------------

export const Trip: Story = {
  args: {
    status: 'trip',
    title: 'Lisbonne 48h',
    subtitle: '12 Lieux · Hier',
    url: SAMPLE_URL,
    pillLabel: 'Terminé ✓',
    pillBackgroundColor: COLORS.pillDone,
    pillTextColor: COLORS.pillTextDone,
    cardBackgroundColor: COLORS.cardTrip,
    iconLabel: 'Trip',
    iconLabelBackgroundColor: COLORS.iconTrip,
  },
};

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

export const Loading: Story = {
  args: {
    status: 'loading',
    title: 'Chargement...',
    subtitle: 'X Lieux · Now',
    url: SAMPLE_URL,
    pillLabel: 'Analyse en cours...',
    pillBackgroundColor: COLORS.pillLoading,
    pillTextColor: COLORS.pillTextLoading,
    cardBackgroundColor: COLORS.cardLoading,
    iconLabel: 'Trip',
    iconLabelBackgroundColor: COLORS.iconLoading,
  },
};

// ---------------------------------------------------------------------------
// Error
// ---------------------------------------------------------------------------

export const Error: Story = {
  args: {
    status: 'error',
    title: 'Erreur',
    subtitle: 'Il y a eu une erreur de machins trucs',
    pillLabel: 'Erreur',
    pillBackgroundColor: COLORS.pillError,
    pillTextColor: COLORS.pillTextError,
    cardBackgroundColor: COLORS.cardError,
  },
};

// ---------------------------------------------------------------------------
// All States — Full screen view matching the Figma design
// ---------------------------------------------------------------------------

export const AllStates: StoryObj = {
  render: () => (
    <View style={{ gap: 10, width: '100%' }}>
      {/* Done card with banner above */}
      <View style={{ gap: 0, borderRadius: 16, marginBottom: 20}}>
        <ValidateBanner />
        <JobCard
          status="done"
          title="Lisbonne 48h"
          subtitle="12 Lieux · Hier"
          url={SAMPLE_URL}
          pillLabel="Terminé ✓"
          pillBackgroundColor={COLORS.pillDone}
          pillTextColor={COLORS.pillTextDone}
          cardBackgroundColor={COLORS.cardDone}
          iconLabel="Ville"
          iconLabelBackgroundColor={COLORS.iconCity}
        />
      </View>

      {/* Trip card */}
      <JobCard
        status="trip"
        title="Lisbonne 48h"
        subtitle="12 Lieux · Hier"
        url={SAMPLE_URL}
        pillLabel="Terminé ✓"
        pillBackgroundColor={COLORS.pillDone}
        pillTextColor={COLORS.pillTextDone}
        cardBackgroundColor={COLORS.cardTrip}
        iconLabel="Trip"
        iconLabelBackgroundColor={COLORS.iconTrip}
      />

      {/* Loading card */}
      <JobCard
        status="loading"
        title="Chargement..."
        subtitle="X Lieux · Now"
        url={SAMPLE_URL}
        pillLabel="Analyse en cours..."
        pillBackgroundColor={COLORS.pillLoading}
        pillTextColor={COLORS.pillTextLoading}
        cardBackgroundColor={COLORS.cardLoading}
        iconLabel="Trip"
        iconLabelBackgroundColor={COLORS.iconLoading}
      />

      {/* Error card */}
      <JobCard
        status="error"
        title="Erreur"
        subtitle="Il y a eu une erreur de machins trucs"
        pillLabel="Erreur"
        pillBackgroundColor={COLORS.pillError}
        pillTextColor={COLORS.pillTextError}
        cardBackgroundColor={COLORS.cardError}
      />
    </View>
  ),
};

// ---------------------------------------------------------------------------
// On Light Background
// ---------------------------------------------------------------------------

export const OnLightBackground: Story = {
  decorators: [
    (Story) => (
      <View className="flex-1 p-4 bg-zinc-100">
        <Story />
      </View>
    ),
  ],
  args: {
    status: 'done',
    title: 'Lisbonne 48h',
    subtitle: '12 Lieux · Hier',
    url: SAMPLE_URL,
    pillLabel: 'Terminé ✓',
    pillBackgroundColor: COLORS.pillDone,
    pillTextColor: COLORS.pillTextDone,
    cardBackgroundColor: COLORS.cardDone,
    iconLabel: 'Ville',
    iconLabelBackgroundColor: COLORS.iconCity,
  },
};