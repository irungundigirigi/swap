import { TextInput, Pressable, FlatList, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import uuid from 'react-native-uuid';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { useDispatch, UseDispatch, useSelector } from 'react-redux';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { API_BASE_URL } from '@/constants/api';
import { setNotification } from '@/redux/slices/notificationSlice';
import { Ionicons } from '@expo/vector-icons';
import { authFetch } from '../utils/authFetch';
import { reload } from '../redux/slices/itemsSlice';
import { setLoading, setLoadingMessage } from '../redux/slices/loadingSlice';
import * as Location from 'expo-location';


//tables - listings, listing_item, swapping_for
// fields - listing_id, user_id, caption, likes*, | listing_id, item_id | item_id*, category_id
export default function createListing() {
    const dispatch = useDispatch();
    const colorscheme = useColorScheme();
    const [formData, setFormData] = useState({
        listing_id: '',
        caption: '',
        item_ids: [], // changed from item_id
        category_id: ''
    });
    
    const[itemSearchTxt, setItemSearchText] = useState('o');
    const items = useSelector(state => state.items.items);
    const searched_items = items?.filter(item => item.title.toLowerCase().startsWith(itemSearchTxt.toLowerCase()));


    const updateFormData = (key, value) => {
        setFormData(prevState => ({ ...prevState, [key]: value }));
    };

    const toggleItemSelection = (itemId) => {
        setFormData(prev => {
            const exists = prev.item_ids.includes(itemId);
            const updatedIds = exists
                ? prev.item_ids.filter(id => id !== itemId)  // remove
                : [...prev.item_ids, itemId];               // add
    
            return { ...prev, item_ids: updatedIds };
        });
    };

    const categories_map = {"Camping":1, "books":2};
    const categories=["Camping","books"];

    const handleSubmit = async () => {
        // Ensure required form data is present
        if (!formData.caption || !formData.category_id || !formData.item_ids?.length) {
          dispatch(setNotification({ message: "Please fill in all required fields", type: "error", duration: 2000 }));
          return;
        }
      
        try {

      
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            dispatch(setNotification({ message: "Location permission denied", type: "error", duration: 2000 }));
            return;
          }
          dispatch(setLoading(true));
          dispatch(setLoadingMessage('Checking location permission...'));
          dispatch(setLoadingMessage('Fetching location...'));
          const loc = await Location.getCurrentPositionAsync({});
      
          if (!loc || !loc.coords) {
            dispatch(setNotification({ message: "Could not fetch location", type: "error", duration: 2000 }));
            return;
          }
      
          const { latitude, longitude } = loc.coords;
      
          const listing_id = uuid.v4();
          const item_body = {
            listing_id,
            caption: formData.caption,
            category: formData.category_id,
            item_ids: formData.item_ids,
            location: { latitude, longitude }
          };
      
          dispatch(setLoadingMessage('Uploading listing...'));
      
          const data = await authFetch('/api/listing', {
            method: 'POST',
            body: JSON.stringify(item_body)
          });
      
          if (data) {
            dispatch(setNotification({ message: "Listing added successfully!", type: "success", duration: 2000 }));
            dispatch(reload());
          }
      
        } catch (error) {
          console.error('Error uploading Listing', error);
          dispatch(setNotification({ message: "Error adding listing", type: "error", duration: 2000 }));
        } finally {
          dispatch(setLoading(false));
          dispatch(setLoadingMessage(''));
        }
      };
      
    
    
    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search item to swap"
                placeholderTextColor={colorscheme === 'light' ? 'grey' : 'gray'}
                style={colorscheme == 'light' ? styles.inputField : styles.inputFieldDark}
                value={itemSearchTxt}
                onChangeText={(text) => setItemSearchText(text)} 
            />
            <Text style={{color:'white', padding:5,fontFamily: 'OutfitRegular',}}>Select item</Text>
            {searched_items.map((item, index) => (
               <View key={item.item_id} style={styles.itemContainer} >

                    <Image source={{ uri: `${API_BASE_URL}${item?.image[0]}` }} style={styles.image} />
                    <View style={styles.infoContainer}>
                        <Text style={styles.title}>{item?.title}</Text>
                    </View>
                    
                    <Pressable
                        style={{ position: 'absolute', right: 5, top: 1 }}
                        onPress={() => toggleItemSelection(item.item_id)}
                    >
                        <Ionicons
                            name={formData.item_ids.includes(item.item_id) ? "checkmark-circle" : "add-circle"}
                            size={24}
                            color={formData.item_ids.includes(item.item_id) ? "green" : "white"}
                        />
                    </Pressable>

                    {formData.item_ids.includes(item.item_id) && (
                        <Text style={{ color: 'green' }}>selected</Text>
                    )}
                
                </View>

            ))}
                
            <TextInput
                placeholder="Caption"
                placeholderTextColor={colorscheme === 'light' ? 'grey' : 'gray'}
                style={colorscheme == 'light' ? styles.inputField : styles.inputFieldDark}
                value={formData.caption}
                onChangeText={(text) => updateFormData('caption', text)} 
            />
            <View style={{marginBottom:15}}>
                <Text style={{color:'grey', fontFamily: 'OutfitRegular',marginBottom: 5}}>Swap for :  {formData.category || 'none'}</Text>
                {categories.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                        {categories.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => updateFormData('category_id',categories_map[item])}>
                                <Text style={styles.suggestionText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Add Listing</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#00171f',
        flex: 1,
        padding: 32
    },
    inputField: {
        fontFamily: 'OutfitRegular',
        color: 'black',
        fontSize: 15,
        height: 50,
        borderColor: '#ccc',
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 12,
    },
    inputFieldDark: {
        fontFamily: 'OutfitRegular',
        fontSize: 15,
        height: 50,
        borderColor: '#78c6a3',
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 12,
        color: 'white'
    },
    button: {
        backgroundColor: '#0582ca',
        padding: 5,
        borderRadius: 8,
        alignItems: 'center',
        width: 120,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'OutfitRegular',

    },
    suggestionsContainer: {
        flexDirection: 'row',
        flexWrap:'wrap',
        gap: 5,
    },
    suggestionText: {
        width: 'auto',
        color: 'white',
        fontFamily: 'OutfitRegular',
        backgroundColor: '#344e41',
        padding: 5
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 14,
        color: '#78c6a3',
        fontFamily: 'OutfitRegular',
        marginBottom: 5,
    },
    itemContainer: {
        alignItems:'center',
        borderRadius:8,
        marginBottom: 10,
        padding:5,
        position: 'relative',
        flexDirection: 'row',

    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 6,
        marginRight: 10,
    },
    infoContainer: {
        
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontFamily: 'OutfitRegular',
        color: '#0582ca',   
    },
  
});