import { Appliance, MoValues } from "../types";

/* #region  Utilities */
export const formatPwr = (watts: number): string => {
  return watts >= 1000
    ? `${Math.round(watts / 100) / 10} kW`
    : `${Math.round(watts)} W`;
};

export const formatEnrg = (watts: number): string => formatPwr(watts) + "h";

export const sumEnrg = (appliances: Appliance[]): number =>
  appliances.map((appl) => appl.w * appl.qty).reduce((p, c) => p + c);

export const sumPower = (appliances: Appliance[]): number =>
  appliances.map((appl) => calcAvgDailyEnrg(appl)).reduce((p, c) => p + c);
/* #endregion */

/* #region  1) Isolated Loads Estimates Sheet */
//** 1a/b) Isolated Loads Estimates */
export const calcAvgDailyEnrg = (appl: Appliance): number =>
  (appl.w * appl.qty * appl.hr * appl.day) / 7;

//** 1c) Isolated Loads Estimates */
export const calcSeasonalAvgDailyEnrg = (
  yrRndDC: number,
  yrRndAC: number,
  seasonalAC: number,
  inverterEffcy?: number
): number =>
  yrRndDC + yrRndAC / seasonalAC / (inverterEffcy || INVERTER_EFFICIENCY);

//** 1d) Average Daily Load - Ah / day */
export const avgLoadAhPerDay = (
  avgDailyEnrg: number,
  dcSystemV?: number
): number => avgDailyEnrg / (dcSystemV || DC_SYSTEM_V);
/* #endregion */

/* #region  2) Battery Bank Sizing Sheet */
//** 2a) Battery Bank Sizing at C/20 rate */
export const totalBattBankReqCapacity = (
  avgLoad: number,
  doa?: number,
  dodLimit?: number,
  battTempMult?: number
): number =>
  avgLoad *
  (doa || DOA) *
  (dodLimit || DOD_LIMIT) *
  (battTempMult || BATT_TEMP_MULT);

//** 2b) Battery Strings in Parallel */
export const BattStringsPara = (
  totalBattBankReqCapacity: number,
  battCapacityPerBatt: number
): number => Math.ceil(totalBattBankReqCapacity / battCapacityPerBatt);

//** 2c) Calculate Total Batteries */
export const totalBatt = (
  battStringsPara: number,
  dcSystemV?: number,
  battV?: number
): number =>
  Math.ceil((battStringsPara * (dcSystemV || DC_SYSTEM_V)) / (battV || BATT_V));
/* #endregion */

/* #region  3) PV Array Sizing Sheer */
//** Inputs */
export const rooftopAdderSTC = (
  stc?: number,
  rooftopTempAdder?: number
): number => (rooftopTempAdder || ROOFTOP_TEMP_ADDER) - (stc || STC);

//** Array Power Loss Factors */
export const arrPwrLossFactor = (
  shading?: number,
  soiling?: number,
  staticLossFactor?: number
): number =>
  (shading || SHADING_FACTOR) *
  (soiling || SOILING_FACTOR) *
  (staticLossFactor || STATIC_LOSS_FACTOR);

//** 3a) Minimum Required Array Size */
export const minReqArrayW = (
  loadWhPerDay: MoValues,
  peakSunHrs: MoValues,
  moWeatherVariability: MoValues,
  battEfficiency: MoValues,
  cntrlrConversionLoss: MoValues,
  avgHighTemp: MoValues,
  avgLowTemp: MoValues,
  moduleTkPmp?: number,
  arrayPwrLoss?: number
): number => {
  const avgHighTempVal = Object.values(avgHighTemp);
  const avgLowTempVal = Object.values(avgLowTemp);

  const pvArrWByMo = avgHighTempVal.map((highVal, i) => {
    const tempLossFactor =
      1 + (moduleTkPmp || MODULE_TK_PMP) * (highVal * avgLowTempVal[i]);
    return (
      Object.values(loadWhPerDay)[i] /
      Object.values(peakSunHrs)[i] /
      Object.values(moWeatherVariability)[i] /
      Object.values(battEfficiency)[i] /
      Object.values(cntrlrConversionLoss)[i] /
      tempLossFactor /
      (arrayPwrLoss || arrPwrLossFactor())
    );
  });

  return Math.max(...pvArrWByMo);
};

//** 3b.1) Minimum Number of PV Panels in Array */
export const minNumPVPanels = (
  minPVWatts: number,
  moduleWattRating?: number
): number => Math.ceil(minPVWatts / (moduleWattRating || MODULE_WATT_RATING));

//** 3b.2) Minimum PV Array Size for Isolated (backed-up/critical) Loads */
export const minPVArrSizeIsolatedWatts = (
  numPVPanels: number,
  moduleWattRating?: number
): number => numPVPanels * (moduleWattRating || MODULE_WATT_RATING);

//**? 3c) PV Array Production Estimate(s) - PVWatts, EPBB, etc. */
//**? 3d) Evaluating the PV Array Size */
/* #endregion */

