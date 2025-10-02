import { useState } from 'react';
import { PlanterCutlist } from './components/PlanterCutlist';
import { ConfigForm } from './components/ConfigForm';
import { usePlanterConfig } from './hooks/usePlanterConfig';
import { defaultConfig } from './config';
import type { PlanterConfig } from './types';

export default function App() {
  const [baseConfig, setBaseConfig] = useState<PlanterConfig>(defaultConfig);

  const planterConfig = usePlanterConfig(baseConfig);

  return (
    <>
      <ConfigForm config={planterConfig} onConfigChange={setBaseConfig} />
      <PlanterCutlist config={planterConfig} />
    </>
  );
}
