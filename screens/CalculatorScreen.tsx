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
  const testAppliancesAC = [
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
  const testAppliancesDC = [
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
  const testAppliancesACWinter = [
    {
      title: "Heater",
      w: 750,
      hr: 10,
      day: 7,
      qty: 1,
    },
  ];
  const testAppliancesACSummer = [
    {
      title: "Air Conditioning",
      w: 500,
      hr: 10,
      day: 7,
      qty: 1,
    },
  ];
  const [appliancesAC, setAppliancesAC] = useState(testAppliancesAC);
  const [appliancesDC, setAppliancesDC] = useState(testAppliancesDC);
  const [appliancesACWinter, setAppliancesACWinter] = useState(
    testAppliancesACWinter
  );
  const [appliancesACSummer, setAppliancesACSummer] = useState(
    testAppliancesACSummer
  );
  const [inverterEfficiency, setInverterEfficiency] = useState(0.92);

  const totalApplAC = {
    unique: appliancesAC.length,
    qty: appliancesAC.map((appl) => appl.qty).reduce((p, c) => p + c),
    pwr: appliancesAC.map((appl) => appl.w * appl.qty).reduce((p, c) => p + c),
    avgEnrg: appliancesAC
      .map((appl) => calcAvgEnrg(appl))
      .reduce((p, c) => p + c),
  };
  const totalApplDC = {
    unique: appliancesDC.length,
    qty: appliancesDC.map((appl) => appl.qty).reduce((p, c) => p + c),
    pwr: appliancesDC.map((appl) => appl.w * appl.qty).reduce((p, c) => p + c),
    avgEnrg: appliancesDC
      .map((appl) => calcAvgEnrg(appl))
      .reduce((p, c) => p + c),
  };
  const totalApplACWinter = {
    unique: appliancesACWinter.length,
    qty: appliancesACWinter.map((appl) => appl.qty).reduce((p, c) => p + c),
    pwr: appliancesACWinter
      .map((appl) => appl.w * appl.qty)
      .reduce((p, c) => p + c),
    avgEnrg: appliancesACWinter
      .map((appl) => calcAvgEnrg(appl))
      .reduce((p, c) => p + c),
  };
  const totalApplACSummer = {
    unique: appliancesACSummer.length,
    qty: appliancesACSummer.map((appl) => appl.qty).reduce((p, c) => p + c),
    pwr: appliancesACSummer
      .map((appl) => appl.w * appl.qty)
      .reduce((p, c) => p + c),
    avgEnrg: appliancesACSummer
      .map((appl) => calcAvgEnrg(appl))
      .reduce((p, c) => p + c),
  };
  let totals = {
    anlBasePwr: totalApplAC.pwr,
    anlBaseEnrg: totalApplAC.avgEnrg,
    anlBasePwrDC: totalApplDC.pwr,
    anlBaseEnrgDC: totalApplDC.avgEnrg,
    winBasePwr: totalApplACWinter.pwr,
    winBaseEnrg: totalApplACWinter.avgEnrg,
    sumBasePwr: totalApplACSummer.pwr,
    sumBaseEnrg: totalApplACSummer.avgEnrg,
    winAvgDaily:
      totalApplDC.avgEnrg +
      (totalApplAC.avgEnrg + totalApplACWinter.avgEnrg) / inverterEfficiency,
    sumAvgDaily:
      totalApplDC.avgEnrg +
      (totalApplAC.avgEnrg + totalApplACSummer.avgEnrg) / inverterEfficiency,
    anlAvgDaily: 0,
    largestAvgDaily: 0,
  };
  totals.anlAvgDaily = (totals.winAvgDaily + totals.sumAvgDaily) / 2;
  totals.largestAvgDaily = Math.max(
    totals.anlAvgDaily,
    totals.winAvgDaily,
    totals.sumAvgDaily
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.list} stickyHeaderIndices={[1, 3, 5, 7]}>
        <View style={styles.display}>
          <Text>AC Loads Estimate</Text>
          <Text>{`Total Operating Watts: ${formatPwr(
            totals.anlBasePwr
          )}`}</Text>
          <Text>{`Average Daily Energy: ${formatEnrg(
            totals.anlBaseEnrg
          )}`}</Text>
          <Text>DC Loads Estimate</Text>
          <Text>{`Total Operating Watts: ${formatPwr(
            totals.anlBasePwrDC
          )}`}</Text>
          <Text>{`Average Daily Energy: ${formatEnrg(
            totals.anlBaseEnrgDC
          )}`}</Text>
          <Text>Additional Winter AC</Text>
          <Text>{`Total Operating Watts: ${formatPwr(
            totals.winBasePwr
          )}`}</Text>
          <Text>{`Average Daily Energy: ${formatEnrg(
            totals.winBaseEnrg
          )}`}</Text>
          <Text>Additional Summer AC</Text>
          <Text>{`Total Operating Watts: ${formatPwr(
            totals.sumBasePwr
          )}`}</Text>
          <Text>{`Average Daily Energy: ${formatEnrg(
            totals.sumBaseEnrg
          )}`}</Text>
          <Text>{`Winter Average Daily Energy: ${formatEnrg(
            totals.winAvgDaily
          )}`}</Text>
          <Text>{`Summer Average Daily Energy: ${formatEnrg(
            totals.sumAvgDaily
          )}`}</Text>
          <Text>{`Average Daily Load (Ah / day): ${formatEnrg(
            totals.anlAvgDaily
          )}`}</Text>
          <Text>{`Largest Seasonal Daily Load (Ah / day): ${formatEnrg(
            totals.largestAvgDaily
          )}`}</Text>
        </View>
        <View style={[styles.listItem, styles.listHead]}>
          <View style={styles.row}>
            <Text style={styles.subHeader}>AC Appliances</Text>
            <Text style={styles.topText}>
              {formatEnrg(totalApplAC.avgEnrg)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bottomText}>{`${totalApplAC.qty} items`}</Text>
            <Text style={styles.bottomText}>{formatPwr(totalApplAC.pwr)}</Text>
          </View>
          <StyledButton
            onPress={() => navigation.navigate("NewAppliance", {})}
            title="Add Appliance"
          />
        </View>
        <View>
          {appliancesAC.map((appl, i) => (
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
        </View>
        <View style={[styles.listItem, styles.listHead]}>
          <View style={styles.row}>
            <Text style={styles.subHeader}>DC Appliances</Text>
            <Text style={styles.topText}>
              {formatEnrg(totalApplDC.avgEnrg)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bottomText}>{`${totalApplDC.qty} items`}</Text>
            <Text style={styles.bottomText}>{formatPwr(totalApplDC.pwr)}</Text>
          </View>
          <StyledButton
            onPress={() => navigation.navigate("NewAppliance", {})}
            title="Add Appliance"
          />
        </View>
        <View>
          {appliancesDC.map((appl, i) => (
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
        </View>
        <View style={[styles.listItem, styles.listHead]}>
          <View style={styles.row}>
            <Text style={styles.subHeader}>Summer AC Appliances</Text>
            <Text style={styles.topText}>
              {formatEnrg(totalApplACWinter.avgEnrg)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text
              style={styles.bottomText}
            >{`${totalApplACWinter.qty} items`}</Text>
            <Text style={styles.bottomText}>
              {formatPwr(totalApplACWinter.pwr)}
            </Text>
          </View>
          <StyledButton
            onPress={() => navigation.navigate("NewAppliance", {})}
            title="Add Appliance"
          />
        </View>
        <View>
          {appliancesACWinter.map((appl, i) => (
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
        </View>
        <View style={[styles.listItem, styles.listHead]}>
          <View style={styles.row}>
            <Text style={styles.subHeader}>Summer AC Appliances</Text>
            <Text style={styles.topText}>
              {formatEnrg(totalApplACSummer.avgEnrg)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text
              style={styles.bottomText}
            >{`${totalApplACSummer.qty} items`}</Text>
            <Text style={styles.bottomText}>
              {formatPwr(totalApplACSummer.pwr)}
            </Text>
          </View>
          <StyledButton
            onPress={() => navigation.navigate("NewAppliance", {})}
            title="Add Appliance"
          />
        </View>
        <View>
          {appliancesACSummer.map((appl, i) => (
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#fff",
  },
  display: {
    width: "100%",
    padding: 16,
    backgroundColor: "#f7fdff",
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
