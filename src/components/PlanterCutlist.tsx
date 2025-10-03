import { Plank } from './Plank';
import { Legend } from './Legend';
import { AssemblyDiagram } from './AssemblyDiagram';
import type { ExpandedConfig } from '../types';

interface PlanterCutlistProps {
  config: ExpandedConfig;
}

export function PlanterCutlist({ config }: PlanterCutlistProps) {
  return (
    <>
      <div className="cutlist-container">
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

      </div>

      <AssemblyDiagram svg={config.svg} />
    </>
  );
}
