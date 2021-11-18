import * as React from "react";
import { useLayoutEffect, useState } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import { Appliance, RootStackParamList } from "../types/types";
import { StyledButton } from "../components/atoms/StyledButton";

import { db } from "../firebaseConfig";
import { doc, updateDoc } from "@firebase/firestore";

const NewApplianceScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "NewAppliance">) => {
  const newAppl = !route.params.appliance;
  const [appl, setAppl] = useState<Appliance>(
    route?.params?.appliance || { title: "", w: 0, qty: 1, hr: 0, day: 0 }
  );

  const onSave = () => {
    updateDoc(doc(db, "projects", "project1"), {
      thing: "blah",
    }).then(() => navigation.goBack());
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <StyledButton onPress={onSave} title="Save" />,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => setAppl({ ...appl, title: text })}
        placeholder={"Appliance Name"}
        value={appl.title}
      />
      <View style={styles.wattRow}>
        <TextInput
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
      {!newAppl ? (
        <View style={styles.buttonsContainer}>
          <StyledButton
            onPress={() => navigation.goBack()}
            title={"Delete"}
            danger
          />
        </View>
      ) : (
        <></>
      )}
    </View>
  ); // TODO: delete confirmation modal
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
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 24,
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
});

export default NewApplianceScreen;
