import React from "react";
import { View, StyleSheet, useWindowDimensions, Animated } from "react-native";

interface FluidPaginatorProps {
  slides: any[];
  scrollX: any;
}

const FluidPaginator = ({ slides, scrollX }: FluidPaginatorProps) => {
  const { width } = useWindowDimensions();

  return (
    <View style={{ flexDirection: "row", margin: 12 }}>
      {slides.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 0.8, 0.3],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            style={[styles.dot, { width: dotWidth, opacity }]}
            key={`${i}dot`}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000",
    marginHorizontal: 8,
  },
});

export default FluidPaginator;
