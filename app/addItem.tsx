import { Link, Stack } from 'expo-router';
import { TextInput, FlatList, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import uuid from 'react-native-uuid';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { useDispatch, UseDispatch } from 'react-redux';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { API_BASE_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories } from '@/constants/data/categories';
import { setNotification } from '@/redux/slices/notificationSlice';
import { reload } from '@/redux/slices/itemsSlice';


export default function addItem() {
    const dispatch = useDispatch();
    const colorscheme = useColorScheme();
    const [formData, setFormData] = useState({
        title: '',
        category: 0,
        description: '',
        condition: '',
        images: [],
        image_urls:[],
        tags: []
    });

    const updateFormData = (key, value) => {
        setFormData(prevState => ({ ...prevState, [key]: value }));
    };

    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [tags, setTags] = useState([]);
    const categories_map = {"Camping":1};
    const categories=["Camping"]
    const conditions = ["new", "gently-used", "used", "damaged", "vintage"];

    const tagMap = {
        "Coleman": 1,
        "Waterproof": 3,
        "Lightweight": 4,
        "North Face": 2,
        "LightWeight": 5,
        "Compact": 6,
        "Durable": 7,
        "Windproof": 9,
        "Insulated": 10,
        "Quick-dry": 11,
        "Adjustable": 12,
        "Limited-Edition": 13,
        "Custom-Prints": 14,
        "Collectors-item": 15,
        "Retro-Design": 16,
        "Vintage": 17,
        "Holiday-Themed": 18,
        "Collectors-Item": 19,
        "Recycled": 20,
        "Bio-Degradable": 21,
        "Solar-Powered": 22,
        "PFC-Free": 23,
        "Carbon Neutral": 24,
        "Energy-Efficient": 25,
        "Organic": 26,
        "Responsible-Sourcing": 27
    };
    
    const predefinedTags = [
        "Coleman",
        "Waterproof",
        "Lightweight",
        "North Face",
        "Compact",
        "Durable",
        "Windproof",
        "Insulated",
        "Quick-dry",
        "Adjustable",
        "Limited-Edition",
        "Custom-Prints",
        "Collectors-item",
        "Retro-Design",
        "Vintage",
        "Holiday-Themed",
        "Collectors-Item",
        "Recycled",
        "Bio-Degradable",
        "Solar-Powered",
        "PFC-Free",
        "Carbon Neutral",
        "Energy-Efficient",
        "Organic",
        "Responsible-Sourcing"
    ];
    

    const updateSuggestions = (text) => {
        setInput(text);
        const filteredSuggestions = predefinedTags.filter(item =>
            item.toLowerCase().startsWith(text.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
    };

    const addTag = (tag) => {
        if (!formData.tags.includes(tag)) {
            updateFormData('tags', [...formData.tags, tag]);
        }
        setInput('');
        setSuggestions([]);
    };

    const removeTag = (tag) => {
        setTags(tags.filter(t => t !== tag));
    };

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
            updateFormData('images', [...formData.images, ...result.assets.map(asset => asset.uri)]);
            
        }

    };

    const handleSubmit = async () => {
     
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
              throw new Error('Authorization token is missing');
            }

            const formd = new FormData();

            formData.images.forEach((image, i) => {
                let imgName = `${formData.title.replace(/\s+/g, '')}_${Math.floor(Math.random() * 50) + 1}.jpg`;

                formd.append("images[]", {
                    uri: image,
                    type: "image/jpeg",
                    name: imgName
                });
            });

            const response = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: formd,
                headers: {
                    Authorization: `Bearer ${token}`,
                  }
            });
    
            const data = await response.json();
            
            await updateFormData('image_urls', [...formData.image_urls, ...data.imageUrls]);

            if (formData.image_urls.length == 0) { return null}
            const tagIds = formData.tags.map(tag => tagMap[tag]).filter(id => id !== undefined);

            // item_id,title,description,condition,image,location,category_id 
            const item_id = uuid.v4();

            let fd = formData;
            const item_body ={item_id,title:fd.title,description:fd.description, condition: fd.condition,
                image:fd.image_urls, category_id:fd.category, tags: tagIds
            }
            console.log(item_body)

            const response1 = await fetch(`${API_BASE_URL}/api/item`, {
                method: 'POST',
                body: JSON.stringify(item_body),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  }
            }).then(response => {
                if(response.ok) {
                    dispatch(setNotification({ message: "item added successfully!", type: "success", duration: 2000 }));
                }
                dispatch(reload('success'));
            });

        } catch (error) {
            console.error('Error uploading item:', error);
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
                {categories.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                        {categories.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => updateFormData('category',categories_map[item])}>
                                <Text style={styles.suggestionText}>{item}</Text>
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
                            <Text style={styles.suggestionText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            <View style={styles.selectedTagsContainer}>
                {formData.tags?.map((tag, index) => (
                    <View key={index} style={styles.tagItem}>
                        <Text style={styles.tagText}>{tag}</Text>
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