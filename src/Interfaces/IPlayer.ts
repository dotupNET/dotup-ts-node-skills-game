import { IButton } from './IButton';

export interface IPlayer {
  name: string;
  age?: number;
  score: number;
  currentRound: number;
  buttons?: IButton[];
}
