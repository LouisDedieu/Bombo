import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { TripStepCard } from './TripStepCard';

const meta: Meta<typeof TripStepCard> = {
  title: 'Components/TripStepCard',
  component: TripStepCard,
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: '#1a1744', flex: 1, maxWidth: 400 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    defaultExpanded: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof TripStepCard>;

export const Expanded: Story = {
  args: {
    stepNumber: 1,
    cityName: 'Chania, Greece',
    daysCount: 3,
    spotsCount: 11,
    defaultExpanded: true,
    days: [
      {
        dayNumber: 1,
        spotName: 'Chania Old Port',
        duration: '~4h',
        categories: [
          { category: 'culture', count: 3 },
          { category: 'food', count: 2 },
          { category: 'beach', count: 1 },
        ],
      },
      {
        dayNumber: 2,
        spotName: 'Gorges de Samaria',
        duration: '~6h',
        categories: [
          { category: 'nature', count: 4 },
          { category: 'beach', count: 1 },
        ],
      },
      {
        dayNumber: 3,
        spotName: 'Odos Kondylaki',
        duration: '~2h',
        categories: [{ category: 'nightlife', count: 1 }],
      },
    ],
    onViewDetails: () => console.log('View details pressed'),
  },
};

export const Collapsed: Story = {
  args: {
    stepNumber: 1,
    cityName: 'Chania, Greece',
    daysCount: 3,
    spotsCount: 11,
    defaultExpanded: false,
    days: [
      {
        dayNumber: 1,
        spotName: 'Chania Old Port',
        duration: '~4h',
        categories: [
          { category: 'culture', count: 3 },
          { category: 'food', count: 2 },
          { category: 'beach', count: 1 },
        ],
      },
      {
        dayNumber: 2,
        spotName: 'Gorges de Samaria',
        duration: '~6h',
        categories: [
          { category: 'nature', count: 4 },
          { category: 'beach', count: 1 },
        ],
      },
      {
        dayNumber: 3,
        spotName: 'Odos Kondylaki',
        duration: '~2h',
        categories: [{ category: 'nightlife', count: 1 }],
      },
    ],
    onViewDetails: () => console.log('View details pressed'),
  },
};

export const FourDays: Story = {
  args: {
    stepNumber: 2,
    cityName: 'Héraklion',
    daysCount: 4,
    spotsCount: 13,
    defaultExpanded: true,
    days: [
      {
        dayNumber: 4,
        spotName: 'Palais de Knossos',
        duration: '~5h',
        categories: [
          { category: 'culture', count: 2 },
          { category: 'food', count: 2 },
        ],
      },
      {
        dayNumber: 5,
        spotName: 'Marché 1866',
        duration: '~3h',
        categories: [
          { category: 'shopping', count: 3 },
          { category: 'food', count: 2 },
        ],
      },
      {
        dayNumber: 6,
        spotName: 'Plage de Matala',
        duration: '~4h',
        categories: [{ category: 'beach', count: 3 }],
      },
      {
        dayNumber: 7,
        spotName: 'Koules, soirée port',
        duration: '~2h',
        categories: [{ category: 'nightlife', count: 1 }],
      },
    ],
    onViewDetails: () => console.log('View details pressed'),
  },
};

export const WithoutViewDetails: Story = {
  args: {
    stepNumber: 3,
    cityName: 'Santorini',
    daysCount: 2,
    spotsCount: 6,
    defaultExpanded: true,
    days: [
      {
        dayNumber: 8,
        spotName: 'Oia Sunset',
        duration: '~3h',
        categories: [
          { category: 'nature', count: 2 },
          { category: 'food', count: 1 },
        ],
      },
      {
        dayNumber: 9,
        spotName: 'Red Beach',
        duration: '~4h',
        categories: [
          { category: 'beach', count: 2 },
          { category: 'nature', count: 1 },
        ],
      },
    ],
  },
};

export const MultipleCards: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <TripStepCard
        stepNumber={1}
        cityName="Chania, Greece"
        daysCount={3}
        spotsCount={11}
        defaultExpanded={false}
        days={[
          {
            dayNumber: 1,
            spotName: 'Chania Old Port',
            duration: '~4h',
            categories: [
              { category: 'culture', count: 3 },
              { category: 'food', count: 2 },
            ],
          },
        ]}
        onViewDetails={() => {}}
      />
      <TripStepCard
        stepNumber={2}
        cityName="Héraklion"
        daysCount={4}
        spotsCount={13}
        defaultExpanded={false}
        days={[
          {
            dayNumber: 4,
            spotName: 'Palais de Knossos',
            duration: '~5h',
            categories: [{ category: 'culture', count: 4 }],
          },
        ]}
        onViewDetails={() => {}}
      />
      <TripStepCard
        stepNumber={3}
        cityName="Santorini"
        daysCount={2}
        spotsCount={6}
        defaultExpanded={false}
        days={[
          {
            dayNumber: 8,
            spotName: 'Oia Sunset',
            duration: '~3h',
            categories: [{ category: 'nature', count: 3 }],
          },
        ]}
        onViewDetails={() => {}}
      />
    </View>
  ),
};
