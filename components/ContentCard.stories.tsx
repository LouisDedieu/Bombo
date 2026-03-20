import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { ContentCard } from './ContentCard';

const meta: Meta<typeof ContentCard> = {
  title: 'Components/ContentCard',
  component: ContentCard,
  decorators: [
    (Story) => (
      <View style={{ padding: 20, backgroundColor: '#1a1744' }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ContentCard>;

// ── Trip Variant ─────────────────────────────────────────────────────────────

export const Trip: Story = {
  args: {
    variant: 'trip',
    title: 'Lisbonne 48h',
    daysCount: 2,
    spotsCount: 9,
    season: 'Été ☀️',
    days: [
      { dayNumber: 1, count: 4 },
      { dayNumber: 2, count: 5 },
    ],
  },
};

export const TripLongTitle: Story = {
  args: {
    variant: 'trip',
    title: 'Road Trip Côte Amalfitaine',
    daysCount: 5,
    spotsCount: 23,
    season: 'Printemps 🌸',
    days: [
      { dayNumber: 1, count: 5 },
      { dayNumber: 2, count: 4 },
      { dayNumber: 3, count: 6 },
      { dayNumber: 4, count: 4 },
      { dayNumber: 5, count: 4 },
    ],
  },
};

export const TripNoSeason: Story = {
  args: {
    variant: 'trip',
    title: 'Week-end à Rome',
    daysCount: 3,
    spotsCount: 15,
    days: [
      { dayNumber: 1, count: 5 },
      { dayNumber: 2, count: 6 },
      { dayNumber: 3, count: 4 },
    ],
  },
};

// ── City Variant ─────────────────────────────────────────────────────────────

export const City: Story = {
  args: {
    variant: 'city',
    title: 'Paris',
    highlightsCount: 14,
    country: 'France',
    countryFlag: '🇫🇷',
    categories: [
      { category: 'food', count: 4 },
      { category: 'culture', count: 4 },
      { category: 'nightlife', count: 4 },
      { category: 'shopping', count: 4 },
    ],
  },
};

export const CityWithNature: Story = {
  args: {
    variant: 'city',
    title: 'Tokyo',
    highlightsCount: 28,
    country: 'Japan',
    countryFlag: '🇯🇵',
    categories: [
      { category: 'food', count: 8 },
      { category: 'culture', count: 10 },
      { category: 'shopping', count: 6 },
      { category: 'nature', count: 4 },
    ],
  },
};

export const CityNoFlag: Story = {
  args: {
    variant: 'city',
    title: 'Barcelona',
    highlightsCount: 18,
    country: 'Spain',
    categories: [
      { category: 'food', count: 5 },
      { category: 'culture', count: 7 },
      { category: 'nightlife', count: 6 },
    ],
  },
};

// ── Both Variants ────────────────────────────────────────────────────────────

export const BothVariants: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <ContentCard
        variant="trip"
        title="Lisbonne 48h"
        daysCount={2}
        spotsCount={9}
        season="Été ☀️"
        days={[
          { dayNumber: 1, count: 4 },
          { dayNumber: 2, count: 5 },
        ]}
      />
      <ContentCard
        variant="city"
        title="Paris"
        highlightsCount={14}
        country="France"
        countryFlag="🇫🇷"
        categories={[
          { category: 'food', count: 4 },
          { category: 'culture', count: 4 },
          { category: 'nightlife', count: 4 },
          { category: 'shopping', count: 4 },
        ]}
      />
    </View>
  ),
};
