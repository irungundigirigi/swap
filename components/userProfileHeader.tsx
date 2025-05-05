// components/UserProfileHeader.js
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearUser } from '@/redux/slices/userSlice';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function UserProfileHeader() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const [showMenu, setShowMenu] = useState(false);

  const handleLogOut = async () => {
    dispatch(clearUser());
    await AsyncStorage.removeItem('authToken');
    router.navigate('/');
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileContainer} onPress={() => setShowMenu(!showMenu)}>
        <Image
          source={
                { uri: user.profile_pic }
          }
          style={styles.avatar}
        />
        <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
        <Ionicons name={showMenu ? 'chevron-up' : 'chevron-down'} size={16} color="#fff" />
      </TouchableOpacity>

      {showMenu && (
        <Pressable style={styles.dropdown} onPress={handleLogOut}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -0,
    right: 16,
    zIndex: 900000,
    alignItems: 'flex-end',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00171f',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 24,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  name: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'OutfitRegular',
    maxWidth: 100,
  },
  dropdown: {
    marginTop: 4,
    backgroundColor: '#002b36',
    padding: 10,
    borderRadius: 8,
    elevation: 5,
  },
  logoutText: {
    color: '#ff4d4f',

    fontFamily: 'OutfitRegular',
  },
});
