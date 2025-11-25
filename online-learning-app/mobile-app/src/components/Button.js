import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

const Button = ({
  title,
  onPress,
  loading,
  disabled,
  variant = "primary",
  style,
  textStyle,
}) => {
  const buttonStyle =
    variant === "secondary" ? styles.secondaryButton : styles.primaryButton;
  const buttonTextStyle =
    variant === "secondary"
      ? styles.secondaryButtonText
      : styles.primaryButtonText;

  return (
    <TouchableOpacity
      style={[buttonStyle, disabled && styles.disabledButton, style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "secondary" ? "#007AFF" : "#FFF"}
        />
      ) : (
        <Text style={[buttonTextStyle, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "#FFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default Button;
