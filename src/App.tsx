import { useState } from 'react';
import { PlanterCutlist } from './components/PlanterCutlist';
import { ConfigForm } from './components/ConfigForm';
import { usePlanterConfig } from './hooks/usePlanterConfig';
import { defaultConfig } from './config';
import type { PlanterConfig } from './types';

// Load config from URL params if present
function loadConfigFromUrl(): PlanterConfig | null {
  const params = new URLSearchParams(window.location.search);
  const configParam = params.get('config');

  if (configParam) {
    try {
      const decoded = atob(configParam);
      const parsedConfig = JSON.parse(decoded);
      return { ...defaultConfig, ...parsedConfig };
    } catch (error) {
      console.error('Failed to load config from URL:', error);
    }
  }

  return null;
}

export default function App() {
  const [baseConfig, setBaseConfig] = useState<PlanterConfig>(() => {
    return loadConfigFromUrl() || defaultConfig;
  });
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  const planterConfig = usePlanterConfig(baseConfig);

  const handleConfigSubmit = (newConfig: PlanterConfig) => {
    setBaseConfig(newConfig);
    setHasPendingChanges(false);
  };

  return (
    <>
      <ConfigForm
        config={planterConfig}
        onConfigChange={handleConfigSubmit}
        onPendingChange={setHasPendingChanges}
      />
      <div className="main-content">
        <PlanterCutlist config={planterConfig} hasPendingChanges={hasPendingChanges} />
      </div>
    </>
  );
}
