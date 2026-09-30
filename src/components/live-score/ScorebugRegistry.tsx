import { SportType } from '@prisma/client';
import CricketScorebug from './sports/CricketScorebug';

export const ScorebugRegistry: Record<SportType, React.FC<any> | null> = {
  CRICKET: CricketScorebug,
  FOOTBALL: null,
  BADMINTON: null,
  WRESTLING: null,
  CANOEING: null,
};
