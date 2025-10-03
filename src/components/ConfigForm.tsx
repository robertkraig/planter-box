import { useState, useEffect } from 'react';
import type { ExpandedConfig, PlanterConfig } from '../types';
import { formatFraction } from '../utils/formatFraction';

interface ConfigFormProps {
  config: ExpandedConfig;
  onConfigChange: (config: PlanterConfig) => void;
  onPendingChange: (hasPending: boolean) => void;
}

export function ConfigForm({
  config,
  onConfigChange,
  onPendingChange,
}: ConfigFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftConfig, setDraftConfig] = useState<PlanterConfig>(config);

  // Update draft when config changes (e.g., on submit)
  useEffect(() => {
    setDraftConfig(config);
  }, [config]);

  // Helper to update a nested config value by path
  const updateConfigValue = (path: string, value: any) => {
    const newConfig = { ...draftConfig };
    const keys = path.split('.');
    let current = newConfig as any;

    // Navigate to the nested property
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    // Update the value
    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;

    // Apply changes
    setDraftConfig(newConfig);
    onPendingChange(true);
  };

  const handleChange = (path: string, value: string) => {
    const keys = path.split('.');
    let current = draftConfig as any;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    const currentValue = current[keys[keys.length - 1]];

    // Convert value based on current type
    let convertedValue: any = value;

    if (typeof currentValue === 'number') {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue <= 0) return; // Invalid number
      convertedValue = numValue;
    } else if (typeof currentValue === 'boolean') {
      convertedValue = value === 'true';
    }

    updateConfigValue(path, convertedValue);
  };

  const handleFractionChange = (
    path: string,
    whole: string,
    fraction: string
  ) => {
    const wholeNum = parseInt(whole) || 0;
    const fracNum = parseFloat(fraction) || 0;
    const total = wholeNum + fracNum;

    if (total > 0) {
      updateConfigValue(path, total);
    }
  };

  const handleSubmit = () => {
    onConfigChange(draftConfig);
    // Close the sidebar after 1 second
    setTimeout(() => {
      setIsOpen(false);
    }, 1000);
  };

  const handleCancel = () => {
    setDraftConfig(config);
    onPendingChange(false);
  };

  const handleShare = () => {
    // Use the applied config (not draft), excluding computed values
    const configToShare: Partial<PlanterConfig> = {
      title: config.title,
      plankLength: config.plankLength,
      plankWidth: config.plankWidth,
      plankThickness: config.plankThickness,
      kerf: config.kerf,
      box: config.box,
      sparePlanks: config.sparePlanks,
    };

    const params = new URLSearchParams();
    params.set('config', btoa(JSON.stringify(configToShare)));

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    // Copy to clipboard
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        alert('Share link copied to clipboard!');
      })
      .catch(() => {
        // Fallback: show the URL in a prompt
        prompt('Share this URL:', shareUrl);
      });
  };

  const renderInput = (key: string, value: any, path: string) => {
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
              (
              {
                <span
                  dangerouslySetInnerHTML={{ __html: formatFraction(value) }}
                ></span>
              }
              )
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
          <div className="config-form-number-input-group">
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
              className="config-form-number-input-whole"
            />
            <span className="config-form-inch-mark">&quot;</span>
            <input
              type="number"
              value={((value - Math.floor(value)) * 1)
                .toFixed(3)
                .replace(/\.?0+$/, '')}
              min="0"
              max="0.99"
              step="0.125"
              onChange={(e) => {
                const whole = Math.floor(value).toString();
                const fraction = e.target.value;
                handleFractionChange(path, whole, fraction);
              }}
              className="config-form-number-input-fraction"
            />
          </div>
        ) : (
          <input
            id={inputId}
            type="text"
            value={value}
            onChange={(e) => handleChange(path, e.target.value)}
            className="config-form-input"
          />
        )}
      </div>
    );
  };

  return (
    <div className={`config-form-container ${isOpen ? 'open' : ''}`}>
      <div className="config-form-nav-bar">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="config-form-nav-btn"
          aria-label="Toggle configuration panel"
          title="Settings"
        >
          <span>{isOpen ? '◀' : '⚙️'}</span>
        </button>
        <button
          onClick={handleShare}
          className="config-form-nav-btn"
          aria-label="Share configuration"
          title="Share Configuration"
        >
          <span>🔗</span>
        </button>
      </div>

      <div className="config-form-sidebar">
        <div className="config-form-header">
          <h3>Configure Planter Box</h3>
        </div>

        <div className="config-form-content">
          {Object.entries(draftConfig).map(([key, value]) => {
            // Skip computed/complex values (only computed values, not user inputs)
            const ignoreKeys = [
              'parts',
              'cutPatterns',
              'planks',
              'legend',
              'totalPlanks',
              'svg',
            ];
            if (ignoreKeys.some((k) => k === key)) {
              return null;
            }
            return renderInput(key, value, key);
          })}
        </div>

        <div className="config-form-actions">
          <button onClick={handleCancel} className="config-form-btn-cancel">
            Cancel
          </button>
          <button onClick={handleSubmit} className="config-form-btn-submit">
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}
