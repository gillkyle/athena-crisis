import Player, { PlayerID } from '../map/Player.tsx';
import MapData from '../MapData.tsx';

export default function calculateUnitCount(
  map: MapData,
  player: Player | PlayerID,
): number {
  return map.units.reduce(
    (sum, unit) => sum + (map.matchesPlayer(player, unit) ? 1 : 0),
    0,
  );
}
