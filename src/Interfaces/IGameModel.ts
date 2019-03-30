import { GameState, TurnOrderMode } from '../Constants/Enumerations';
import { Player } from '../Game/Player';
import { IButton } from './IButton';

export interface IGameModel {
  Players?: Player[];
  RegisteredButtons?: IButton[];
  GameDuration: number;
  RoundsToPlay: number;
  CurrentRound: number;
  CurrentPlayerName: string;
  TurnOrderMode: TurnOrderMode;
  CurrentGameState: GameState;
}
