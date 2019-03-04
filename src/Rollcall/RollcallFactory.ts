import { IRequestContext } from 'dotup-ts-node-skills';
import { IGameRequirements } from '../Interfaces/IGameRequirements';
import { AssignToPlayerRollcall } from './AssignToPlayerRollcall';
import { PressToRegisterRollcall } from './PressToRegisterRollcall';
import { Rollcall } from './Rollcall';
import { RollcallMode } from './RollcallMode';

export class RollcallFactory {
  private readonly requirements: IGameRequirements;

  constructor(requirements: IGameRequirements) {
    this.requirements = requirements;
  }

  getRollcall(context: IRequestContext): Rollcall {

    switch (this.requirements.rollcallMode) {

      case RollcallMode.AssignToPlayer:
        return new AssignToPlayerRollcall(context, this.requirements);

      case RollcallMode.PressToRegister:
        return new PressToRegisterRollcall(context, this.requirements);

      default:
    }

  }

}
