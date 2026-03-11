import React from 'react';
import { View, Text, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Pill } from './Pill';
import Icon from 'react-native-remix-icon';
import { type ColorScheme } from './SecondaryButton';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CategoryType =
  | 'food'
  | 'culture'
  | 'nightlife'
  | 'shopping'
  | 'nature'
  | 'other';

export interface TicketCardProps {
  category: CategoryType;
  title: string;
  price: number | 'free';
  tags?: string[];
  description: string;
  tip?: string;
  isMustSee?: boolean;
  colorScheme?: ColorScheme;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Category Configuration
// ---------------------------------------------------------------------------

const CATEGORY_CONFIG: Record<CategoryType, { label: string; icon: string; color: string }> = {
  food: { label: 'Food', icon: 'restaurant-fill', color: '#c16833' },
  culture: { label: 'Culture', icon: 'bank-fill', color: '#2055A5' },
  nightlife: { label: 'Nightlife', icon: 'moon-fill', color: '#533495' },
  shopping: { label: 'Shopping', icon: 'checkbox-fill', color: '#9551d6' },
  nature: { label: 'Nature', icon: 'tree-fill', color: '#10762B' },
  other: { label: 'Other', icon: 'map-pin-fill', color: '#8f8cb5' },
};

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

const CARD_BG = 'rgba(30, 26, 100, 0.55)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.09)';
const STUB_BG = 'rgba(53, 41, 193, 0.22)';
const NOTCH_BG = '#14115a';

const PRICE_BG = 'rgba(163, 182, 30, 0.18)';
const PRICE_TEXT = '#a3b61e';
const PRICE_BORDER = 'rgba(163, 182, 30, 0.35)';

const TAG_BG = 'rgba(255, 255, 255, 0.12)';
const TAG_TEXT = 'rgba(255, 255, 255, 0.55)';

const GOLD = '#e8d64a';
const DIVIDER_COLOR = 'rgba(255, 255, 255, 0.06)';
const DESC_COLOR = 'rgba(255, 255, 255, 0.4)';
const TIP_COLOR = 'rgba(106, 173, 255, 0.65)';

// ---------------------------------------------------------------------------
// Helper Components
// ---------------------------------------------------------------------------

function StubNotch({ position }: { position: 'top' | 'bottom' }) {
  return (
    <View
      style={{
        position: 'absolute',
        [position]: -10,
        right: -10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: NOTCH_BG,
        borderWidth: 1,
        borderColor: CARD_BORDER,
        zIndex: 3,
        borderTopColor: position === 'top' ? NOTCH_BG : CARD_BORDER,
        borderBottomColor: position === 'bottom' ? NOTCH_BG : CARD_BORDER,
      }}
    />
  );
}

function DashedSeparator({ topOffset, bottomOffset }: { topOffset: number; bottomOffset: number }) {
  return (
    <View
      style={{
        position: 'absolute',
        top: topOffset,
        bottom: bottomOffset,
        right: 0,
        width: 1.5,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
      }}
    >
      {[...Array(10)].map((_, i) => (
        <View
          key={i}
          style={{
            width: 1.5,
            height: 5,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          }}
        />
      ))}
    </View>
  );
}

function MustSeeRibbon() {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 100,
        height: 100,
        overflow: 'hidden',
        borderTopRightRadius: 20,
      }}
    >
      <LinearGradient
        colors={[
          'transparent',
          'rgba(232, 214, 74, 0.08)',
          'rgba(232, 214, 74, 0.38)',
          'rgba(232, 214, 74, 0.50)',
        ]}
        locations={[0, 0.2, 0.58, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          position: 'absolute',
          top: 30,
          right: -30,
          width: 140,
          height: 24,
          borderTopWidth: 1,
          borderTopColor: 'rgba(232, 214, 74, 0.52)',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(232, 214, 74, 0.14)',
          transform: [{ rotate: '45deg' }],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
        }}
      >
        <Icon name={"star-fill"} size={10} color={GOLD} />
        <Text
          style={{
            fontFamily: 'Righteous',
            fontSize: 8.5,
            letterSpacing: 0.85,
            textTransform: 'uppercase',
            color: GOLD,
          }}
        >
          Must-see
        </Text>
      </LinearGradient>
    </View>
  );
}


// ---------------------------------------------------------------------------
// TicketCard Component
// ---------------------------------------------------------------------------

export function TicketCard({
                             category,
                             title,
                             price,
                             tags = [],
                             description,
                             tip,
                             isMustSee = false,
                             style,
                           }: TicketCardProps) {
  const categoryConfig = CATEGORY_CONFIG[category];

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: CARD_BG,
          borderRadius: 20,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {/* Inner border */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderWidth: 1,
          borderColor: CARD_BORDER,
          borderRadius: 20,
          zIndex: 1,
        }}
      />

      {/* Stub (left side) */}
      <View
        style={{
          width: 44,
          backgroundColor: STUB_BG,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          paddingVertical: 20,
          gap: 4,
        }}
      >
        <StubNotch position="top" />
        <StubNotch position="bottom" />
        <DashedSeparator topOffset={10} bottomOffset={10} />

        <Icon name={categoryConfig.icon as any} size={20} color={categoryConfig.color} />

        {/* Vertical label container */}
        <View
          style={{
            height: 50,
            width: 12,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <Text
            style={{
              fontFamily: 'Righteous',
              fontSize: 8,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              color: categoryConfig.color,
              transform: [{ rotate: '-90deg' }],
              width: 50,
              textAlign: 'center',
            }}
            numberOfLines={1}
          >
            {categoryConfig.label}
          </Text>
        </View>
      </View>

      {/* Body (right side) */}
      <View
        style={{
          flex: 1,
          padding: 16,
          paddingLeft: 18,
          paddingBottom: 18,
          flexDirection: 'column',
          gap: 10,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {isMustSee && <MustSeeRibbon />}

        {/* Title */}
        <Text
          style={{
            fontFamily: 'Righteous',
            fontSize: 18,
            color: '#FFFFFF',
            letterSpacing: 0.18,
            lineHeight: 22,
            paddingRight: isMustSee ? 52 : 0,
          }}
          numberOfLines={2}
        >
          {title}
        </Text>

        {/* Price + tags row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            flexWrap: 'wrap',
          }}
        >
          <Pill
            label={price === 'free' ? 'GRATUIT' : `${price}€`}
            backgroundColor={PRICE_BG}
            textColor={PRICE_TEXT}
            style={{ borderWidth: 1, borderColor: PRICE_BORDER, }}
            fontFamily= 'Righteous'
          />

          {tags.length > 0 && (
            <>
              <View
                style={{
                  width: 1,
                  height: 14,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }}
              />
              {tags.map((tag, index) => (
                <Pill
                  key={index}
                  label={tag}
                  backgroundColor={TAG_BG}
                  textColor={TAG_TEXT}
                />
              ))}
            </>
          )}
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: DIVIDER_COLOR }} />

        {/* Description */}
        <Text
          style={{
            fontFamily: 'DMSans',
            fontSize: 12.5,
            lineHeight: 21,
            color: DESC_COLOR,
          }}
          numberOfLines={3}
        >
          {description}
        </Text>

        {/* Tip (optional) */}
        {tip && (
          <Text
            style={{
              fontFamily: 'DMSans',
              fontSize: 12,
              fontStyle: 'italic',
              lineHeight: 19,
              color: TIP_COLOR,
            }}
            numberOfLines={2}
          >
            {tip}
          </Text>
        )}
      </View>
    </View>
  );
}