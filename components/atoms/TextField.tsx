import React, { useRef, useState } from "react";
import {
  Text,
  Animated,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableHighlight,
  Keyboard,
  View,
} from "react-native";

interface AutoTextInputProps extends TextInputProps {
  suggestions?: string[];
  unit?: string;
}

const AutoTextInput = ({ ...props }: AutoTextInputProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const [item, setItem] = useState<string | undefined>();

  const updateSuggestions = (value: string) => {
    if (!props.suggestions) return;
    let newSuggestions: string[] = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      newSuggestions = props.suggestions.filter((v) => regex.test(v));
    }

    setSuggestions(newSuggestions);
  };

  /* #region Animations */
  const fadeAnim = {
    elevation: useRef(new Animated.Value(1)).current,
    height: useRef(new Animated.Value(1)).current,
    shadowOpacity: useRef(new Animated.Value(0.18)).current,
    shadowRadius: useRef(new Animated.Value(1)).current,
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim.elevation, {
      toValue: 20,
      duration: 150,
      useNativeDriver: false,
    }).start();
    Animated.timing(fadeAnim.height, {
      toValue: 10,
      duration: 150,
      useNativeDriver: false,
    }).start();
    Animated.timing(fadeAnim.shadowOpacity, {
      toValue: 0.51,
      duration: 150,
      useNativeDriver: false,
    }).start();
    Animated.timing(fadeAnim.shadowRadius, {
      toValue: 13.16,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim.elevation, {
      toValue: 1,
      duration: 75,
      useNativeDriver: false,
    }).start();
    Animated.timing(fadeAnim.height, {
      toValue: 1,
      duration: 75,
      useNativeDriver: false,
    }).start();
    Animated.timing(fadeAnim.shadowOpacity, {
      toValue: 0.18,
      duration: 75,
      useNativeDriver: false,
    }).start();
    Animated.timing(fadeAnim.shadowRadius, {
      toValue: 1,
      duration: 75,
      useNativeDriver: false,
    }).start();
  };

  const animViewStyle = {
    shadowOffset: {
      width: 0,
      height: fadeAnim.height,
    },
    shadowOpacity: fadeAnim.shadowOpacity,
    shadowRadius: fadeAnim.shadowRadius,
    elevation: fadeAnim.elevation,
  };
  /* #endregion */

  return (
    <Animated.View style={[animViewStyle, props.style, styles.container]}>
      <TextInput
        {...props}
        onChangeText={(value) => {
          props.onChangeText?.(value);
          updateSuggestions(value);
          setItem(undefined);
        }}
        onBlur={(event) => {
          fadeOut();
          props.onBlur?.(event);
          setFocused(false);
        }}
        onFocus={(event) => {
          fadeIn();
          props.onFocus?.(event);
          setFocused(true);
        }}
        style={[styles.inputBox, { paddingRight: props.unit ? 48 : 16 }]}
        value={item || props.value}
        blurOnSubmit
      />
      {!!props.unit && (
        <View style={styles.unitWrapper}>
          <Text style={styles.unit}>{props.unit}</Text>
        </View>
      )}
      {focused &&
        suggestions.map((s, i) => (
          <TouchableHighlight
            key={s + i + "btn"}
            onPress={(_) => {
              Keyboard.dismiss();
              setItem(s);
              updateSuggestions(s);
            }}
            underlayColor={"#f3f9fb"}
          >
            <Text key={s + i} style={styles.suggestion}>
              {s}
            </Text>
          </TouchableHighlight>
        ))}
    </Animated.View>
  );
};

export default AutoTextInput;

const styles = StyleSheet.create({
  inputBox: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  container: {
    shadowColor: "#000",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 4,
  },
  suggestion: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopColor: "#eee",
    borderTopWidth: 1,
  },
  unit: {
    color: "#7E9195",
  },
  unitWrapper: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
});
