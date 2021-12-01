import React from "react";
import {
  ButtonProps,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
} from "react-native";

interface StyledButtonProps extends ButtonProps {
  onPressIn?: () => any;
  danger?: boolean;
  disabled?: boolean;
  styleText?: {};
  styleButton?: {};
}

export function StyledButton({
  onPress,
  title,
  danger,
  disabled,
  styleText,
  onPressIn,
  ...props
}: StyledButtonProps) {
  return (
    <Pressable
      onPress={(e) => {
        if (!disabled && onPress) onPress(e);
      }}
      style={({ pressed }) => [
        styles.btn,
        pressed && !disabled && !!onPress
          ? danger
            ? styles.dangerPressed
            : styles.pressed
          : {},
        props.styleButton,
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
