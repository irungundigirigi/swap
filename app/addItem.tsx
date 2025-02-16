import { Link, Stack } from 'expo-router';
import { TextInput , View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as ImagePicker from 'expo-image-picker';

export default function addItem() {

    const colorscheme = useColorScheme();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [category, setCategory] = useState('');

     // Function to request permission and pick an image
     const pickImage = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
          alert('Permission to access gallery is required!');
          return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true, // Allows picking multiple images
          aspect: [4, 3],
          quality: 1,
      });

      if (!result.canceled) {
          setImages([...images, ...result.assets.map(asset => asset.uri)]);
      }
  };

  return (
    <View style={styles.container}>
      <TextInput
          placeholder="Title"
          placeholderTextColor={colorscheme === 'light' ? 'grey' : 'gray'}
          style={colorscheme == 'light'? styles.inputField : styles.inputFieldDark}
          keyboardType="email-address"
          value={title}
          onChangeText={setTitle}
        />
       <TextInput
          placeholder="Description"
          placeholderTextColor={colorscheme === 'light' ? 'grey' : 'gray'}
          style={colorscheme == 'light'? styles.inputField : styles.inputFieldDark}
          keyboardType="email-address"
          value={description}
          onChangeText={setDescription}
      
        />


        <TouchableOpacity style={styles.button} onPress={pickImage}>
           <Text style={styles.buttonText}>Add Images</Text>
       </TouchableOpacity>

        {/* Display Selected Images */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
           {images.map((imgUri, index) => (
               <Image key={index} source={{ uri: imgUri }} style={styles.image} />
           ))}
       </ScrollView>

       {/* Category Selector */}
       <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
                {/* <Picker
                    selectedValue={category}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Category" value="" />
                    <Picker.Item label="Electronics" value="electronics" />
                    <Picker.Item label="Furniture" value="furniture" />
                    <Picker.Item label="Clothing" value="clothing" />
                    <Picker.Item label="Books" value="books" />
                    <Picker.Item label="Sports Equipment" value="sports" />
                </Picker> */}
            </View>

       

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#00171f',
        flex: 1,
        padding: 32
    },
    inputField: {
        fontFamily:'OutfitRegular',
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
        fontFamily:'OutfitRegular',
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
        padding: 7,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
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
    }
    ,
    label: {
        alignSelf: 'flex-start',
        fontSize: 14,
        color: '#78c6a3',
        fontFamily: 'OutfitRegular',
        marginBottom: 5,
    },
    pickerContainer: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 2,
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: 'white',
    },
    picker: {
        height: 50,
        fontSize: 15,
    },
 
});
