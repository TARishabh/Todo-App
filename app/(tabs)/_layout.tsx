import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, useNavigation } from 'expo-router';
import { Pressable, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useToggleDarkMode } from '@/providers/modeContext';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}


export default function TabLayout() {
  const navigation = useNavigation();
  const {isDarkMode, toggleDarkMode} = useToggleDarkMode()
  // const handleSearchPress = () => {
  //   navigation.navigate('/modal'); // Navigate to a dedicated Search screen
  // };

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: '#000000',
            headerStyle: {
              backgroundColor: 'transparent',
            },
            tabBarStyle: {
              backgroundColor: 'transparent',
            },
            tabBarBackground: () => (
              <LinearGradient
                colors={['#ad1bed', '#6e72fc']} // Dynamic gradient colors based on dark mode state
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            ),
            headerBackground: () => (
              <LinearGradient
                colors={['#ad1bed', '#6e72fc']} // Dynamic gradient colors based on dark mode state
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            ),
            headerShown: useClientOnlyValue(false, true),
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              headerTintColor: 'white',
              headerTitleAlign: 'center',
              tabBarIcon: ({ color }) => <TabBarIcon name="archive" color={color} />,

          headerRight: () => (
            <>
                {/* <Pressable onPress={handleSearchPress}>
                  {({ pressed }) => (
                    <FontAwesome
                      name="search"
                      size={25}
                      color={'white'}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable> */}
                <Pressable onPress={toggleDarkMode}>
                {({ pressed }) => (
                  <FontAwesome
                    name={isDarkMode ? 'sun-o' : 'moon-o'}
                    size={25}
                    color={'white'}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </>

          ),
        }}
      />
          <Tabs.Screen
            name="completed"
            options={{
              title: 'Completed',
              headerTintColor: 'white',
              headerTitleAlign: 'center',
              tabBarIcon: ({ color }) => <TabBarIcon name="check" color={color} />,
            }}
          />
        </Tabs>
    </SafeAreaView>
  );
}
