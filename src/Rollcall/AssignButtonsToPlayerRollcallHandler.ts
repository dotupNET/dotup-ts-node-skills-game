// tslint:disable
// import { WorkflowHandler, WorkflowStepState } from '../../AlexaWorkflow';
// import { AlexaRequestTypes } from '../../Constants/AlexaConstants';
// import { VoidPromise } from '../../Constants/Types';
// import { RequestContext } from '../../Requests/RequestContext';
// import { GameModel } from '../Game/GameModel';
// import { IGameRequirements } from '../Interfaces/IGameRequirements';
// import { Rollcall } from './Rollcall';

// export class AssignButtonsToPlayerRollcallHandler extends WorkflowHandler<GameModel> {

//   private readonly requirements: IGameRequirements;

//   constructor(workflowName: string, requirements: IGameRequirements) {
//     super(workflowName);
//     this.requirements = requirements;
//     this.includedHandler.push(AlexaRequestTypes.GameEngineInputHandlerEvent);
//   }

//   async StartStep(context: RequestContext): Promise<void> {
//     const rollcall = new Rollcall(context, this.requirements);
//     const wf = context.request.getWorkflow<GameModel>();
//     const playerNames = wf.Payload.Players.map(item => item.name);

//     rollcall.Start(this.requirements.rollcallDuration, ...playerNames);

//     context.WorkflowStepState = WorkflowStepState.Processing;
//   }

//   GameEngineInputHandlerEvent(context: RequestContext): VoidPromise {

//     const request = context.request.getInputHandlerEventRequest();
//     const rollcall = new Rollcall(context, this.requirements);

//     // Store player and notify next to press button
//     rollcall.OnButtonFound = (name, id, completed) => {
//       const wf = context.request.getWorkflow<GameModel>();
//       const player = wf.Payload.Players.find(item => item.name === name);
//       player.buttonId = id;
//     };

//     rollcall.OnAskToPress = (name: string) => {
//       this.AskNextPlayerToPress(context, name);
//     };

//     rollcall.OnTimeout = () => {
//       // const wf = context.request.getWorkflow<GameModel>();
//       // this.AskNextPlayerToPress(context, wf);
//       context.Speak('Na vielleicht beim nächsten mal. Tschüss.');
//       context.shouldEndSession(true);
//       rollcall.CancelRollcall();
//       context.WorkflowStepState = WorkflowStepState.Error;
//     };

//     rollcall.GameEngineInputHandlerEvent(request);

//     if (context.WorkflowStepState === undefined) {
//       if (rollcall.model.completed) {
//         context.WorkflowStepState = WorkflowStepState.GetFromNext;
//       } else {
//         context.WorkflowStepState = WorkflowStepState.Processing;
//       }
//     }

//     return;
//   }

//   private AskNextPlayerToPress(context: RequestContext, nextName: string): void {
//     if (nextName === undefined) {
//       throw new Error('no other players available');
//     } else {
//       context.shouldEndSession(false);
//       context.Speak(`${nextName} drücke jetzt deinen Button.`);
//     }
//   }

// }
