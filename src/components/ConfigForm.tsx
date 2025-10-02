import { useState } from 'react';
import type { ExpandedConfig, PlanterConfig } from '../types';

interface ConfigFormProps {
  config: ExpandedConfig;
  onConfigChange: (config: PlanterConfig) => void;
}

export function ConfigForm({ config, onConfigChange }: ConfigFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (path: string, value: string) => {
    const newConfig = { ...config };
    const keys = path.split('.');
    let current = newConfig;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    const currentValue = current[lastKey];

    // Convert to appropriate type
    if (typeof currentValue === 'number') {
      current[lastKey] = parseFloat(value) || 0;
    } else if (typeof currentValue === 'boolean') {
      current[lastKey] = value === 'true';
    } else {
      current[lastKey] = value;
    }

    onConfigChange(newConfig);
  };

  const renderInput = (key, value, path) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div key={path} style={{ marginLeft: '20px', marginBottom: '15px' }}>
          <h4
            style={{
              color: '#b48943',
              marginBottom: '10px',
              textTransform: 'capitalize',
            }}
          >
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </h4>
          {Object.entries(value).map(([k, v]) =>
            renderInput(k, v, `${path}.${k}`)
          )}
        </div>
      );
    }

    const inputId = `input-${path}`;
    const label = key.replace(/([A-Z])/g, ' $1').trim();

    return (
      <div key={path} style={{ marginBottom: '12px' }}>
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            marginBottom: '4px',
            fontSize: '14px',
            color: '#555',
          }}
        >
          {label}:
        </label>
        {typeof value === 'boolean' ? (
          <select
            id={inputId}
            value={value.toString()}
            onChange={(e) => handleChange(path, e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        ) : (
          <input
            id={inputId}
            type={typeof value === 'number' ? 'number' : 'text'}
            value={value}
            step={typeof value === 'number' ? '0.1' : undefined}
            onChange={(e) => handleChange(path, e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: '350px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '12px',
          background: '#b48943',
          color: 'white',
          border: 'none',
          borderRadius: isOpen ? '8px 8px 0 0' : '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>⚙️ Configure Planter Box</span>
        <span>{isOpen ? '▼' : '▶'}</span>
      </button>

      {isOpen && (
        <div
          style={{
            padding: '20px',
            maxHeight: '70vh',
            overflowY: 'auto',
            borderTop: '1px solid #e2c184',
          }}
        >
          {Object.entries(config).map(([key, value]) => {
            // Skip computed/complex values
            if (
              key === 'parts' ||
              key === 'cutPatterns' ||
              key === 'planks' ||
              key === 'legend' ||
              key === 'totalPlanks' ||
              key === 'svg'
            ) {
              return null;
            }
            return renderInput(key, value, key);
          })}
        </div>
      )}
    </div>
  );
}
