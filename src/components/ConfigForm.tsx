import { useState } from 'react';
import type { ExpandedConfig, PlanterConfig } from '../types';
import { formatFraction } from '../utils/formatFraction';

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
      const numValue = parseFloat(value);
      // Only update if we have a valid positive number
      if (!isNaN(numValue) && numValue > 0) {
        current[lastKey] = numValue;
        onConfigChange(newConfig);
      }
    } else if (typeof currentValue === 'boolean') {
      current[lastKey] = value === 'true';
      onConfigChange(newConfig);
    } else {
      current[lastKey] = value;
      onConfigChange(newConfig);
    }
  };

  const handleFractionChange = (path: string, whole: string, fraction: string) => {
    const newConfig = { ...config };
    const keys = path.split('.');
    let current = newConfig;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    const wholeNum = parseInt(whole) || 0;
    const fracNum = parseFloat(fraction) || 0;
    const total = wholeNum + fracNum;

    if (total > 0) {
      current[lastKey] = total;
      onConfigChange(newConfig);
    }
  };

  const renderInput = (key, value, path) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div key={path} className="config-form-section">
          <h4 className="config-form-section-title">
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
      <div key={path} className="config-form-field">
        <label htmlFor={inputId} className="config-form-label">
          {label}:{' '}
          {typeof value === 'number' && (
            <span className="config-form-label-value">
              ({<span dangerouslySetInnerHTML={{__html: formatFraction(value)}}></span>})
            </span>
          )}
        </label>
        {typeof value === 'boolean' ? (
          <select
            id={inputId}
            value={value.toString()}
            onChange={(e) => handleChange(path, e.target.value)}
            className="config-form-select"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
         ) : typeof value === 'number' ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              id={inputId}
              type="number"
              value={Math.floor(value)}
              min="0"
              onChange={(e) => {
                const whole = e.target.value;
                const fraction = (value - Math.floor(value)).toFixed(3);
                handleFractionChange(path, whole, fraction);
              }}
              style={{
                width: '60%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px',
              }}
            />
            <span style={{ fontSize: '14px', color: '#555' }}>"</span>
            <input
              type="number"
              value={((value - Math.floor(value)) * 1).toFixed(3).replace(/\.?0+$/, '')}
              min="0"
              max="0.99"
              step="0.125"
              onChange={(e) => {
                const whole = Math.floor(value).toString();
                const fraction = e.target.value;
                handleFractionChange(path, whole, fraction);
              }}
              style={{
                width: '35%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px',
              }}
            />
          </div>
        ) : (
          <input
            id={inputId}
            type="text"
            value={value}
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
    <div className="config-form-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`config-form-toggle ${isOpen ? 'open' : 'closed'}`}
      >
        <span>⚙️ Configure Planter Box</span>
        <span>{isOpen ? '▼' : '▶'}</span>
      </button>

      {isOpen && (
        <div className="config-form-content">
          {Object.entries(config).map(([key, value]) => {
            // Skip computed/complex values
            if (
              key === 'parts' ||
              key === 'cutPatterns' ||
              key === 'planks' ||
              key === 'legend' ||
              key === 'totalPlanks' ||
              key === 'svg' ||
              key === 'sparePlanks'
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
