import { Image, StyleSheet, Platform } from 'react-native';
import {ListingCard } from '../../components/ListingCard';
import React, {useEffect, useState} from 'react';
import Notification from '@/components/Notification';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import {Listings} from '../../constants/listings';
import { useDispatch, useSelector } from "react-redux";
import { setNotification, clearNotification } from '@/redux/slices/notificationSlice';
import { setItems } from "../../redux/slices/listingsSlice";
import { FlatList, Text, ActivityIndicator, View } from "react-native";
// import { HelloWave } from '@/components/HelloWave';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';


export default function HomeScreen() {

  const dispatch = useDispatch();

  const listings = useSelector((state) => state.listings.listings);
  //const notification = useSelector((state) => state.notification.notification);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        // const response = await fetch("../../constants/listings");
        dispatch(setItems(Listings)); // Store items in Redux
        // dispatch(setNotification({ message: "Listings fetched successfully!", type: "success", duration:5000 }))
       

      } catch (err) {
        setError(err.message || "Failed to load items");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();

   

  }, [dispatch]);

  // const logout = async () => {
  //   await AsyncStorage.removeItem('authToken');
  //   router.replace('/login');
  // };
  

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#3A5A40' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
       {listings.map((listing) => (
        <ListingCard key={listing.username} listing={listing} />
        ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
