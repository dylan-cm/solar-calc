import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Image } from "react-native";

import NotFoundScreen from "../screens/NotFoundScreen";
import ProjectListScreen from "../screens/ProjectListScreen";
import CalculatorScreen from "../screens/CalculatorScreen";
import NewApplianceScreen from "../screens/NewApplianceScreen";
import { RootStackParamList } from "../types/types";
import LinkingConfiguration from "./LinkingConfiguration";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName={"Calculator"}>
      <Stack.Screen
        name="Projects"
        component={ProjectListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{ title: "Solar Calculator", headerShown: false }}
      />
      <Stack.Screen
        name="NewAppliance"
        component={NewApplianceScreen}
        options={({ route }) => ({
          title: route.params.new ? "New Appliance" : "Edit Appliance",
          headerBackTitle: "Cancel",
          headerBackTitleVisible: true,
        })}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}
