import { SparePlank } from './SparePlank';
import { NormalPlank } from './NormalPlank';
import { RippedPlank } from './RippedPlank';
import { MultiRipPlank } from './MultiRipPlank';

export function Plank({ plank, plankLength, scale }) {
  switch (plank.type) {
    case 'spare':
      return <SparePlank plank={plank} plankLength={plankLength} scale={scale} />;
    case 'normal':
      return <NormalPlank plank={plank} scale={scale} />;
    case 'ripped':
      return <RippedPlank plank={plank} plankLength={plankLength} />;
    case 'multi-rip':
      return <MultiRipPlank plank={plank} plankLength={plankLength} />;
    default:
      return null;
  }
}
