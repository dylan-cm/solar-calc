import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { StyledButton } from "../components/atoms/StyledButton";

import { Text, View } from "../components/Themed";
import { Appliance, RootStackParamList } from "../types";

const formatPwr = (watts: number): string => {
  return watts >= 1000
    ? `${Math.round(watts / 100) / 10} kW`
    : `${Math.round(watts)} W`;
};

const formatEnrg = (watts: number): string => formatPwr(watts) + "h";

const calcAvgEnrg = (appl: Appliance): number =>
  (appl.w * appl.qty * appl.hr * appl.day) / 7;

export default function CalculatorScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Calculator">) {
  const testAppliances = [
    {
      title: "Toaster",
      w: 1200,
      hr: 2,
      day: 5,
      qty: 1,
    },
    {
      title: "LED Bulb",
      w: 5,
      hr: 10,
      day: 7,
      qty: 15,
    },
    {
      title: "Fridge",
      w: 1200,
      hr: 2,
      day: 5,
      qty: 1,
    },
    {
      title: "Laptop",
      w: 5,
      hr: 10,
      day: 7,
      qty: 15,
    },
    {
      title: "HVAC",
      w: 1200,
      hr: 2,
      day: 5,
      qty: 1,
    },
    {
      title: "Lamp",
      w: 5,
      hr: 10,
      day: 7,
      qty: 15,
    },
    {
      title: "Gizmo",
      w: 1200,
      hr: 2,
      day: 5,
      qty: 1,
    },
    {
      title: "Door Bell",
      w: 5,
      hr: 10,
      day: 7,
      qty: 15,
    },
    {
      title: "Smart Toilet",
      w: 1200,
      hr: 2,
      day: 5,
      qty: 1,
    },
    {
      title: "Widget",
      w: 5,
      hr: 10,
      day: 7,
      qty: 15,
    },
  ];
  const [appliances, setAppliances] = useState(testAppliances);
  let totalAppl = {
    unique: appliances.length,
    qty: appliances.map((appl) => appl.qty).reduce((p, c) => p + c),
    pwr: appliances.map((appl) => appl.w * appl.qty).reduce((p, c) => p + c),
    avgEnrg: appliances
      .map((appl) => calcAvgEnrg(appl))
      .reduce((p, c) => p + c),
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.list} stickyHeaderIndices={[0]}>
        <View style={[styles.listItem, styles.listHead]}>
          <View style={styles.row}>
            <Text style={styles.subHeader}>Appliances</Text>
            <Text style={styles.topText}>{formatEnrg(totalAppl.avgEnrg)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bottomText}>{`${totalAppl.qty} items`}</Text>
            <Text style={styles.bottomText}>{formatPwr(totalAppl.pwr)}</Text>
          </View>
          <StyledButton
            onPress={() => navigation.navigate("NewAppliance", {})}
            title="Add Appliance"
          />
        </View>
        {appliances.map((appl, i) => (
          <Pressable
            style={({ pressed }) => [
              styles.listItem,
              pressed ? styles.pressed : {},
            ]}
            key={`appl${i}`}
            onPress={() =>
              navigation.navigate("NewAppliance", { appliance: appl })
            }
          >
            <View style={styles.row} key={`applTopRow${i}`}>
              <Text style={styles.topText} key={`applTitle${i}`}>
                {appl.title}
              </Text>
              <Text style={styles.topText} key={`applAvgPwr${i}`}>
                {formatEnrg(calcAvgEnrg(appl))}
              </Text>
            </View>

            <View style={styles.row} key={`applBtmRow${i}`}>
              <Text style={styles.bottomText} key={`applStats${i}`}>
                {`${formatPwr(appl.w)}, x ${appl.qty}, ${appl.hr} hr, ${
                  appl.day
                } d/wk`}
              </Text>
              <Text style={styles.bottomText} key={`applLoad${i}`}>
                {formatPwr(appl.w * appl.qty)}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  addApplianceButton: {
    backgroundColor: "transparent",
  },
  list: {
    width: "100%",
  },
  listItem: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    padding: 16,
    borderColor: "#eee",
    borderBottomWidth: 1,
  },
  listHead: {
    backgroundColor: "#fff",
    paddingBottom: 4,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  topText: {
    color: "#000",
  },
  bottomText: {
    color: "#999",
  },
  subHeader: {
    fontSize: 18,
  },
  pressed: {
    backgroundColor: "#f7fdff",
  },
});
