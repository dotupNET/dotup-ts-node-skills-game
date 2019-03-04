import { IRequestContext, WorkflowHandler, WorkflowStepState } from 'dotup-ts-node-skills';
import { GameModel } from '../Game/GameModel';
import { Rollcall } from './Rollcall';
import { RollcallFactory } from './RollcallFactory';
import { RollcallState } from './RollcallState';

export class RollcallWorkflowAdapter extends WorkflowHandler<GameModel> {
  private readonly rollcallFactory: RollcallFactory;

  constructor(workflowName: string, rollcallFactory: RollcallFactory) {
    super(workflowName);
    this.rollcallFactory = rollcallFactory;
  }

  async StartStep(context: IRequestContext): Promise<void> {
    console.log('starting rollcall (PressButtonsToRegisterRollcallHandler)');

    const rollcall = this.rollcallFactory.getRollcall(context);
    rollcall.Start();

    context.WorkflowStepState = this.getWorkflowStepStateFromRollcall(rollcall);
  }

  GameEngineInputHandlerEvent(context: IRequestContext): void {
    const rollcall = this.rollcallFactory.getRollcall(context);
    rollcall.GameEngineInputHandlerEvent();

    context.WorkflowStepState = this.getWorkflowStepStateFromRollcall(rollcall);
  }

  YesIntent(context: IRequestContext): void {
    const rollcall = this.rollcallFactory.getRollcall(context);
    rollcall.YesIntent();

    context.WorkflowStepState = this.getWorkflowStepStateFromRollcall(rollcall);
  }

  NoIntent(context: IRequestContext): void {
    const rollcall = this.rollcallFactory.getRollcall(context);
    rollcall.NoIntent();

    context.WorkflowStepState = this.getWorkflowStepStateFromRollcall(rollcall);
  }

  getWorkflowStepStateFromRollcall(rollcall: Rollcall): WorkflowStepState {

    switch (rollcall.model.state) {

      case RollcallState.Cancelled:
        return WorkflowStepState.Error;

      case RollcallState.Completed:
        return WorkflowStepState.GetFromNext;

      case RollcallState.None:
      case RollcallState.Active:
      case RollcallState.RepeatRollcall:
      default:
        return WorkflowStepState.Processing;
    }

  }

}
