import * as React from "react";
import { useLayoutEffect, useState } from "react";
import { StyleSheet, View, Text, Platform, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import * as Haptics from "expo-haptics";
import { Appliance, RootStackParamList } from "../types/types";
import { StyledButton } from "../components/atoms/StyledButton";
import applianceWords from "../constants/appliances";

import { db } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion } from "@firebase/firestore";
import TextField from "../components/atoms/TextField";

const ACTION_COLOR = "#39ACFF";

const NewApplianceScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "NewAppliance">) => {
  const newAppl = !route.params.appliance;
  const [appl, setAppl] = useState<Appliance>(
    route?.params?.appliance || { title: "", w: 0, qty: 1, hr: 0, day: 0 }
  );
  const [season, setSeason] = useState(route?.params?.season || "appliances");

  const onSave = () => {
    const savedAppl = {
      id: "appl-id",
      qty: appl.qty,
      hr: appl.hr,
      day: appl.day,
    };
    let updatedArray: any;
    switch (season) {
      case "appliances":
        updatedArray = { appliances: arrayUnion(savedAppl) };
        break;
      case "winterAppliances":
        updatedArray = { winterAppliances: arrayUnion(savedAppl) };
        break;
      case "summerAppliances":
        updatedArray = { summerAppliances: arrayUnion(savedAppl) };
        break;
      default:
        break;
    }
    updateDoc(doc(db, "projects", "project1"), updatedArray).then(() =>
      navigation.goBack()
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <StyledButton onPress={onSave} title="Save" />,
    });
  }, [navigation]);

  const triggerHaptic = () => {
    if (
      (!Platform.isTV && Platform.OS === "android") ||
      Platform.OS === "ios"
    ) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center", padding: 24 }}
      keyboardShouldPersistTaps
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
          onChangeText={(text) => setAppl({ ...appl, w: parseInt(text) || 0 })}
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
            <Picker.Item label="Year-round" value="appliances" />
            <Picker.Item label="Winter" value="winterAppliances" />
            <Picker.Item label="Summer" value="summerAppliances" />
          </Picker>
        </View>
      </View>
      {!newAppl && (
        <View style={styles.buttonsContainer}>
          <StyledButton
            onPress={() => navigation.goBack()}
            title={"Delete"}
            danger
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#fff",
  },
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
    fontSize: 16,
    marginBottom: 10,
    maxWidth: 250,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    paddingBottom: 64,
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
