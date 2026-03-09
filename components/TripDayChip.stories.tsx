import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { TripDayChip } from './TripDayChip';

const meta: Meta<typeof TripDayChip> = {
  title: 'Components/TripDayChip',
  component: TripDayChip,
  decorators: [
    (Story) => (
      <View style={{ padding: 20, backgroundColor: '#1a1744' }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TripDayChip>;

// ── Category Variants ───────────────────────────────────────────────────────

export const Food: Story = {
  args: {
    variant: 'category',
    category: 'food',
    count: 4,
  },
};

export const Culture: Story = {
  args: {
    variant: 'category',
    category: 'culture',
    count: 3,
  },
};

export const Nightlife: Story = {
  args: {
    variant: 'category',
    category: 'nightlife',
    count: 2,
  },
};

export const Shopping: Story = {
  args: {
    variant: 'category',
    category: 'shopping',
    count: 5,
  },
};

export const Nature: Story = {
  args: {
    variant: 'category',
    category: 'nature',
    count: 6,
  },
};

export const Other: Story = {
  args: {
    variant: 'category',
    category: 'other',
    count: 1,
  },
};

// ── Day Variant ─────────────────────────────────────────────────────────────

export const Day: Story = {
  args: {
    variant: 'day',
    dayNumber: 2,
    count: 5,
  },
};

// ── More Days Variant ───────────────────────────────────────────────────────

export const MoreDays: Story = {
  args: {
    variant: 'moreDays',
    daysCount: 4,
  },
};

// ── All Variants Together ───────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 10 }}>
      <TripDayChip variant="category" category="food" count={4} />
      <TripDayChip variant="day" dayNumber={2} count={5} />
      <TripDayChip variant="moreDays" daysCount={4} />
    </View>
  ),
};

// ── All Categories ──────────────────────────────────────────────────────────

export const AllCategories: Story = {
  render: () => (
    <View style={{ gap: 10 }}>
      <TripDayChip variant="category" category="food" count={4} />
      <TripDayChip variant="category" category="culture" count={3} />
      <TripDayChip variant="category" category="nightlife" count={2} />
      <TripDayChip variant="category" category="shopping" count={5} />
      <TripDayChip variant="category" category="nature" count={6} />
      <TripDayChip variant="category" category="other" count={1} />
    </View>
  ),
};
