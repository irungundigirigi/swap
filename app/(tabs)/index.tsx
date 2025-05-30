import { Image, StyleSheet } from 'react-native';
import {ListingCard } from '../../components/ListingCard';
import React, {useEffect, useState} from 'react'
import { View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "../../redux/slices/listingsSlice";
import { setUser} from "../../redux/slices/userSlice";
import {flipLoading } from '../../redux/slices/itemsSlice'
import { router } from "expo-router";
import {authFetch} from '../../utils/authFetch';
import RoundPressable from '../../components/RoundPressable';
import ImageView from '@/components/ImageView';


  // const logout = async () => {
  //   await AsyncStorage.removeItem('authToken');
  //   router.replace('/login');
  // };
export default function HomeScreen() {

  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings.listings);
  const refetch = useSelector((state) => state.items.fetchItems);
  const loggedUser = useSelector((state) => state.user.user); // Get logged in user data

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchListings = async () => {
    setLoading(true);
    
    try {
      setLoading(true);
      const user_data = await authFetch('/api/validate-token', {method: 'GET'});
      const data = await authFetch('/api/listings', {method: 'GET'});
      await dispatch(setUser(user_data.user));
      await dispatch(setItems(data));
      dispatch(flipLoading(true));

    } catch (err) {
      setError(err.message || "Failed to load items");
    } finally {
      dispatch(flipLoading(false));
    }
  };

  useEffect(() => {
    fetchListings();
  }, [refetch]);

  // Filter out listings created by the currently logged-in user
  const filteredListings = listings.filter((listing) => listing.user.user_id !== loggedUser.user_id);

  return (
    <>
    <View style={{position:'absolute', right: 35, top: 20, zIndex:10}}> 
      <RoundPressable onPress={() => router.push('/createListing')} iconName='pencil'></RoundPressable>
    </View>

    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#3A5A40' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
        {/* <View style={{height:"auto", width: "80%"}}>
          <ImageView images={["https://picsum.photos/470" ]} />
        </View> */}

       {filteredListings.length > 0 && filteredListings.map((listing) => (
        <ListingCard key={listing.listing_id} listing={listing} />
        ))}      
    </ParallaxScrollView>
    </>
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
