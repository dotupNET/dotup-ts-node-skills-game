import { JsonSerializable } from 'dotup-ts-json-serializer';
import { GameState, TurnOrderMode } from '../Constants/Enumerations';
import { IButton } from '../Interfaces/IButton';
import { IGameModel } from '../Interfaces/IGameModel';
import { Player } from './Player';

@JsonSerializable()
export class GameModel implements IGameModel {
  Players: Player[];
  RegisteredButtons?: IButton[];

  // Buttons?: IButton[];
  NumberOfPlayer: number;
  // NumberOfButtons?: number;
  RoundsToPlay: number;
  GameDuration: number;

  CurrentGameState: GameState;
  CurrentRound: number;
  CurrentPlayerName: string;
  TurnOrderMode: TurnOrderMode;
  originatingRequestId: string;

  constructor() {
    this.TurnOrderMode = TurnOrderMode.Clockwise;
    this.CurrentRound = 0;
    this.Players = [];
    // this.RegisteredButtons = [];
  }

  // getPlayerButtonIds(): string[] {
  //   return this.Players.map(item => item.buttonId);
  // }
}
