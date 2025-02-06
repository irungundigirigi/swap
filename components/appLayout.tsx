import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { Text,Platform, View, Image} from 'react-native';
import Constants from 'expo-constants';
import Logo from '../assets/images/swaps-logo1.png';

import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from "react-redux";
import { store } from "../redux/store";
import Notification from '@/components/Notification';
import { useDispatch, useSelector } from "react-redux";
import { clearNotification , setNotification} from '@/redux/slices/notificationSlice';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const dispatch = useDispatch()
  const colorScheme = useColorScheme();
  const notification = useSelector((state) => state.notification.notification)
  const [loaded] = useFonts({
    OutfitRegular: require('../assets/fonts/Outfit-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  console.log(notification)

  const paddingTop = Constants.statusBarHeight + 20;

  return (
    // <Provider store={store}>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{flex:0.05, backgroundColor: '#00171f',paddingTop, paddingLeft:32, zIndex:23}}>
        <Image source={require("../assets/images/swaps-logo1.png")} style={{width:80, height: 20}} />
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
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
   
            
    </ThemeProvider>
    /* </Provider> */
  );
}
