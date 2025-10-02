import { Plank } from './Plank';
import { Legend } from './Legend';
import { AssemblyDiagram } from './AssemblyDiagram';

export function PlanterCutlist({ config }) {
  return (
    <>
      <div className="cutlist-container">
        <h2>
          {config.title} Cutlist ({config.totalPlanks} Planks @ {config.plankLength}" × {config.plankWidth}")
        </h2>

        {config.planks.map((plank, idx) => (
          <Plank
            key={idx}
            plank={plank}
            plankLength={config.plankLength}
            scale={config.scale}
          />
        ))}

        <Legend legend={config.legend} plankLength={config.plankLength} />
      </div>

      <AssemblyDiagram svg={config.svg} />
    </>
  );
}
