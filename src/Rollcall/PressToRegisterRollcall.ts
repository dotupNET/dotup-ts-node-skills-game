import { services } from 'ask-sdk-model';
import { IRequestContext } from 'dotup-ts-node-skills';
import { AnimationBuilder } from '../Builder/AnimationBuilder';
import { GadgetBuilder } from '../Builder/GadgetBuilder';
import { RollCallBuilder } from '../Builder/RollcallBuilder';
import { ButtonColor, TriggerEvent } from '../Enumerations';
import { IButton } from '../Interfaces/IButton';
import { IGameRequirements } from '../Interfaces/IGameRequirements';
import { Rollcall } from './Rollcall';
import { RollcallState } from './RollcallState';

export class PressToRegisterRollcall extends Rollcall {
  private tmpRollcallDuration: number;

  constructor(context: IRequestContext, requirements: IGameRequirements) {
    super(context, requirements);
    this.tmpRollcallDuration = requirements.rollcallDuration;
  }

  protected createStartDirective(): void {
    const rollcallBuilder = new RollCallBuilder();

    this.model.rollcallButtons = [{ name: 'Button1' }, { name: 'Button2' }, { name: 'Button3' }, { name: 'Button4' }, { name: 'Button5' }];

    // Prepare rollcall builder
    rollcallBuilder
      // .FindButton('buttonName', ButtonColors.green, 'buttonName drücke jetzt deinen Button')
      .WithColor(TriggerEvent.none, ButtonColor.off)
      .WithColor(TriggerEvent.buttonDown, ButtonColor.green)
      // .WithColor(TriggerEvent.buttonUp, ButtonColors.green)
      ;

    // Add name to rollcall builder
    rollcallBuilder.WithProxy(this.model.rollcallButtons.map(b => b.name));

    // Get start directive
    const startDirective = rollcallBuilder.Build(
      this.tmpRollcallDuration,
      () => { this.context.SaveRequestId(); }
    );

    this.context.Speak(`Drücke jetzt alle Buttons mit denen du spielen möchtest.`);
    this.context.Speak(`Du hast ${this.tmpRollcallDuration / 1000} Sekunden zeit.`);
    // this.context.Speak(`Wenn du fertig bist sage einfach ja.`);
    // this.context.Reprompt('hast du alle Buttons gedrückt?');

    this.context.AddDirective(startDirective);
  }

  YesIntent(): void {
    throw new Error('YesIntent not supported.');
  }

  NoIntent(): void {
    throw new Error('NoIntent not supported.');
  }

  protected OnTimeout(item: services.gameEngine.InputHandlerEvent): void {

    // Try to stop the rollcall
    switch (this.model.state) {

      case RollcallState.Active:
        if (this.isValid()) {
          this.StopRollcall();
        } else {
          this.context.Speak(`Drücke mindestens ${this.requirements.numberOfButtonsMin} Buttons.`);
          this.context.Speak(`Und höchstens ${this.requirements.numberOfButtonsMax} Buttons.`);
          this.tmpRollcallDuration *= 2;
          this.createStartDirective();
          this.model.state = RollcallState.RepeatRollcall;
        }
        break;

      case RollcallState.RepeatRollcall:
        if (this.isValid()) {
          this.StopRollcall();
        } else {
          this.context.Speak('Na vielleicht beim nächsten mal. Tschüss.');
          this.context.shouldEndSession(true);
          this.CancelRollcall();
        }
        break;

      case RollcallState.Cancelled:
        this.context.Speak('Na vielleicht beim nächsten mal. Tschüss.');
        this.context.shouldEndSession(true);
        this.CancelRollcall();

        break;

      default:
      // It's already handled
    }

  }

  protected OnButtonFound(name: string, id: string, nextButton: IButton): void {
    const light = GadgetBuilder.setLight(
      id,
      AnimationBuilder.GetFadeAnimation(ButtonColor.green),
      TriggerEvent.none
    );
    this.context.AddDirective(light);
    this.context.shouldEndSession(undefined);
  }

  isValid(): boolean {
    if (this.model.rollcallButtons === undefined) {
      return false;
    }

    const withIds = this.model.rollcallButtons.filter(item => item.id !== undefined);

    if (withIds.length < this.requirements.numberOfButtonsMin) {
      return false;
    }

    if (withIds.length > this.requirements.numberOfButtonsMax) {
      return false;
    }

    return true;
  }

}

//   // Start(): void {

//   //   // Write context

//   //   // this.askToPress(buttonNames[0]);
//   //   // context.Speak(`${wf.Payload.Players[0].name} drücke jetzt deinen Button`);
//   //   // context.AddDirective(rollcall.Build(20000));

//   //   // this.saveModel();
//   // }

//   // YesIntent(context: RequestContext): VoidPromise {

//   //   const requirements = context.getWorkflow<GameModel>().Payload.requirements;
//   //   const rollcall = new Rollcall(context, requirements);

//   //   if (rollcall.isValid()) {
//   //     this.StopRollcall(context);
//   //   } else {
//   //     context.Speak(`Drücke mindestens ${requirements.numberOfButtonsMin} Buttons.`);
//   //     context.Speak(`Und höchstens ${requirements.numberOfButtonsMax} Buttons.`);
//   //     context.Speak('Hast du alle Buttons gedrückt?');
//   //     context.shouldEndSession(false);
//   //     context.WorkflowStepState = WorkflowStepState.Processing;
//   //   }
//   // }

