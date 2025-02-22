import React from "react";
import { Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RoundPressable = ({ iconName, onPress }) => {
  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
    onPress && onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          width: 50,
          height: 50,
          borderRadius: 30,
          backgroundColor: "#007BFF",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 5,
        }}
      >
        <Ionicons name={iconName} size={28} color="white" />
      </Pressable>
    </Animated.View>
  );
};

export default RoundPressable;
