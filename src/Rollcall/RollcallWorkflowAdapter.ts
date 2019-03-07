import { IRequestContext } from 'dotup-ts-node-skills';
import { WorkflowController, WorkflowHandler, WorkflowStepHandler, WorkflowStepState } from 'dotup-ts-node-skills-workflows';
import { GameModel } from '../Game/GameModel';
import { Rollcall } from './Rollcall';
import { RollcallFactory } from './RollcallFactory';
import { RollcallState } from './RollcallState';

export class RollcallWorkflowAdapter extends WorkflowStepHandler<GameModel> {
  private readonly rollcallFactory: RollcallFactory;

  constructor(workflowName: string, rollcallFactory: RollcallFactory) {
    super(workflowName);
    this.rollcallFactory = rollcallFactory;
  }

  async StartStep(context: IRequestContext, wc: WorkflowController<GameModel>): Promise<void> {
    console.log('starting rollcall (PressButtonsToRegisterRollcallHandler)');

    const rollcall = this.rollcallFactory.getRollcall(context);
    rollcall.Start();

    wc.getWorkflow().CurrentWorkflowStepState = this.getWorkflowStepStateFromRollcall(rollcall);
  }

  GameEngineInputHandlerEvent(context: IRequestContext): void {
    const rollcall = this.rollcallFactory.getRollcall(context);
    rollcall.GameEngineInputHandlerEvent();
    const wc = context.request
      .getRequestAttributes()
      .getworkflowContext<GameModel>();

    wc.controller.getWorkflow().CurrentWorkflowStepState = this.getWorkflowStepStateFromRollcall(rollcall);
  }

  YesIntent(context: IRequestContext): void {
    const rollcall = this.rollcallFactory.getRollcall(context);
    rollcall.YesIntent();

    const wc = context.request
      .getRequestAttributes()
      .getworkflowContext<GameModel>();

    wc.controller.getWorkflow().CurrentWorkflowStepState = this.getWorkflowStepStateFromRollcall(rollcall);
  }

  NoIntent(context: IRequestContext): void {
    const rollcall = this.rollcallFactory.getRollcall(context);
    rollcall.NoIntent();

    const wc = context.request
      .getRequestAttributes()
      .getworkflowContext<GameModel>();

    wc.controller.getWorkflow().CurrentWorkflowStepState = this.getWorkflowStepStateFromRollcall(rollcall);
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
