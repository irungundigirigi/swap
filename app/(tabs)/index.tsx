import { Image, StyleSheet,Button, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/api';
import {ListingCard } from '../../components/ListingCard';
import React, {useEffect, useState} from 'react'
import { View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "../../redux/slices/listingsSlice";
import { router } from "expo-router";


  // const logout = async () => {
  //   await AsyncStorage.removeItem('authToken');
  //   router.replace('/login');
  // };
  
export default function HomeScreen() {

  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings.listings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      
      try {
        const token = await AsyncStorage.getItem('authToken');

        if (!token) {
          throw new Error('Authorization token is missing');
        }

        const response = await fetch(`${API_BASE_URL}/api/listings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const listings = await response.json();
          dispatch(setItems(listings));
        } else {
          console.error('Failed to fetch listings:', response.status, response.statusText);
        }

        const listings = useSelector((state) => state.listings.listings);

      } catch (err) {
        setError(err.message || "Failed to load items");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();

  }, []);

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
        
        <View style={{position:'absolute', right: 20, top: 10}}>
          <Button  title='create-listing' onPress={() => router.push('/createListing')} />
        </View>


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
