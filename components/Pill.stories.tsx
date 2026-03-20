import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Pill } from './Pill';

const meta: Meta<typeof Pill> = {
  title: 'Components/Pill',
  component: Pill,
  decorators: [
    (Story) => (
      <View className="flex-1 p-4 bg-[#1a1744] items-start">
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Pill>;

// ---------------------------------------------------------------------------
// Terminé
// ---------------------------------------------------------------------------

export const Done: Story = {
  args: {
    label: 'Terminé ✓',
    backgroundColor: '#142C28',
    textColor: '#79B881',
  },
};

// ---------------------------------------------------------------------------
// Analyse en cours
// ---------------------------------------------------------------------------

export const Loading: Story = {
  args: {
    label: 'Analyse en cours...',
    backgroundColor: '#5F57C1',
    textColor: '#CECBF5',
  },
};

// ---------------------------------------------------------------------------
// Erreur
// ---------------------------------------------------------------------------

export const Error: Story = {
  args: {
    label: 'Erreur',
    backgroundColor: '#732D2D',
    textColor: '#CECBF5',
  },
};

// ---------------------------------------------------------------------------
// Ville (icon sub-pill)
// ---------------------------------------------------------------------------

export const Ville: Story = {
  args: {
    label: 'Ville',
    backgroundColor: '#306A9F',
    textColor: '#101A49',
  },
};

// ---------------------------------------------------------------------------
// Trip (icon sub-pill)
// ---------------------------------------------------------------------------

export const Trip: Story = {
  args: {
    label: 'Trip',
    backgroundColor: '#656E57',
    textColor: '#101A49',
  },
};

// ---------------------------------------------------------------------------
// All variants
// ---------------------------------------------------------------------------

export const AllVariants: StoryObj = {
  render: () => (
    <View style={{ gap: 8, alignItems: 'flex-start' }}>
      <Pill label="Terminé ✓"         backgroundColor="#142C28" textColor="#79B881" />
      <Pill label="Analyse en cours..." backgroundColor="#5F57C1" textColor="#CECBF5" />
      <Pill label="Erreur"             backgroundColor="#732D2D" textColor="#CECBF5" />
      <Pill label="Ville"              backgroundColor="#306A9F" textColor="#101A49" />
      <Pill label="Trip"               backgroundColor="#656E57" textColor="#101A49" />
    </View>
  ),
};
