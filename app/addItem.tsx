import { Link, Stack } from 'expo-router';
import { TextInput, FlatList, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import uuid from 'react-native-uuid';
import { authFetch, authImageFetch } from '../utils/authFetch';
import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import {reload} from '../redux/slices/itemsSlice';
import { useDispatch, UseDispatch } from 'react-redux';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { API_BASE_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories } from '@/constants/data/categories';
import { setNotification } from '@/redux/slices/notificationSlice';


const addItem = () => {

    const[itemCategories, setItemCategories]=useState([]);

    //Fetches available item categories from API
    const fetch_categories = async() => {
        const categories_ = await authFetch('/api/item_categories', {method: 'GET'})
        setItemCategories(categories_);
        setSuggestions([]);
    }

    //Fetches available tags based on selected category
    const fetchTags = async(category:Number) => {
        const category_tags = await authFetch(`/api/category_tags?category_id=${category}`, {method: 'GET'})
        console.log(category_tags)
        await setCategory_tags(category_tags)
 
    }

    useEffect(() =>
    { 
        fetch_categories()
    }, []
    )
    const dispatch = useDispatch();
    const colorscheme = useColorScheme();

    //Manage Component state -- form data
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        condition: '',
        images: [],
        image_urls:[],
        tags: []
    });
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [tags, setTags] = useState([]);
    const [category_tags, setCategory_tags] = useState([]);
    const categories_map = {"Camping":1, "books":2};
    const categories=["Camping", "books"]
    const conditions = ["new", "gently-used", "used", "damaged", "vintage"];


    //updates form data
    const updateFormData = (key, value) => {
        setFormData(prevState => ({ ...prevState, [key]: value }));
    };

    const updateSuggestions = (text) => {
        setInput(text);
        const filteredSuggestions = category_tags?.filter(item =>
            item.tag_name.toLowerCase().startsWith(text.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
    };

    const addTag = (tag) => {
        if (!formData.tags.includes(tag)) {
            updateFormData('tags', [...formData.tags, tag]);
        }
        console.log(formData.tags); 
        setInput('');
        setSuggestions([]);
    };

    const updateItemCategory = async (category_id) => {
        await fetchTags(category_id);
        await updateFormData('category',category_id)
    }

    const removeTag = (tag) => {
        const filtered_tags =  formData.tags.filter(t => t !== tag);
        setFormData(prevState => ({ ...prevState, tags: filtered_tags }));
    };

    // Note: Expo’s ImagePicker.launchImageLibraryAsync() only supports allowsMultipleSelection on iOS 14+. 
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access gallery is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            updateFormData('images', result.assets.map(asset => asset.uri));
            
        }

    };

    const handleSubmit = async () => {

            // Validate form fields
            if (!formData.title || !formData.description || !formData.category || !formData.condition || formData.images.length === 0) {
                dispatch(setNotification({ message: "Please fill in all required fields.", type: "error", duration: 2000 }));
                return;
            }
     
            try {

                // Check for duplicate item title
                
                const existing = await authFetch(`/api/check_item_title?title=${formData.title}`, {
                method: 'GET'
                 });
                console.log(existing)

                

                if (existing.exists) {
                    dispatch(setNotification({ message: "An item with this title already exists.", type: "error", duration: 2000 }));
                    return;
                }

                const formd = new FormData();
                const item_id = uuid.v4();
                const tagIds = formData.tags.map(tag => tag.id);
        
                // Append images
                formData.images.forEach((image, i) => {
                    let imgName = `${formData.title.replace(/\s+/g, '')}_${Math.floor(Math.random() * 50) + 1}.jpg`;
        
                    formd.append("images[]", {
                        uri: image,
                        type: "image/jpeg",
                        name: imgName
                    });
                });
        
                // Append other item details
                formd.append("item_id", item_id);
                formd.append("title", formData.title);
                formd.append("description", formData.description);
                formd.append("condition", formData.condition);
                formd.append("category_id", formData.category);
                formd.append("tags", JSON.stringify(tagIds)); // Convert array to string
                
                // API request
                const response = await authImageFetch('/api/item-upload', {
                    method: 'POST',
                    body: formd
                });

                dispatch(setNotification({ message: response.message, type: "success", duration: 2000 }));
                dispatch(reload())
        
                console.log("Upload response:", response);
            } catch (error) {
                console.error("Error uploading item:", error);
            }
    };
    
    
    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Title"
                placeholderTextColor={colorscheme === 'light' ? 'grey' : 'gray'}
                style={colorscheme == 'light' ? styles.inputField : styles.inputFieldDark}
                value={formData.title}
                onChangeText={(text) => updateFormData('title', text)} 
            />
            <TextInput
                placeholder="Description"
                placeholderTextColor={colorscheme === 'light' ? 'grey' : 'gray'}
                style={colorscheme == 'light' ? styles.inputField : styles.inputFieldDark}
                value={formData.description}
                onChangeText={(text) => updateFormData('description', text)} 
            />
            <View style={{marginBottom:15}}>
                <Text style={{color:'grey', fontFamily: 'OutfitRegular',marginBottom: 5}}>Item category:  {formData.category || 'none'}</Text>
                {itemCategories.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                        {itemCategories.map((item, index) => (
                            <TouchableOpacity key={index} 
                                onPress={() => updateItemCategory(item.category_id)}
                                // onPress={() => updateFormData('category',item.category_id)}
                            >
                                <Text style={styles.suggestionText}>{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            <View style={{marginBottom:15}}>
                <Text style={{color:'grey', fontFamily: 'OutfitRegular',marginBottom: 5}}>Item condition:  {formData.condition || 'none'}</Text>
                {conditions.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                        {conditions.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => updateFormData('condition',item)}>
                                <Text style={styles.suggestionText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            <TextInput
                placeholder="Search tags"
                placeholderTextColor={colorscheme === 'light' ? 'grey' : 'gray'}
                style={colorscheme == 'light' ? styles.inputField : styles.inputFieldDark}
                value={input}
                onChangeText={updateSuggestions}
            />
            {/* Suggestions Container */}
            {suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                    {suggestions.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => addTag(item)}>
                            <Text style={styles.suggestionText}>{item.tag_name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            <View style={styles.selectedTagsContainer}>
                {formData.tags?.map((tag, index) => (
                    <View key={index} style={styles.tagItem}>
                        <Text style={styles.tagText}>{tag.tag_name}</Text>
                        <TouchableOpacity onPress={() => removeTag(tag)}>
                            <MaterialIcons name="cancel" size={24} color="#ba181b" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Add Images</Text>
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
                {formData.images.map((imgUri, index) => (
                    <Image key={index} source={{ uri: imgUri }} style={styles.image} />
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>ADD ITEM</Text>
            </TouchableOpacity>
        </View>
    );
}
export default addItem;

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
    imageContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    image: {
        width: 90,
        height: 60,
        borderRadius: 6,
        marginRight: 8,
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 14,
        color: '#78c6a3',
        fontFamily: 'OutfitRegular',
        marginBottom: 5,
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
    selectedTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10
    },
    tagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffea00',
        padding: 4,
        marginRight: 5
    },
    tagText: {
        color: 'black',
        marginRight: 0,
        fontFamily: 'OutfitRegular',
    }
});