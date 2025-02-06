import React, { useState, useEffect } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

const Notification = ({ message, type = "info", duration = 3000, onClose }) => {
  const [fadeAnim] = useState(new Animated.Value(1)); // Start fully visible

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade out
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (onClose) onClose();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [fadeAnim, duration, onClose]);

  return (
    <Animated.View style={[styles.container, styles[type], { opacity: fadeAnim }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: "3%",
    width: "94%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
  success: {
    backgroundColor: "#4CAF50", // Green
  },
  warning: {
    backgroundColor: "#FFC107", // Yellow
  },
  info: {
    backgroundColor: "#2196F3", // Blue
  },
  error: {
    backgroundColor: "#F44336", // Red
  },
});

export default Notification;
