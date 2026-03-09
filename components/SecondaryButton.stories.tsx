import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { SecondaryButton } from './SecondaryButton';

const meta: Meta<typeof SecondaryButton> = {
  title: 'Components/SecondaryButton',
  component: SecondaryButton,
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: '#1a1744', gap: 16, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SecondaryButton>;

// Pill variants
export const PillActive: Story = {
  args: {
    title: 'Tous · 4',
    active: true,
    variant: 'pill',
  },
};

export const PillInactive: Story = {
  args: {
    title: 'Court · 1-3j',
    active: false,
    variant: 'pill',
  },
};

// Square variants
export const SquareWithChevron: Story = {
  args: {
    title: 'Plus récents',
    active: false,
    variant: 'square',
    showChevron: true,
  },
};

export const SquareWithLeftIcon: Story = {
  args: {
    title: 'Réordonner',
    active: false,
    variant: 'square',
    size: 'sm',
    leftIcon: 'draggable',
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 19, alignItems: 'flex-start' }}>
      <SecondaryButton title="Tous · 4" active variant="pill" />
      <SecondaryButton title="Court · 1-3j" variant="pill" />
      <SecondaryButton title="Plus récents" variant="square" showChevron />
      <SecondaryButton title="Réordonner" variant="square" size="sm" leftIcon="draggable" />
    </View>
  ),
};

// Interactive filter tabs
function FilterTabsDemo() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');

  const filters = [
    { key: 'all' as const, label: 'Tous · 12' },
    { key: 'short' as const, label: 'Court · 1-3j' },
    { key: 'medium' as const, label: 'Moyen · 4-7j' },
    { key: 'long' as const, label: 'Long · 8j+' },
  ];

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {filters.map((filter) => (
        <SecondaryButton
          key={filter.key}
          title={filter.label}
          active={activeFilter === filter.key}
          variant="pill"
          onPress={() => setActiveFilter(filter.key)}
        />
      ))}
    </View>
  );
}

export const InteractiveFilterTabs: Story = {
  render: () => <FilterTabsDemo />,
};

// Interactive dropdown
function DropdownDemo() {
  const [sortBy, setSortBy] = useState('recent');
  const [showOptions, setShowOptions] = useState(false);

  const options = [
    { key: 'recent', label: 'Plus récents' },
    { key: 'oldest', label: 'Plus anciens' },
    { key: 'alpha', label: 'A-Z' },
  ];

  const currentLabel = options.find((o) => o.key === sortBy)?.label || 'Trier';

  return (
    <View style={{ gap: 8, alignItems: 'flex-start' }}>
      <SecondaryButton
        title={currentLabel}
        variant="square"
        showChevron
        onPress={() => setShowOptions(!showOptions)}
      />
      {showOptions && (
        <View style={{ gap: 4 }}>
          {options.map((option) => (
            <SecondaryButton
              key={option.key}
              title={option.label}
              variant="square"
              active={sortBy === option.key}
              onPress={() => {
                setSortBy(option.key);
                setShowOptions(false);
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export const InteractiveDropdown: Story = {
  render: () => <DropdownDemo />,
};

// Interactive toggle group
function ToggleGroupDemo() {
  const [selected, setSelected] = useState<string[]>(['all']);

  const toggleOption = (key: string) => {
    if (key === 'all') {
      setSelected(['all']);
    } else {
      const newSelected = selected.filter((s) => s !== 'all');
      if (newSelected.includes(key)) {
        const filtered = newSelected.filter((s) => s !== key);
        setSelected(filtered.length === 0 ? ['all'] : filtered);
      } else {
        setSelected([...newSelected, key]);
      }
    }
  };

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <SecondaryButton
          title="Tous"
          active={selected.includes('all')}
          variant="pill"
          onPress={() => toggleOption('all')}
        />
        <SecondaryButton
          title="Restaurants"
          active={selected.includes('restaurants')}
          variant="pill"
          onPress={() => toggleOption('restaurants')}
        />
        <SecondaryButton
          title="Activités"
          active={selected.includes('activities')}
          variant="pill"
          onPress={() => toggleOption('activities')}
        />
        <SecondaryButton
          title="Hotels"
          active={selected.includes('hotels')}
          variant="pill"
          onPress={() => toggleOption('hotels')}
        />
      </View>
      <SecondaryButton
        title="Réordonner"
        variant="square"
        size="sm"
        leftIcon="draggable"
      />
    </View>
  );
}

export const InteractiveToggleGroup: Story = {
  render: () => <ToggleGroupDemo />,
};
