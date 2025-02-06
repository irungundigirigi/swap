import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AppLayout from '@/components/appLayout';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from "react-redux";
import { store } from "../redux/store";
import Notification from '@/components/Notification';
import { useDispatch, useSelector } from "react-redux";
import { clearNotification } from '@/redux/slices/notificationSlice';




import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  // const [loaded] = useFonts({
  //   OutfitRegular: require('../assets/fonts/Outfit-Regular.ttf'),
  // });

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // if (!loaded) {
  //   return null;
  // }

  return (
    <Provider store={store}>
    {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider> */}
      <AppLayout />
    </Provider>
  );
}
