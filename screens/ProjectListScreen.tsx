import { useNavigation } from "@react-navigation/core";
import * as React from "react";
import { Button, StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";

export default function ProjectListScreen() {
  const navigation = useNavigation<any>();
  const navigateToProject = () => navigation.navigate("Calculator");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Projects</Text>
      <Button onPress={navigateToProject} title="Calculator" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
