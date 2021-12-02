import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Projects: undefined;
  Calculator: undefined;
  Appliances: undefined;
  NewAppliance: {
    new: boolean;
    appliance?: Appliance;
    season?: "anl" | "win" | "sum";
  };
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type Appliance = {
  title: string;
  w: number;
  qty: number;
  hr: number;
  day: number;
  pwrFactor?: number;
  surgeFactor?: number;
  pwrType?: "ac" | "dc";
};

export type MoValues = {
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
};