//   GameEngineInputHandlerEvent(): void {
//     // const requirements = context.getWorkflow<GameModel>().Payload.requirements;
//     const request = this.context.request.getInputHandlerEventRequest();
//     // const rollcall = new Rollcall(context, requirements);

//     // // Store player and notify next to press button
//     // rollcall.OnButtonFound = (name, id, completed) => {

//     //   // const light = GadgetBuilder.setLight(
//     //   //   rollcall.model.rollcallButtons.map(item => item.id),
//     //   //   AnimationBuilder.GetFadeAnimation(ButtonColors.Colors.green),
//     //   //   TriggerEvent.none
//     //   // );
//     //   // context.AddDirective(light);
//     //   // this.AskPlayerToPress(context, name);
//     // };

//     // rollcall.OnTimeout = () => {
//     //   // const wf = context.request.getWorkflow<GameModel>();
//     //   // this.AskNextPlayerToPress(context, wf);
//     //   context.Speak('Na vielleicht beim nächsten mal. Tschüss.');
//     //   context.shouldEndSession(true);
//     //   context.WorkflowStepState = WorkflowStepState.Error;
//     //   rollcall.CancelRollcall();
//     // };

//     request.events.forEach(event => {
//       this.InputHandlerEvent(event);
//     });

//     if (this.isValid()) {
//       // Copy rollcall buttons to workflow
//       this.model.completed = this.isCompleted();
//       if (this.model.completed) {
//         this.StopRollcall();
//       }
//     } else {
//       this.state = RollcallState.Active;
//     }

//   }
//   // ------------------

//   protected CancelRollcall(): void {
//     const stop = GadgetBuilder.stopInputHandler(this.context.request.getSessionAttributes().originatingRequestId);
//     this.context.AddDirective(stop);
//     const lights = GadgetBuilder.setLightsOff([]);
//     this.context.AddDirective(lights);
//     this.state = RollcallState.Cancelled;
//   }

//   // private askToPress(name: string) {

//   //   // Voice first
//   //   if (this.OnAskToPress !== undefined) {
//   //     this.OnAskToPress(name);
//   //   }
//   //   // Then sound
//   //   // const sl = new SoundLibrary();
//   //   // this.context.Speak(sl.getFoleySound(FoleySounds.rhythmic_ticking_30s_01));
//   // }

//   private InputHandlerEvent(item: services.gameEngine.InputHandlerEvent): void {
//     const request = this.context.request.getInputHandlerEventRequest();
//     const session = this.context.request.getSessionAttributes();

//     if (request.originatingRequestId !== session.originatingRequestId) {
//       // this.context.shouldEndSession(false);
//       console.log(`event: ${item.name} | request ${request.originatingRequestId} !==!== session ${session.originatingRequestId}`);

//       return;
//     }

//     const event = item.name.split('_');

//     switch (event[0]) {
//       case EventNames.ButtonDown:
//         item.inputEvents.forEach(inputEvent => {
//           this.ButtonDown(event[1], inputEvent);
//         });
//         break;

//       case EventNames.Timeout:
//         // this.model.completed = true;
//         console.log('ROLLCALL timeout');
//         this.OnTimeout(item);
//     }

//   }

//   protected ButtonDown(buttonName: string, inputEvent: services.gameEngine.InputEvent): void {

//     const foundButton = this.model.rollcallButtons.find(item => item.name === buttonName);

//     if (foundButton.id !== undefined) {
//       throw new Error(`${buttonName} already assigned to ${foundButton.id}`);
//     }

//     foundButton.id = inputEvent.gadgetId;
//     // this.SetButtons(ButtonColors.Colors.green, TriggerEvent.none, [foundButton.id]);

//     // Next button
//     const nextButton = this.model.rollcallButtons.find(item => item.id !== undefined);

//     this.OnButtonFound(foundButton.name, foundButton.id, nextButton);

//     if (nextButton === undefined && !this.isValid()) {
//       throw new Error('wrong configuration. No more rollcall buttons and model is invalid.');
//     }

//     // // Lookup for max buttons
//     // const registeredButtons = this.model.rollcallButtons.filter(item => item.id !== undefined);

//     // if (nextButton === undefined && this.isValid()) {
//     //   this.model.completed = true;
//     // } else if (nextButton === undefined) {
//     //   throw new Error('wrong configuration. No more rollcall buttons and model is invalid.');
//     // } else {
//     //   this.askToPress(nextButton.name);
//     // }

//   }

//   private loadModel(rollcallName: string): IRollcallModel {
//     const session = this.context.request.getSessionAttributes();

//     if (session.RollcallModel === undefined) {
//       session.RollcallModel = this.getDefaultModel(rollcallName);
//     }

//     return session.RollcallModel;
//   }

//   // create rollcall
//   private getDefaultModel(rollcallName: string): IRollcallModel {
//     const session = this.context.request.getSessionAttributes();
//     const result: IRollcallModel = {
//       name: rollcallName,
//       completed: false,
//       rollcallButtons: [{ name: 'Button1' }, { name: 'Button2' }, { name: 'Button3' }, { name: 'Button4' }]
//     };
//     session.RollcallModel = result;

//     return session.RollcallModel;
//   }
// }
