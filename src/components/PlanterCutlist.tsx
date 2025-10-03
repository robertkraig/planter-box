import { Plank } from './Plank';
import { Legend } from './Legend';
import { AssemblyDiagram } from './AssemblyDiagram';
import type { ExpandedConfig } from '../types';

interface PlanterCutlistProps {
  config: ExpandedConfig;
  hasPendingChanges: boolean;
}

export function PlanterCutlist({ config, hasPendingChanges }: PlanterCutlistProps) {
  return (
    <>
      <div className={`cutlist-container ${hasPendingChanges ? 'pending-changes' : ''}`}>
        <h2>
          {config.title} Cutlist ({config.totalPlanks} Planks @{' '}
          {config.plankLength}" × {config.plankWidth}")
        </h2>

        <Legend legend={config.legend} plankLength={config.plankLength} />

        {config.planks.map((plank, idx) => (
          <Plank
            key={idx}
            plank={plank}
            plankLength={config.plankLength}
          />
        ))}

        {hasPendingChanges && <div className="cutlist-overlay" />}
      </div>

      <div className={`assembly-diagram-container ${hasPendingChanges ? 'pending-changes' : ''}`}>
        <AssemblyDiagram svg={config.svg} />
        {hasPendingChanges && <div className="cutlist-overlay" />}
      </div>
    </>
  );
}
