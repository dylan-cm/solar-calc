import React from "react";
import {
  ImageSourcePropType,
  StyleSheet,
  Text,
  Image,
  View,
  useWindowDimensions,
} from "react-native";

interface TwoRowSlideProps {
  topRow: {
    image: ImageSourcePropType;
    text: string[];
  }[];
  bottomRow: {
    image: ImageSourcePropType;
    text: string[];
  }[];
}

const TwoRowSlide = ({ topRow, bottomRow }: TwoRowSlideProps) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      <View style={[styles.row, { marginBottom: 16 }]}>
        {topRow.map((item, i) => (
          <View style={styles.rowItem} key={`${i}slideTopItem`}>
            <Image source={item.image} key={`${i}slideTopImage`} />
            {item.text.map((txt, j) => (
              <Text
                style={styles.description}
                key={`${i}-${j}slideBottomItemText`}
              >
                {txt}
              </Text>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.row}>
        {bottomRow.map((item, i) => (
          <View style={styles.rowItem} key={`${i}slideBottomItem`}>
            <Image source={item.image} key={`${i}slideBottomImage`} />
            {item.text.map((txt, j) => (
              <Text
                style={styles.description}
                key={`${i}-${j}slideBottomItemText`}
              >
                {txt}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default TwoRowSlide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
    padding: 0,
  },
  rowItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    textAlign: "center",
  },
  image: {
    justifyContent: "center",
    width: 50,
    aspectRatio: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
