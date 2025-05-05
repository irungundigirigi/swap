import { Tabs } from 'expo-router';
import { Text, Button} from 'react-native';

import React from 'react';
import { Platform, View } from 'react-native';
import Notification from '@/components/Notification';
import { useDispatch, useSelector } from "react-redux";
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clearUser} from '../../redux/slices/userSlice'
import { useRouter } from "expo-router";
import UserProfileHeader from '../../components/userProfileHeader'



export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter()
  
  // const dispatch = useDispatch();
  // const user = useSelector((state) => state.user.user)

  // const handleLogOut = async () => {
  //   dispatch(clearUser());
  //   await AsyncStorage.removeItem('authToken');
  //   router.back('/');
  // };


  return (
    <>
    {/* <View>
            <Text style={{color:'white'}}> Logged in as {user?.name}</Text>
            <Button title="Log out" onPress={() => handleLogOut()} />

        </View> */}
        <UserProfileHeader />
    
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
        
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'My Items',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="profile" color={color} />,
        }}
      />
    </Tabs>
    </>
  );
}
