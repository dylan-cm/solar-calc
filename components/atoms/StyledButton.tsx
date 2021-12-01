import React from "react";
import {
  ButtonProps,
  ImageSourcePropType,
  Pressable,
  Image,
  StyleSheet,
  Text,
} from "react-native";

const DANGER_COLOR = "#d4130d";
const ACTION_COLOR = "#39ACFF";

interface StyledButtonProps extends ButtonProps {
  onPressIn?: () => any;
  danger?: boolean;
  disabled?: boolean;
  styleText?: {};
  styleButton?: {};
  icon?: ImageSourcePropType;
  btnColor?: string;
  titleColor?: string;
}

export function StyledButton({
  onPress,
  title,
  danger,
  disabled,
  styleText,
  btnColor,
  titleColor,
  onPressIn,
  icon,
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
        !!btnColor && { backgroundColor: btnColor },
        props.styleButton,
      ]}
      onPressIn={() => {
        if (!disabled && onPressIn) onPressIn();
      }}
    >
      {icon && (
        <Image
          source={icon}
          style={[
            styles.icon,
            danger && { tintColor: DANGER_COLOR },
            !!titleColor && { tintColor: titleColor },
          ]}
        />
      )}
      <Text
        style={[
          styles.btnText,
          danger && styles.dangerText,
          (disabled || !onPress) && styles.disabledText,
          !!titleColor && { color: titleColor },
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
    color: ACTION_COLOR,
    textAlign: "center",
  },
  icon: {
    height: 16,
    width: 16,
    marginRight: 8,
    tintColor: ACTION_COLOR,
    resizeMode: "contain",
  },
  btn: {
    paddingVertical: 16,
    paddingHorizontal: 36,
    alignSelf: "center",
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    backgroundColor: "#f7fdff",
  },
  dangerText: {
    color: DANGER_COLOR,
  },
  dangerPressed: {
    backgroundColor: "#fff7f7",
  },
  disabledText: {
    color: "#aaa",
  },
});
