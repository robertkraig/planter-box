import { useState, useEffect } from 'react';
import { PlanterCutlist } from './components/PlanterCutlist';
import { ConfigForm } from './components/ConfigForm';
import { usePlanterConfig } from './hooks/usePlanterConfig';

export default function App() {
  const [baseConfig, setBaseConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load config.json5
    fetch('/config.json5')
      .then(response => response.text())
      .then(async (text) => {
        // Use dynamic import for json5
        const JSON5 = (await import('json5')).default;
        const config = JSON5.parse(text);
        setBaseConfig(config);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading config:', error);
        setLoading(false);
      });
  }, []);

  const planterConfig = usePlanterConfig(baseConfig || {});

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  if (!baseConfig) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Error loading configuration</div>;
  }

  return (
    <>
      <ConfigForm config={planterConfig} onConfigChange={setBaseConfig} />
      <PlanterCutlist config={planterConfig} />
    </>
  );
}
