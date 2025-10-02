import JSON5 from 'json5';
import configText from '../config.json5?raw';
import type { PlanterConfig } from './types';

// Parse the config at build time
export const defaultConfig: PlanterConfig = JSON5.parse(configText);
