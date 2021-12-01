import * as React from "react";
import { useLayoutEffect, useState } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
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

  return (
    <View style={styles.container}>
      <TextField
        style={styles.textInput}
        placeholder={"Appliance Name"}
        suggestions={applianceWords}
        onChangeText={(text) => setAppl({ ...appl, title: text })}
        value={appl.title}
      />
      <View style={styles.wattRow}>
        <TextField
          style={[styles.textInput, styles.wattInput]}
          onChangeText={(text) => setAppl({ ...appl, w: parseInt(text) || 0 })}
          keyboardType={"phone-pad"}
          value={appl.w.toString()}
        />
        <Text>W</Text>
      </View>
      <Text style={styles.label}>{appl.hr} hours of usage per day</Text>
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={0}
        maximumValue={24}
        minimumTrackTintColor="#0077ff"
        maximumTrackTintColor="#eee"
        thumbTintColor="#0077ff"
        step={1}
        onValueChange={(val) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setAppl({ ...appl, hr: val });
        }}
        value={appl.hr}
      />
      <Text style={styles.label}>{appl.day} days of usage per week</Text>
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={0}
        maximumValue={7}
        minimumTrackTintColor="#0077ff"
        maximumTrackTintColor="#eee"
        thumbTintColor="#0077ff"
        step={1}
        onValueChange={(val) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setAppl({ ...appl, day: val });
        }}
        value={appl.day}
      />
      <View style={styles.row}>
        <StyledButton
          title="-"
          onPress={() => setAppl({ ...appl, qty: appl.qty - 1 })}
          disabled={appl.qty <= 1}
          styleText={styles.btnText}
        />
        <Text style={styles.qtyText}>Quantity: {appl.qty}</Text>
        <StyledButton
          title="+"
          onPress={() => setAppl({ ...appl, qty: appl.qty + 1 })}
          styleText={styles.btnText}
        />
      </View>
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
      {!newAppl && (
        <View style={styles.buttonsContainer}>
          <StyledButton
            onPress={() => navigation.goBack()}
            title={"Delete"}
            danger
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 24,
    paddingTop: 0,
    backgroundColor: "#fff",
  },
  textInput: {
    alignSelf: "stretch",
  },
  wattInput: {
    marginRight: 16,
    minWidth: 64,
  },
  wattRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 16,
  },
  qtyText: {
    textAlign: "center",
    fontSize: 16,
    marginHorizontal: 16,
  },
  label: {
    textAlign: "center",
    fontSize: 16,
    paddingTop: 8,
    marginTop: 16,
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
  buttons: {
    height: 150,
    display: "flex",
    justifyContent: "space-between",
  },
  picker: {
    backgroundColor: "white",
    width: 200,
    height: 64,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
});

export default NewApplianceScreen;
