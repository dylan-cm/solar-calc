/* #region  Imports */
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Animated,
  FlatList,
  ImageSourcePropType,
} from "react-native";
import { StyledButton } from "../components/atoms/StyledButton";

import { Text, View } from "../components/Themed";
import { Appliance, RootStackParamList } from "../types/types";

import {
  calcAvgDailyEnrg,
  calcSeasonalAvgDailyEnrg,
  sumEnrg,
  sumPower,
  formatPwr,
  formatEnrg,
} from "../constants/solarBusinessLogic";
import FluidPaginator from "../components/atoms/FluidPaginator";
import TwoRowSlide from "../components/atoms/TwoRowSlide";

const iconPanel: ImageSourcePropType = require("../assets/images/icons8-solar-panel-100.png");
const iconBatt: ImageSourcePropType = require("../assets/images/icons8-batteries-100.png");
const iconAppl: ImageSourcePropType = require("../assets/images/icons8-appliances-100.png");
const iconParallel: ImageSourcePropType = require("../assets/images/icons8-parallel-workflow-100.png");
const iconInverterSize: ImageSourcePropType = require("../assets/images/icons8-electrical-100.png");
const iconInverterSurge: ImageSourcePropType = require("../assets/images/icons8-lightning-bolt-100.png");
/* #endregion */

