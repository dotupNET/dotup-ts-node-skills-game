import { TurnOrderMode } from '../Constants/Enumerations';
import { RollcallMode } from '../Rollcall/RollcallMode';

export interface IGameRequirements {
  numberOfPlayerMin: number;
  numberOfPlayerMax: number;
  numberOfButtonsMin: number;
  numberOfButtonsMax: number;
  numberOfButtonsPerButtonGroupMin: number;
  numberOfButtonsPerButtonGroupMax: number;
  roundsToPlayMin: number;
  roundsToPlayMax: number;
  turnOrderMode: TurnOrderMode;
  rollcallDuration: number;
  rollcallMode: RollcallMode;
}
