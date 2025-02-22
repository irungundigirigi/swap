import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const CustomLoader = () => {
  const rotateValue = useRef(new Animated.Value(0)).current; // Initial value for rotation: 0

  useEffect(() => {
    startRotation();
  }, []);

  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1, // Rotate to 360 degrees (1 = full rotation)
        duration: 1000, // Duration of one rotation
        easing: Easing.linear, // Linear easing for smooth rotation
        useNativeDriver: true, // Use native driver for better performance
      })
    ).start();
  };

  // Interpolate the rotation value
  const rotateInterpolation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], // Rotate from 0 to 360 degrees
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.loader,
          { transform: [{ rotate: rotateInterpolation }] }, // Apply rotation
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 5,
    borderColor: '#ccc',
    borderTopColor: '#007BFF', // Highlight the top border for a spinner effect
  },
});

export default CustomLoader;