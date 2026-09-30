import { SportType } from '@prisma/client';
import CricketScorebug from './sports/CricketScorebug';
import FootballScorebug from './sports/FootballScorebug';
import BadmintonScorebug from './sports/BadmintonScorebug';
import WrestlingScorebug from './sports/WrestlingScorebug';
import CanoeingScorebug from './sports/CanoeingScorebug';

export const ScorebugRegistry: Record<SportType, React.FC<any> | null> = {
  CRICKET: CricketScorebug,
  FOOTBALL: FootballScorebug,
  BADMINTON: BadmintonScorebug,
  WRESTLING: WrestlingScorebug,
  CANOEING: CanoeingScorebug,
};
