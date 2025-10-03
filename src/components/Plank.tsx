import { SparePlank } from './SparePlank';
import { NormalPlank } from './NormalPlank';
import { RippedPlank } from './RippedPlank';
import { MultiRipPlank } from './MultiRipPlank';
import type { Plank as PlankType } from '../types';

interface PlankProps {
  plank: PlankType;
  plankLength: number;
}

export function Plank({ plank, plankLength }: PlankProps) {
  const scale = 10; // pixels per inch

  switch (plank.type) {
    case 'spare':
      return (
        <SparePlank plank={plank} plankLength={plankLength} scale={scale} />
      );
    case 'normal':
      return <NormalPlank plank={plank} scale={scale} />;
    case 'ripped':
      return <RippedPlank plank={plank} plankLength={plankLength} scale={scale} />;
    case 'multi-rip':
      return <MultiRipPlank plank={plank} plankLength={plankLength} scale={scale} />;
    default:
      return null;
  }
}