/* #region  4) Charge Controller + Array Configuration Sheet */
//** 4a)  Charge Controller Max # of Modules in Series */
export const chargeCntrlrMaxModules = (
  minDesignTemp?: number,
  stcTemp?: number,
  moduleTkVoc?: number,
  cntrlrMaxDCInV?: number,
  ratedModuleVoc?: number
): number => {
  const tempDiff = (minDesignTemp || DESIGN_LOW_TEMP) - (stcTemp || STC);
  const tempDiffPercent = (tempDiff * (moduleTkVoc || MODULE_TK_VOC)) / 100;
  const tempDiffPercentFactor = (tempDiffPercent + 100) / 100;
  return Math.floor(
    ((cntrlrMaxDCInV || CNTRLR_MAX_DC_IN_V) /
      (ratedModuleVoc || RATED_MODULE_VOC)) *
      tempDiffPercentFactor
  );
};

//** 4b)  Charge Controller Min. # of Modules in Series */
export const chargeCntrlrMinModules = (
  maxDesignTemp?: number,
  rooftopTempAdder?: number,
  stcTemp?: number,
  moduleTkPmp?: number,
  bulkAbsorbV?: number,
  vDegradationFactor?: number,
  ratedModuleVmp?: number
): number => {
  const tempDiff =
    (maxDesignTemp || DESIGN_HIGH_TEMP) +
    (rooftopTempAdder || ROOFTOP_TEMP_ADDER) -
    (stcTemp || STC);
  const tempDiffPercent = (tempDiff * (moduleTkPmp || MODULE_TK_PMP)) / 100;
  const tempDiffPercentFactor = (tempDiffPercent + 100) / 100;
  return Math.ceil(
    (((bulkAbsorbV || BULK_ABSORB_V) *
      (vDegradationFactor || V_DEGRADATION_FACTOR)) /
      (ratedModuleVmp || RATED_MODULE_VMP)) *
      tempDiffPercentFactor
  );
};

//** 4c) Maximum # of Parallel Strings per Charge Controller */
export const maxNumParallelStringsPerCntrlr = (
  modules: number,
  moduleWattRating?: number,
  maxSTCPwr?: number
): number => {
  const pwrPerString = modules * (moduleWattRating || MODULE_WATT_RATING);
  return Math.floor((maxSTCPwr || MAX_STC_PWR) / pwrPerString);
};

//** 4d)  Required Number of Strings in Parallel (based on above calculations and minimum array size from Step 3 - PV Array Sizing) */
export const reqNumOfParallelStrings = (
  minSTCPwr: number,
  modules: number,
  moduleWattRating?: number
): number => {
  const pwrPerString = modules * (moduleWattRating || MODULE_WATT_RATING);
  return Math.ceil(minSTCPwr / pwrPerString);
};

//**? 4e) Configuration Options */
/* #endregion */

/* #region  5) Inverter Sizing */
//** 5a) Total Operating Watts for Isolated (backed-up/critical) AC loads */
export const totalBackedUpACLoad = (
  yrRndTotalOperatingW: number,
  largestSeasonalLoadW: number
): number => yrRndTotalOperatingW + largestSeasonalLoadW;

//** 5b)  Total Design VA */
export const totalDesignVA = (
  appliances: Appliance[],
  totalBackedUpACLoad: number
): number => {
  const vaPFSum: number = appliances
    .map((appl) => appl.w * (1 - (appl.pwrFactor || 1)))
    .reduce((p, c) => p + c);
  return totalBackedUpACLoad + vaPFSum;
};

//** 5c)  Total Surge VA Required */
export const totalSurgeVA = (
  appliances: Appliance[],
  totalDesignVA: number
): number => {
  const surgeSum: number = appliances
    .map((appl) => appl.w * ((appl.surgeFactor || 1) - 1))
    .reduce((p, c) => p + c);
  return totalDesignVA + surgeSum;
};

//**? 5d) Verify Inverter Capacity Meets Demands of System */
// TODO: ask user for confirmation for compatibility
export const verifyInverterCapacity = (
  totalDesignVA: number,
  totalSurgeVA: number,
  cntrlrPVArrayPwrLimit: number,
  inverterContinuousVARating: number,
  inverter5SecSurgeRating: number
): boolean =>
  totalDesignVA < inverterContinuousVARating &&
  totalSurgeVA <= inverter5SecSurgeRating &&
  cntrlrPVArrayPwrLimit <= inverterContinuousVARating;
/* #endregion */

//? 7) LO2 Q Question 4 Sheet
//? 8) Min. # Modules Sheet

/* #region  Default Constant Values */
// TODO: Advanced configuration
const INVERTER_EFFICIENCY = 0.92;
const DOA = 3;
const DOD_LIMIT = 0.8;
const BATT_TEMP_MULT = 1.1;
const DC_SYSTEM_V = 24; // voltage
const BATT_V = 6; // voltage
const SHADING_FACTOR = 0.95;
const SOILING_FACTOR = 0.95;
const STATIC_LOSS_FACTOR = 0.9;
const ROOFTOP_TEMP_ADDER = 30;
const STC = 25;
const DESIGN_HIGH_TEMP = 31.7; //celsius
const DESIGN_LOW_TEMP = 19; //celsius
const MODULE_TK_PMP = -0.0045;
const MODULE_TK_VOC = -0.0034;
const MODULE_WATT_RATING = 250; // watts
const CNTRLR_MAX_DC_IN_V = 150; // Vdc
const RATED_MODULE_VOC = 37.4;
const BULK_ABSORB_V = 12 * 2.45; // voltage
const V_DEGRADATION_FACTOR = 1.2;
const RATED_MODULE_VMP = 30.1;
const MAX_STC_PWR = 2000;
/* #endregion */
