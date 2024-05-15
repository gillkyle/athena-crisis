import Player, { PlayerID } from '../map/Player.tsx';
import MapData from '../MapData.tsx';

export default function calculateBuildingCount(
  map: MapData,
  player: Player | PlayerID,
): number {
  return map.buildings.reduce(
    (sum, building) => sum + (map.matchesPlayer(player, building) ? 1 : 0),
    0,
  );
}
