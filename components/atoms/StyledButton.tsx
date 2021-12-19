import React from "react";
import {
  ButtonProps,
  ImageSourcePropType,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
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
    <TouchableHighlight
      onPress={(e) => {
        if (!disabled && onPress) onPress(e);
      }}
      underlayColor={
        danger
          ? DANGER_COLOR + "23"
          : !btnColor
          ? ACTION_COLOR + "23"
          : "#004985"
      }
      disabled={disabled}
      onPressIn={() => {
        if (!disabled && onPressIn) onPressIn();
      }}
      style={[
        styles.btn,
        { backgroundColor: btnColor || "transparent" },
        props.styleButton,
        !!btnColor ? styles.shadow : {},
      ]}
    >
      <View style={{ flexDirection: "row" }}>
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
      </View>
    </TouchableHighlight>
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "center",
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
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
