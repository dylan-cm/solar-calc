/* #region  Imports and Constants */
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
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

import { db } from "../firebaseConfig";
import { doc, getDoc } from "@firebase/firestore";
import { useIsFocused } from "@react-navigation/core";

const iconPanel: ImageSourcePropType = require("../assets/images/icons8-solar-panel-100.png");
const iconBatt: ImageSourcePropType = require("../assets/images/icons8-batteries-100.png");
const iconAppl: ImageSourcePropType = require("../assets/images/icons8-appliances-100.png");
const iconParallel: ImageSourcePropType = require("../assets/images/icons8-parallel-workflow-100.png");
const iconInverterSize: ImageSourcePropType = require("../assets/images/icons8-electrical-100.png");
const iconInverterSurge: ImageSourcePropType = require("../assets/images/icons8-lightning-bolt-100.png");
/* #endregion */
interface SectionHeaderProps {
  avgEnrg: number;
  qty: number;
  pwr: number;
  title: string;
  callback: Function;
}
const SectionHeader = ({
  avgEnrg,
  qty,
  pwr,
  title,
  callback,
}: SectionHeaderProps) => (
  <View style={[styles.listItem, styles.listHead]}>
    <View style={styles.row}>
      <Text style={styles.subHeader}>{title}</Text>
      <Text style={styles.topText}>{formatEnrg(avgEnrg)}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.bottomText}>{`${qty} items`}</Text>
      <Text style={styles.bottomText}>{formatPwr(pwr)}</Text>
    </View>
    <StyledButton onPress={() => callback()} title="Add Appliance" />
  </View>
);

interface SectionItemsProps {
  appliances: Appliance[];
  callback: Function;
}
const SectionItems = ({ appliances, callback }: SectionItemsProps) => (
  <View>
    {appliances.map((appl, i) => (
      <Pressable
        style={({ pressed }) => [
          styles.listItem,
          pressed ? styles.pressed : {},
        ]}
        key={`appl${i}`}
        onPress={() => callback(appl)}
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
);

export default function CalculatorScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Calculator">) {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [appliancesWinter, setAppliancesWinter] = useState<Appliance[]>([]);
  const [appliancesSummer, setAppliancesSummer] = useState<Appliance[]>([]);

  const isFocused = useIsFocused();
  useEffect(() => {
    const docRef = doc(db, "projects", "project1");
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        setAppliances(docSnap.data().anlAppls || []);
        setAppliancesSummer(docSnap.data().summerAppls || []);
        setAppliancesWinter(docSnap.data().winterAppls || []);
      }
    });
    return;
  }, [isFocused]);

  /* #region  Appliance Totals */
  const calcTotals = (col: Appliance[]) => {
    const items = col.length;
    return {
      unique: items,
      qty: items > 0 ? col.map((item) => item.qty).reduce((p, c) => p + c) : 0,
      pwr: items > 0 ? sumPower(col) : 0,
      avgEnrg: items > 0 ? sumEnrg(col) : 0,
    };
  };
  const totalAppl = calcTotals(appliances);
  const totalApplWinter = calcTotals(appliancesWinter);
  const totalApplSummer = calcTotals(appliancesSummer);
  let totals = {
    anlBasePwr: totalAppl.pwr,
    anlBaseEnrg: totalAppl.avgEnrg,
    anlBasePwrDC: 0, //todo: support DC
    anlBaseEnrgDC: 0, //todo: support DC
    winBasePwr: totalApplWinter.pwr,
    winBaseEnrg: totalApplWinter.avgEnrg,
    sumBasePwr: totalApplSummer.pwr,
    sumBaseEnrg: totalApplSummer.avgEnrg,
    winAvgDaily: calcSeasonalAvgDailyEnrg(
      totalAppl.avgEnrg,
      totalApplWinter.avgEnrg,
      0 //todo: support DC
    ),
    sumAvgDaily: calcSeasonalAvgDailyEnrg(
      totalAppl.avgEnrg,
      totalApplSummer.avgEnrg,
      0 //todo: support DC
    ),
    anlAvgDaily: 0,
    largestAvgDaily: 0,
    qty: totalAppl.qty + totalApplSummer.qty + totalApplWinter.qty + 0, //todo: support DC
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
      <ScrollView style={styles.list} stickyHeaderIndices={[1, 3, 5]}>
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
        {/* Year-Round */}
        <SectionHeader
          avgEnrg={totalAppl.avgEnrg}
          qty={totalAppl.qty}
          pwr={totalAppl.pwr}
          title={"Year-Round Appliances"}
          callback={() => navigation.navigate("NewAppliance", { new: true })}
        />
        <SectionItems
          appliances={appliances}
          callback={(appl: Appliance) =>
            navigation.navigate("NewAppliance", {
              appliance: appl,
              new: false,
            })
          }
        />
        {/* Winter */}
        <SectionHeader
          avgEnrg={totalApplWinter.avgEnrg}
          qty={totalApplWinter.qty}
          pwr={totalApplWinter.pwr}
          title={"Winter Appliances"}
          callback={() =>
            navigation.navigate("NewAppliance", { new: true, season: "win" })
          }
        />
        <SectionItems
          appliances={appliancesWinter}
          callback={(appl: Appliance) =>
            navigation.navigate("NewAppliance", {
              appliance: appl,
              new: false,
              season: "win",
            })
          }
        />
        {/* Summer */}
        <SectionHeader
          avgEnrg={totalApplSummer.avgEnrg}
          qty={totalApplSummer.qty}
          pwr={totalApplSummer.pwr}
          title={"Summer Appliances"}
          callback={() =>
            navigation.navigate("NewAppliance", { new: true, season: "sum" })
          }
        />
        <SectionItems
          appliances={appliancesSummer}
          callback={(appl: Appliance) =>
            navigation.navigate("NewAppliance", {
              appliance: appl,
              new: false,
              season: "sum",
            })
          }
        />
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
