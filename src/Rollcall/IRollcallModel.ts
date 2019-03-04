import { IButton } from '../Interfaces/IButton';
import { IButtonSet } from '../Interfaces/IButtonSet';
import { RollcallState } from './RollcallState';

export interface IRollcallModel {
  name: string;
  rollcallButtons?: IButton[];
  rollcallButtonGroups?: IButtonSet[];
  state: RollcallState;
}
