import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Inbox, Map, User } from 'lucide-react-native';

const COLOR_ACTIVE   = '#3b82f6';
const COLOR_INACTIVE = '#71717a';

function TabIcon({
                   Icon,
                   label,
                   focused,
                 }: {
  Icon: React.ComponentType<{ size?: number; color: string }>;
  label: string;
  focused: boolean;
}) {
  const color = focused ? COLOR_ACTIVE : COLOR_INACTIVE;
  return (
    <View style={{ alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 }}>
      <Icon size={24} color={color} />
      <Text style={{ fontSize: 12, color, marginTop: 4 }}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#18181b',
          borderTopWidth: 1,
          borderTopColor: '#27272a',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={Inbox} label="Inbox" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="trips/index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={Map} label="Voyages" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={User} label="Profil" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="trips/[tripId]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="review/[tripId]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}