export default function CalculatorScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Calculator">) {
  /* #region  Mock data */
  const testAppliancesAC: Appliance[] = [
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
  const testAppliancesDC: Appliance[] = [
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
  const testAppliancesACWinter: Appliance[] = [
    {
      title: "Heater",
      w: 750,
      hr: 10,
      day: 7,
      qty: 1,
    },
  ];
  const testAppliancesACSummer: Appliance[] = [
    {
      title: "Air Conditioning",
      w: 500,
      hr: 10,
      day: 7,
      qty: 1,
    },
  ];
  /* #endregion */

  const [appliancesAC, setAppliancesAC] =
    useState<Appliance[]>(testAppliancesAC);
  const [appliancesDC, setAppliancesDC] =
    useState<Appliance[]>(testAppliancesDC);
  const [appliancesACWinter, setAppliancesACWinter] = useState<Appliance[]>(
    testAppliancesACWinter
  );
  const [appliancesACSummer, setAppliancesACSummer] = useState<Appliance[]>(
    testAppliancesACSummer
  );

  /* #region  Appliance Totals */
  const totalApplAC = {
    unique: appliancesAC.length,
    qty: appliancesAC.map((appl) => appl.qty).reduce((p, c) => p + c),
    pwr: sumPower(appliancesAC),
    avgEnrg: sumEnrg(appliancesAC),
  };
  const totalApplDC = {
    unique: appliancesDC.length,
    qty: appliancesDC.map((appl) => appl.qty).reduce((p, c) => p + c),
    pwr: sumPower(appliancesDC),
    avgEnrg: sumEnrg(appliancesDC),
  };
  const totalApplACWinter = {
    unique: appliancesACWinter.length,
    qty: appliancesACWinter.map((appl) => appl.qty).reduce((p, c) => p + c),
    pwr: sumPower(appliancesACWinter),
    avgEnrg: sumEnrg(appliancesACWinter),
  };
  const totalApplACSummer = {
    unique: appliancesACSummer.length,
    qty: appliancesACSummer.map((appl) => appl.qty).reduce((p, c) => p + c),
    pwr: sumPower(appliancesACSummer),
    avgEnrg: sumEnrg(appliancesACSummer),
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
    winAvgDaily: calcSeasonalAvgDailyEnrg(
      totalApplDC.avgEnrg,
      totalApplAC.avgEnrg,
      totalApplACWinter.avgEnrg
    ),
    sumAvgDaily: calcSeasonalAvgDailyEnrg(
      totalApplDC.avgEnrg,
      totalApplAC.avgEnrg,
      totalApplACSummer.avgEnrg
    ),
    anlAvgDaily: 0,
    largestAvgDaily: 0,
    qty:
      totalApplAC.qty +
      totalApplACSummer.qty +
      totalApplACWinter.qty +
      totalApplDC.qty,
  };
  totals.anlAvgDaily = (totals.winAvgDaily + totals.sumAvgDaily) / 2;
  totals.largestAvgDaily = Math.max(
    totals.anlAvgDaily,
    totals.winAvgDaily,
    totals.sumAvgDaily
  );
  /* #endregion */

  /* #region  Display Pagination */
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 10 }).current;
  const displaySlides = [
    {
      topRow: [
        {
          image: iconAppl,
          text: [
            `${totals.qty} Appliances`,
            `${Math.round(totals.largestAvgDaily)} Ah/day`,
            `${formatEnrg(25000)}/day`,
          ],
        },
      ],
      bottomRow: [
        {
          image: iconBatt,
          text: [`${0} Batteries`, `${formatEnrg(25000)}`],
        },
        {
          image: iconPanel,
          text: [`${6} Panels`, `${formatPwr(1500)}`],
        },
      ],
    },
    {
      topRow: [
        {
          image: iconParallel,
          text: [`Parallel Strings: ${2} - ${3}`],
        },
      ],
      bottomRow: [
        {
          image: iconInverterSize,
          text: [`Inverter Size: ${2367}`],
        },
        {
          image: iconInverterSurge,
          text: [`Inverter Surge: ${4467}`],
        },
      ],
    },
  ];
  /* #endregion */

  return (
    <View style={styles.container}>
      <ScrollView style={styles.list} stickyHeaderIndices={[1, 3, 5, 7]}>
        <View style={styles.displayContainer}>
          <FlatList
            data={displaySlides}
            horizontal
            renderItem={({ item }) => (
              <TwoRowSlide topRow={item.topRow} bottomRow={item.bottomRow} />
            )}
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => `${i}flatListSlide`}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            onViewableItemsChanged={viewableItemsChanged}
            scrollEventThrottle={32}
            viewabilityConfig={viewConfig}
            ref={slidesRef}
          />
          <FluidPaginator slides={displaySlides} scrollX={scrollX} />
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
            onPress={() => navigation.navigate("NewAppliance", { new: true })}
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
                navigation.navigate("NewAppliance", {
                  appliance: appl,
                  new: false,
                })
              }
            >
              <View style={styles.row} key={`applTopRow${i}`}>
                <Text style={styles.topText} key={`applTitle${i}`}>
                  {appl.title}
                </Text>
                <Text style={styles.topText} key={`applAvgPwr${i}`}>
                  {formatEnrg(calcAvgDailyEnrg(appl))}
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
            onPress={() => navigation.navigate("NewAppliance", { new: true })}
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
                navigation.navigate("NewAppliance", {
                  appliance: appl,
                  new: false,
                })
              }
            >
              <View style={styles.row} key={`applTopRow${i}`}>
                <Text style={styles.topText} key={`applTitle${i}`}>
                  {appl.title}
                </Text>
                <Text style={styles.topText} key={`applAvgPwr${i}`}>
                  {formatEnrg(calcAvgDailyEnrg(appl))}
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
            onPress={() => navigation.navigate("NewAppliance", { new: true })}
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
                navigation.navigate("NewAppliance", {
                  appliance: appl,
                  new: false,
                })
              }
            >
              <View style={styles.row} key={`applTopRow${i}`}>
                <Text style={styles.topText} key={`applTitle${i}`}>
                  {appl.title}
                </Text>
                <Text style={styles.topText} key={`applAvgPwr${i}`}>
                  {formatEnrg(calcAvgDailyEnrg(appl))}
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
            onPress={() => navigation.navigate("NewAppliance", { new: true })}
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
                navigation.navigate("NewAppliance", {
                  appliance: appl,
                  new: false,
                })
              }
            >
              <View style={styles.row} key={`applTopRow${i}`}>
                <Text style={styles.topText} key={`applTitle${i}`}>
                  {appl.title}
                </Text>
                <Text style={styles.topText} key={`applAvgPwr${i}`}>
                  {formatEnrg(calcAvgDailyEnrg(appl))}
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
  displayContainer: {
    backgroundColor: "#f7fdff",
    alignItems: "center",
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
