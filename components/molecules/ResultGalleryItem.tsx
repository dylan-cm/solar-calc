import React from "react";
import {
  ImageSourcePropType,
  Image,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from "react-native";

interface ResultGalleryItemProps extends ViewProps {
  text: string;
  image: ImageSourcePropType;
  height: number;
  width: number;
}

const ResultGalleryItem = ({
  text,
  image,
  height,
  width,
  ...props
}: ResultGalleryItemProps) => {
  return (
    <View style={[styles.layout, props.style]}>
      <Image
        source={image}
        style={styles.backgroundImage}
        height={height}
        width={width}
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default ResultGalleryItem;

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    fontSize: 36,
    color: "white",
  },
  backgroundImage: {
    position: "absolute",
  },
  layout: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
