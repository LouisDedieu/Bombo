import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { SharePromotionCard } from './SharePromotionCard';

const meta: Meta<typeof SharePromotionCard> = {
  title: 'Components/SharePromotionCard',
  component: SharePromotionCard,
  decorators: [
    (Story) => (
      <View className="flex-1 p-4 bg-[#1a1744]">
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SharePromotionCard>;

// ---------------------------------------------------------------------------
// Default
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {},
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
  args: {},
};
