import { useNavigation } from "@react-navigation/core";
import React, { useRef } from "react";
import {
  Button,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  calcAvgDailyEnrg,
  formatEnrg,
  formatPwr,
} from "../../constants/solarBusinessLogic";
import { Appliance } from "../../types/types";
import { StyledButton } from "../atoms/StyledButton";
import ResultGalleryItem from "../molecules/ResultGalleryItem";

const topData = [
  {
    result: "result1",
    image: {
      uri: "https://images.unsplash.com/photo-1526045612212-70caf35c14df",
    },
    key: "item1",
  },
  {
    result: "result2",
    image: {
      uri: "https://images.unsplash.com/photo-1526045612212-70caf35c14df",
    },
    key: "item2",
  },
  {
    result: "result3",
    image: {
      uri: "https://images.unsplash.com/photo-1526045612212-70caf35c14df",
    },
    key: "item3",
  },
];
const bottomData = [
  { avgEnrg: 1200, qty: 20, title: "Location", key: "item1" },
  { avgEnrg: 1200, qty: 20, title: "Batteries", key: "item2" },
  { avgEnrg: 1200, qty: 20, title: "Year-Round Appliances", key: "item3" },
  { avgEnrg: 1200, qty: 20, title: "Winter Appliances", key: "item4" },
  { avgEnrg: 1200, qty: 20, title: "Summer Appliances", key: "item5" },
];

const TabbedHeader = () => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const navigation = useNavigation();

  const bottomRef = useRef<FlatList>(null);
  const tabsRef = useRef<FlatList>(null);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      pagingEnabled
      stickyHeaderIndices={[1]}
    >
      <FlatList
        pagingEnabled
        bounces={false}
        horizontal
        renderItem={({ item }) => (
          <ResultGalleryItem
            text={item.result}
            image={item.image}
            style={{ height: windowHeight, width: windowWidth }}
            height={windowHeight}
            width={windowWidth}
          />
        )}
        data={topData}
        showsHorizontalScrollIndicator={false}
      />
      <FlatList
        horizontal
        ref={tabsRef}
        data={bottomData}
        contentContainerStyle={styles.tabs}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              bottomRef.current?.scrollToIndex({
                index,
                animated: true,
              });
              tabsRef.current?.scrollToIndex({ index, animated: true });
            }}
          >
            <View style={styles.tabNavBtn}>
              <Text style={styles.tabNavBtnLabel}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <FlatList
        ref={bottomRef}
        pagingEnabled
        bounces={false}
        horizontal
        onScrollAnimationEnd={()=>{
          bottomRef.current?.
        }}
        renderItem={({ item }) => (
          <ScrollView style={{ height: windowHeight, width: windowWidth }}>
            <SectionHeader
              avgEnrg={item.avgEnrg}
              qty={item.qty}
              title={item.title}
              callback={() =>
                navigation.navigate("NewAppliance", { new: true })
              }
            />
            {/* <SectionItems
              appliances={appliances}
              callback={(appl: Appliance) =>
                navigation.navigate("NewAppliance", {
                  appliance: appl,
                  new: false,
                })
              }
            /> */}
          </ScrollView>
        )}
        data={bottomData}
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
};

export default TabbedHeader;

const styles = StyleSheet.create({
  head: {
    height: 400,
  },
  tabs: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabNavBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 6,
    marginHorizontal: 3,
  },
  tabNavBtnLabel: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  listItem: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    padding: 12,
    borderColor: "#eee",
    borderBottomWidth: 1,
  },
  listHead: {
    backgroundColor: "#F6FDFE",
    width: "100%",
    display: "flex",
    padding: 12,
    paddingRight: 0,
    borderColor: "#eee",
    borderBottomWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
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
    marginBottom: 4,
  },
  pressed: {
    backgroundColor: "#f7fdff",
  },
});

/* #region  Smaller components */
interface SectionHeaderProps {
  avgEnrg: number;
  qty: number;
  title: string;
  callback: Function;
}
const SectionHeader = ({
  avgEnrg,
  qty,
  title,
  callback,
}: SectionHeaderProps) => (
  <View
    style={[
      styles.listHead,
      { flexDirection: "row", justifyContent: "flex-start", width: "100%" },
    ]}
  >
    <View style={{ width: 48 }}></View>
    <View
      style={{
        flexDirection: "column",
        paddingRight: 48,
        alignItems: "flex-start",
        flex: 1,
      }}
    >
      <Text style={styles.subHeader}>{title}</Text>
      <Text style={styles.bottomText}>{`${qty} items \t ${formatEnrg(
        avgEnrg
      )}`}</Text>
    </View>
    <StyledButton onPress={() => callback()} title="Add" />
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
          pressed && styles.pressed,
          {
            flexDirection: "row",
            justifyContent: "flex-start",
            width: "100%",
          },
        ]}
        key={`appl${i}`}
        onPress={() => callback(appl)}
      >
        <View style={{ width: 48 }}></View>
        <View
          style={{
            flexDirection: "column",
            flex: 5,
            paddingRight: 48,
          }}
        >
          <Text>{appl.title}</Text>
          <Text style={styles.bottomText}>{`${appl.qty} items \t ${formatEnrg(
            calcAvgDailyEnrg(appl)
          )} \t ${formatPwr(appl.w)}`}</Text>
        </View>
        <StyledButton disabled title=">" />
      </Pressable>
    ))}
  </View>
);
/* #endregion */
