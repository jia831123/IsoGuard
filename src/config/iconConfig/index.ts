import { ButtonKeys } from '../../enums/ButtonKeys';
import { weatherLayers } from './weatherLayers';
import { disasterPotentialLayers } from './disasterPotentialLayers';
import { isolatedDisasterLayers } from './isolatedDisasterLayers';
import { rainfallAnalysisLayers } from './rainfallAnalysisLayers';
import { trafficLayers } from './trafficLayers';

export const iconConfig = {
  [ButtonKeys.Weather]: weatherLayers,
  [ButtonKeys.DisasterPotential]: disasterPotentialLayers,
  [ButtonKeys.IsolatedDisaster]: isolatedDisasterLayers,
  [ButtonKeys.RainfallAnalysis]: rainfallAnalysisLayers,
  [ButtonKeys.Traffic]: trafficLayers
};