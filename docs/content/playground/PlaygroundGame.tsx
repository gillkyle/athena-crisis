import { MapMetadata } from '@deities/apollo/MapMetadata.tsx';
import { prepareSprites } from '@deities/art/Sprites.tsx';
import { Sniper } from '@deities/athena/info/Unit.tsx';
import MapData from '@deities/athena/MapData.tsx';
import GameMap from '@deities/hera/GameMap.tsx';
import useClientGame from '@deities/hera/hooks/useClientGame.tsx';
import useClientGameAction from '@deities/hera/hooks/useClientGameAction.tsx';
import { UserLike } from '@deities/hera/hooks/useUserMap.tsx';
import { hasNotableAnimation } from '@deities/hera/MapAnimations.tsx';
import CurrentGameCard from '@deities/hera/ui/CurrentGameCard.tsx';
import GameActions from '@deities/hera/ui/GameActions.tsx';
import MapInfo from '@deities/hera/ui/MapInfo.tsx';
import useScale from '@deities/ui/hooks/useScale.tsx';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

prepareSprites();

const startAction = {
  type: 'Start',
} as const;

export default function PlaygroundGame({
  map,
  metadata,
}: {
  map: MapData;
  metadata?: MapMetadata;
}) {
  const userId = 'User-Demo';
  const [game, setGame] = useClientGame(
    map,
    userId,
    metadata?.effects || new Map(),
    startAction,
  );

  const onAction = useClientGameAction(game, setGame);
  const zoom = useScale();
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-20% 0px 6% 0px' });

  const viewer = {
    access: 'User',
    character: {
      unitId: Sniper.id,
      variant: 0,
    },
    displayName: 'Hot reloads!',
    factionName: 'Atlas',
    id: 'Demo-User-12',
    skills: [1],
    username: 'demo-maxima',
  } as UserLike;

  return (
    <div ref={ref}>
      <GameMap
        currentUserId={userId}
        factionNames={new Map()}
        fogStyle="soft"
        key="play-demo-map"
        lastActionResponse={game.lastAction}
        map={game.state}
        margin="minimal"
        onAction={onAction}
        pan
        paused={!isInView}
        scale={zoom}
        scroll={false}
        style="floating"
        tilted={true}
        userDisplayName="Player"
      >
        {(props, actions) => {
          const hide =
            !isInView || props.lastActionResponse?.type === 'GameEnd';

          return (
            <>
              <CurrentGameCard
                actions={actions}
                animatePlayer={hasNotableAnimation(props.animations)}
                currentViewer={props.currentViewer}
                hide={hide}
                inlineUI={props.inlineUI}
                inset={0}
                map={props.map}
                teams={[...props.map.teams.sortBy(({ id }) => id).values()].map(
                  (team) => ({
                    team,
                    users: new Map([
                      [1, viewer],
                      [2, viewer],
                    ]),
                  }),
                )}
                vision={props.vision}
                zIndex={props.zIndex}
              />
              <MapInfo hide={hide} leftOffset {...props} />
              <GameActions
                actions={actions}
                hide={hide}
                state={props}
                zoom={zoom}
              />
            </>
          );
        }}
      </GameMap>
    </div>
  );
}
