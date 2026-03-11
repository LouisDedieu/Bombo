import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { TicketCard } from './TicketCard';

const meta: Meta<typeof TicketCard> = {
  title: 'Components/TicketCard',
  component: TicketCard,
  decorators: [
    (Story) => (
      <View style={{ padding: 24, backgroundColor: '#1a1744', flex: 1, maxWidth: 400 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    category: {
      control: 'select',
      options: ['food', 'culture', 'nightlife', 'shopping', 'nature', 'other'],
    },
    price: {
      control: 'text',
    },
    isMustSee: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof TicketCard>;

export const Culture: Story = {
  args: {
    category: 'culture',
    title: 'Musée du Louvre',
    price: 17,
    tags: ['art', 'history'],
    description: 'Le plus grand musée d\'art au monde, abritant des chefs-d\'œuvre comme la Joconde et la Vénus de Milo.',
    tip: 'Achetez vos billets en ligne pour éviter les files d\'attente.',
    isMustSee: true,
  },
};

export const Food: Story = {
  args: {
    category: 'food',
    title: 'Le Bouillon Chartier',
    price: 15,
    tags: ['french cuisine', 'historic'],
    description: 'Restaurant parisien emblématique depuis 1896, offrant une cuisine française traditionnelle à prix abordable.',
  },
};

export const NightlifeFree: Story = {
  args: {
    category: 'nightlife',
    title: 'Bar le Comptoir Général',
    price: 'free',
    tags: ['bar', 'live music'],
    description: 'Un bar unique dans un ancien entrepôt, avec une ambiance tropicale et des événements culturels.',
    tip: 'Arrivez tôt le week-end, ça se remplit vite !',
  },
};

export const Shopping: Story = {
  args: {
    category: 'shopping',
    title: 'Marché aux Puces de Saint-Ouen',
    price: 'free',
    tags: ['antiques', 'vintage'],
    description: 'Le plus grand marché aux puces du monde avec plus de 2000 marchands proposant antiquités et objets vintage.',
    isMustSee: true,
  },
};

export const Nature: Story = {
  args: {
    category: 'nature',
    title: 'Jardin des Tuileries',
    price: 'free',
    tags: ['park', 'relaxation'],
    description: 'Magnifique jardin à la française situé entre le Louvre et la Place de la Concorde.',
  },
};

export const WithoutTags: Story = {
  args: {
    category: 'other',
    title: 'Visite guidée insolite',
    price: 25,
    description: 'Découvrez Paris autrement avec cette visite guidée des lieux secrets de la capitale.',
    tip: 'Réservation obligatoire 48h à l\'avance.',
  },
};

export const LongTitle: Story = {
  args: {
    category: 'culture',
    title: 'Exposition temporaire au Centre Pompidou - Rétrospective complète',
    price: 14,
    tags: ['art moderne'],
    description: 'Une exposition exceptionnelle présentant les œuvres majeures de l\'artiste.',
    isMustSee: true,
  },
};
