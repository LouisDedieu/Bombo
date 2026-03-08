import type { Meta, StoryObj } from '@storybook/react';
import { View, Text } from 'react-native';
import Loader from './Loader';
import { colors } from '@/constants/colors';

const meta: Meta<typeof Loader> = {
  title: 'Components/Loader',
  component: Loader,
  decorators: [
    (Story) => (
      <View className="flex-1 items-center justify-center bg-bg-primary p-8">
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Loader>;

export const Default: Story = {
  args: {
    size: 72,
    color: colors.textPrimary,
    speed: 110,
  },
};

export const Small: Story = {
  args: {
    size: 36,
    color: 'rgba(255,255,255,0.6)',
    speed: 90,
  },
};

export const WithLabel: Story = {
  render: () => (
    <View className="items-center gap-6 rounded-sm border border-divider bg-white/5 px-14 py-10">
      <Loader size={64} />
      <Text className="text-tiny uppercase tracking-widest text-text-subtle">
        Calcul de l'itinéraire
      </Text>
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View className="flex-row items-center gap-8">
      <Loader size={36} />
      <Loader size={48} />
      <Loader size={64} />
      <Loader size={72} />
    </View>
  ),
};
