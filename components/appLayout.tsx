import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { Text,Platform, View, Image} from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/api';
import Logo from '../assets/images/swaps-logo1.png';

import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Provider } from "react-redux";
import { store } from "../redux/store";
import Notification from '@/components/Notification';
import { useDispatch, useSelector } from "react-redux";
import { clearNotification , setNotification} from '@/redux/slices/notificationSlice';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const dispatch = useDispatch()
  const colorScheme = useColorScheme();
  const router = useRouter()
  const [access, setAccess] = useState(false);
  
  const notification = useSelector((state) => state.notification.notification)
  
  const checkTokenValidity = async () => {
    const token = await AsyncStorage.getItem('authToken');

    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/validate-token`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.isValid === true && loaded) {
          await SplashScreen.hideAsync();
          router.replace('/(tabs)/');

        } else if (!data.isValid && loaded){
          SplashScreen.hideAsync();
          await AsyncStorage.removeItem('authToken');
          router.replace('/');
        }
      } catch (error) {
        console.error('Token validation failed:');
        // await AsyncStorage.removeItem('authToken');
        loaded && router.replace('/');
      }
    }
     else if (!token && loaded){
      await SplashScreen.hideAsync();
      router.replace('/');
    }
  };

  const [loaded] = useFonts({
    OutfitRegular: require('../assets/fonts/Outfit-Regular.ttf'),
  });

  useEffect(() => {

    checkTokenValidity()
  }, [loaded]);

  // if (!loaded) {
  //   return null;
  // }

  const paddingTop = Constants.statusBarHeight + 20;

  return (
    // <Provider store={store}>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{flex:0.05, backgroundColor: '#00171f',paddingTop, paddingLeft:32, zIndex:23}}>
        <Image source={require("../assets/images/swaps-logo1.png")} style={{width:70, height: 20}} />
      </View>  
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          // onClose={() => setNotification(null)}
        />)
      }    
     
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
            name="addItem" 
            options={{ 
              headerShown: true, 
              headerStyle: { backgroundColor: '#00171f' }, 
              headerTitleStyle: { color: 'white', fontFamily: 'OutfitRegular', fontSize: 18 }
        }}/>
        <Stack.Screen 
            name="createListing" 
            options={{ 
              headerShown: true, 
              headerStyle: { backgroundColor: '#00171f' }, 
              headerTitleStyle: { color: 'white', fontFamily: 'OutfitRegular', fontSize: 18 }
        }}/>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
   
            
    </ThemeProvider>
    /* </Provider> */
  );
}