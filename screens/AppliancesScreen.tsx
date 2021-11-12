import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { Button, StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";

export default function AppliancesScreen() {
  const navigation = useNavigation<any>();
  const navigateToProject = () => navigation.navigate("NewAppliance");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CalculatorScreen</Text>
      <Button onPress={navigateToProject} title="New Appliance" />
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
