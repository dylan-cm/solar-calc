import React from "react";
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

interface StyledButtonProps {
  onPress?: () => any;
  onPressIn?: () => any;
  title?: string;
  danger?: boolean;
  disabled?: boolean;
  styleText?: {};
}

export function StyledButton({
  onPress,
  title,
  danger,
  disabled,
  styleText,
  onPressIn,
}: StyledButtonProps) {
  return (
    <Pressable
      onPress={() => {
        if (!disabled && onPress) onPress();
      }}
      style={({ pressed }) => [
        styles.btn,
        pressed && !disabled && !!onPress
          ? danger
            ? styles.dangerPressed
            : styles.pressed
          : {},
      ]}
      onPressIn={() => {
        if (!disabled && onPressIn) onPressIn();
      }}
    >
      <Text
        style={[
          styles.btnText,
          danger ? styles.dangerText : {},
          disabled || !onPress ? styles.disabledText : {},
          styleText,
        ]}
      >
        {title || "Press Me!"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btnText: {
    color: "#0077ff",
    textAlign: "center",
  },
  btn: {
    paddingVertical: 16,
    paddingHorizontal: 36,
    alignSelf: "center",
    borderRadius: 4,
  },
  pressed: {
    backgroundColor: "#f7fdff",
  },
  dangerText: {
    color: "#d4130d",
  },
  dangerPressed: {
    backgroundColor: "#fff7f7",
  },
  disabledText: {
    color: "#aaa",
  },
});
