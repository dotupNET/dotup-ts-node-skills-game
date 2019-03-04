import { IRequestContext, NodeSkill } from 'dotup-ts-node-skills';
import { AssignToPlayerRollcall } from './AssignToPlayerRollcall';
import { PressToRegisterRollcall } from './PressToRegisterRollcall';
import { Rollcall } from './Rollcall';
import { RollcallMode } from './RollcallMode';

export class RollcallFactory {

  constructor() {
  }

  getRollcall(context: IRequestContext): Rollcall {

    switch (NodeSkill.requirements.rollcallMode) {

      case RollcallMode.AssignToPlayer:
        return new AssignToPlayerRollcall(context);

      case RollcallMode.PressToRegister:
        return new PressToRegisterRollcall(context);

      default:
    }

  }

}
