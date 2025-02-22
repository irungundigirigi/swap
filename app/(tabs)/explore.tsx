import { StyleSheet, Text,Button,ActivityIndicator, View } from 'react-native';
import React, {useEffect, useState} from 'react';
import ListCard from '@/components/ItemCard';
import { router } from 'expo-router';
import { setItems } from '@/redux/slices/itemsSlice';
import { useFocusEffect } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { authFetch } from '../../utils/authFetch';
import RoundPressable from '../../components/RoundPressable';
export default function TabTwoScreen() {

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch()
  const items = useSelector((state) => state.items.items);
  const Fetch = useSelector((state) => state.items.fetchItems);


  const fetchItems = async () => {
    try {
      const items = await authFetch('/api/items', {method: 'GET'})
      dispatch(setItems(items));

    } catch (err) {
      setError(err.message || "Failed to load items");
    } 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true)
    fetchItems();
    setLoading(false)
  }, [Fetch]);

  return (
    <>
      <View  style={{position:'absolute', left:'50%', top: 30, zIndex:10}}>{loading && <ActivityIndicator size='large' color='blue' />}</View>
      <View style={{position:'absolute', right: 35, top: 20, zIndex:10}}> 
        <RoundPressable onPress={() => router.push('addItem')} iconName='add-outline'></RoundPressable>
      </View>
  
    <View style={styles.ScrollView}>
      <Text style={{color:'white', fontSize: 14}}>{loading && 'Fetching items'}</Text>
      <Text style={styles.title1} >My items</Text>
      <ListCard items ={items} />
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  ScrollView: {
    flex: 1,
    padding: 32,
    backgroundColor: '#00171f'
  },
  title1: {
    color: 'white',
    fontFamily: 'OutfitRegular',
    fontSize: 16,
    padding: 10
  },
  addbtn: {
    position: 'absolute',
    top: 0,
    right: 35
  }
 
});
