import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text } from 'react-native';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  decorators: [
    (Story) => (
      <View className="flex-1 p-6 gap-6 bg-zinc-100">
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Input>;

// ---------------------------------------------------------------------------
// Default
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    placeholder: 'Coller votre lien ici...',
    leftIcon: 'link',
  },
};

// ---------------------------------------------------------------------------
// With Different Icons
// ---------------------------------------------------------------------------

export const WithSearchIcon: Story = {
  args: {
    placeholder: 'Rechercher...',
    leftIcon: 'search-line',
  },
};

export const WithMailIcon: Story = {
  args: {
    placeholder: 'Entrez votre email...',
    leftIcon: 'mail-line',
  },
};

export const WithUserIcon: Story = {
  args: {
    placeholder: 'Nom d\'utilisateur',
    leftIcon: 'user-line',
  },
};

export const WithoutIcon: Story = {
  args: {
    placeholder: 'Texte sans icône...',
    leftIcon: undefined,
  },
};

// ---------------------------------------------------------------------------
// All Icon Variations
// ---------------------------------------------------------------------------

export const AllIcons: Story = {
  render: () => (
    <View className="gap-4">
      <Text className="text-zinc-600 text-sm font-dm-sans-medium">Link (Default)</Text>
      <Input placeholder="Coller votre lien ici..." leftIcon="link" />

      <Text className="text-zinc-600 text-sm font-dm-sans-medium mt-4">Search</Text>
      <Input placeholder="Rechercher..." leftIcon="search-line" />

      <Text className="text-zinc-600 text-sm font-dm-sans-medium mt-4">Mail</Text>
      <Input placeholder="Entrez votre email..." leftIcon="mail-line" />

      <Text className="text-zinc-600 text-sm font-dm-sans-medium mt-4">User</Text>
      <Input placeholder="Nom d'utilisateur" leftIcon="user-line" />

      <Text className="text-zinc-600 text-sm font-dm-sans-medium mt-4">No Icon</Text>
      <Input placeholder="Texte sans icône..." leftIcon={undefined} />
    </View>
  ),
};

// ---------------------------------------------------------------------------
// With Value
// ---------------------------------------------------------------------------

export const WithValue: Story = {
  args: {
    placeholder: 'Coller votre lien ici...',
    leftIcon: 'link',
    value: 'https://www.youtube.com/watch?v=example',
  },
};

// ---------------------------------------------------------------------------
// Interactive
// ---------------------------------------------------------------------------

const InteractiveInput = () => {
  const [value, setValue] = useState('');

  return (
    <View className="gap-4">
      <Text className="text-zinc-600 text-sm font-dm-sans-medium">
        Type something:
      </Text>
      <Input
        placeholder="Coller votre lien ici..."
        leftIcon="link"
        value={value}
        onChangeText={setValue}
      />
      <Text className="text-zinc-500 text-xs font-dm-sans">
        Value: {value || '(empty)'}
      </Text>
    </View>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveInput />,
};

// ---------------------------------------------------------------------------
// On Different Backgrounds
// ---------------------------------------------------------------------------

export const OnLightBackground: Story = {
  decorators: [
    (Story) => (
      <View className="flex-1 p-6 gap-6 bg-white">
        <Story />
      </View>
    ),
  ],
  args: {
    placeholder: 'Coller votre lien ici...',
    leftIcon: 'link',
  },
};

export const OnDarkBackground: Story = {
  decorators: [
    (Story) => (
      <View className="flex-1 p-6 gap-6 bg-zinc-900">
        <Story />
      </View>
    ),
  ],
  args: {
    placeholder: 'Coller votre lien ici...',
    leftIcon: 'link',
    variant: 'dark',
  },
};

export const OnNavbarBackground: Story = {
  decorators: [
    (Story) => (
      <View className="flex-1 p-6 gap-6" style={{ backgroundColor: '#EBEFFF' }}>
        <Story />
      </View>
    ),
  ],
  render: () => (
    <View className="gap-4">
      <Text className="text-zinc-600 text-sm font-dm-sans-medium">
        As it appears in expanded Navbar
      </Text>
      <Input placeholder="Coller votre lien ici..." leftIcon="link" />
    </View>
  ),
};

// ---------------------------------------------------------------------------
// Variants Comparison
// ---------------------------------------------------------------------------

export const Variants: Story = {
  decorators: [
    (Story) => (
      <View className="flex-1">
        <Story />
      </View>
    ),
  ],
  render: () => (
    <View className="flex-1">
      {/* Light variant on light background */}
      <View className="p-6 gap-4" style={{ backgroundColor: '#EBEFFF' }}>
        <Text className="text-zinc-700 text-sm font-dm-sans-medium">
          Light variant (default) - for light backgrounds
        </Text>
        <Input placeholder="Coller votre lien ici..." leftIcon="add-line" variant="light" />
      </View>

      {/* Dark variant on dark background */}
      <View className="p-6 gap-4" style={{ backgroundColor: '#1E1B4B' }}>
        <Text className="text-zinc-300 text-sm font-dm-sans-medium">
          Dark variant - for dark backgrounds
        </Text>
        <Input placeholder="Coller votre lien ici..." leftIcon="add-line" variant="dark" />
      </View>
    </View>
  ),
};
