import * as React from "react";
import { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ScrollView,
  SafeAreaView,
  ImageSourcePropType,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import * as Haptics from "expo-haptics";
import { Appliance, RootStackParamList } from "../types/types";
import { StyledButton } from "../components/atoms/StyledButton";
import applianceWords from "../constants/appliances";

import { db } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion, arrayRemove } from "@firebase/firestore";
import TextField from "../components/atoms/TextField";

const ACTION_COLOR = "#39ACFF";
const iconTrash: ImageSourcePropType = require("../assets/images/Navigation_Trash.png");

const NewApplianceScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "NewAppliance">) => {
  const initialAppl = route?.params?.appliance;
  const initialSeason = route?.params?.season;
  const [appl, setAppl] = useState<Appliance>(
    initialAppl || {
      title: "",
      w: 0,
      qty: 1,
      hr: 0,
      day: 0,
    }
  );
  const [season, setSeason] = useState<string>(initialSeason || "anl");

  const onSave = () => {
    //todo: loading indicator
    // let prunedArray: any;
    // if (!route?.params?.new && initialAppl)
    //   switch (initialSeason) {
    //     case "anl":
    //       prunedArray = { anlAppls: arrayRemove(initialAppl) };
    //       break;
    //     case "win":
    //       prunedArray = { winterAppls: arrayRemove(initialAppl) };
    //       break;
    //     case "sum":
    //       prunedArray = { summerAppls: arrayRemove(initialAppl) };
    //       break;
    //     default:
    //       break;
    //   }
    let updatedArray: any;
    switch (season) {
      case "anl":
        updatedArray = { anlAppls: arrayUnion(appl) };
        break;
      case "win":
        updatedArray = { winterAppls: arrayUnion(appl) };
        break;
      case "sum":
        updatedArray = { summerAppls: arrayUnion(appl) };
        break;
      default:
        break;
    }
    // updateDoc(doc(db, "projects", "project1"), prunedArray).then(() => {
    updateDoc(doc(db, "projects", "project1"), updatedArray).then(() =>
      navigation.goBack()
    );
    // });
  };

  const onDelete = () => {
    let prunedArray: any;
    switch (initialSeason) {
      case "anl":
        prunedArray = { anlAppls: arrayRemove(initialAppl) };
        break;
      case "win":
        prunedArray = { winterAppls: arrayRemove(initialAppl) };
        break;
      case "sum":
        prunedArray = { summerAppls: arrayRemove(initialAppl) };
        break;
      default:
        break;
    }
    updateDoc(doc(db, "projects", "project1"), prunedArray).then(() =>
      navigation.goBack()
    );
  };

  const triggerHaptic = () => {
    if (
      (!Platform.isTV && Platform.OS === "android") ||
      Platform.OS === "ios"
    ) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  useLayoutEffect(() => {
    if (!route.params.new)
      navigation.setOptions({
        headerRight: () => (
          <StyledButton
            danger
            onPress={onDelete}
            title="Delete"
            icon={iconTrash}
          />
        ),
      });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroller}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps={"always"}
      >
        <View style={styles.inputContainer}>
          <TextField
            style={styles.nameInput}
            placeholder={"Appliance Name"}
            suggestions={applianceWords}
            onChangeText={(text) => setAppl({ ...appl, title: text })}
            value={appl.title}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>How many watts does it use?</Text>
          <TextField
            style={styles.wattInput}
            onChangeText={(text) =>
              setAppl({ ...appl, w: parseInt(text) || 0 })
            }
            keyboardType={"phone-pad"}
            value={appl.w.toString()}
            unit={"W"}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            How many hours per day do you typically use it?
          </Text>
          <Text style={styles.valueText}>{`${appl.hr} hours`}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={24}
            minimumTrackTintColor={ACTION_COLOR}
            maximumTrackTintColor="#eee"
            thumbTintColor={ACTION_COLOR}
            step={1}
            value={appl.hr}
            onValueChange={(val) => {
              triggerHaptic();
              setAppl({ ...appl, hr: val });
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            How many days per week do you typically use it?
          </Text>
          <Text style={styles.valueText}>{`${appl.day} days`}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={7}
            minimumTrackTintColor={ACTION_COLOR}
            maximumTrackTintColor="#eee"
            thumbTintColor={ACTION_COLOR}
            step={1}
            value={appl.day}
            onValueChange={(val) => {
              triggerHaptic();
              setAppl({ ...appl, day: val });
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>How many do you use?</Text>
          <View style={styles.row}>
            <StyledButton
              title="-"
              onPress={() => setAppl({ ...appl, qty: appl.qty - 1 })}
              disabled={appl.qty <= 1}
              styleText={styles.btnText}
              styleButton={{ paddingVertical: 8 }}
            />
            <Text style={styles.qtyText}>{appl.qty}</Text>
            <StyledButton
              title="+"
              onPress={() => setAppl({ ...appl, qty: appl.qty + 1 })}
              styleText={styles.btnText}
              styleButton={{ paddingVertical: 8 }}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            What season do you typically use this appliance?
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={season}
              onValueChange={(val) => setSeason(val)}
              mode={"dialog"}
              style={styles.picker}
            >
              <Picker.Item label="Year-round" value={"anl"} />
              <Picker.Item label="Winter" value={"win"} />
              <Picker.Item label="Summer" value={"sum"} />
            </Picker>
          </View>
        </View>
      </ScrollView>
      <StyledButton
        onPress={() => onSave()}
        title={route.params.new ? "Add" : "Save"}
        styleButton={styles.button}
        styleText={styles.saveBtnText}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: ACTION_COLOR,
    alignSelf: "stretch",
    margin: 24,
  },
  btnText: {
    fontSize: 16,
  },
  saveBtnText: {
    fontSize: 16,
    color: "white",
  },
  buttonsContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    paddingBottom: 64,
  },
  container: {
    height: "100%",
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  scrollContainer: {
    alignItems: "center",
    padding: 16,
  },
  scroller: {},
  nameInput: {
    alignSelf: "stretch",
  },
  wattInput: {
    minWidth: 96,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  qtyText: {
    textAlign: "center",
    fontSize: 16,
    marginHorizontal: 16,
    color: ACTION_COLOR,
  },
  label: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 10,
    maxWidth: 250,
  },
  picker: {
    backgroundColor: "white",
    width: 200,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  valueText: {
    color: ACTION_COLOR,
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 24,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 275,
    alignItems: "center",
    justifyContent: "flex-start",
    marginVertical: 12,
  },
});

export default NewApplianceScreen;
