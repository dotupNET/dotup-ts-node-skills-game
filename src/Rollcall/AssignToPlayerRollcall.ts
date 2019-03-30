import { services } from 'ask-sdk-model';
import { IRequestContext } from 'dotup-ts-node-skills';
import { AmazonSsmlBuilder } from 'dotup-ts-ssml-builder';
import { AnimationBuilder } from '../Builder/AnimationBuilder';
import { GadgetBuilder } from '../Builder/GadgetBuilder';
import { RollCallBuilder } from '../Builder/RollcallBuilder';
import { ButtonColor, TriggerEvent } from '../Constants/Enumerations';
import { IButton } from '../Interfaces/IButton';
import { IGameRequirements } from '../Interfaces/IGameRequirements';
import { Rollcall } from './Rollcall';
import { RollcallState } from './RollcallState';

export class AssignToPlayerRollcall extends Rollcall {

  constructor(context: IRequestContext, requirements: IGameRequirements) {
    super(context, requirements);
  }

  protected createStartDirective(): void {
    const rollcallBuilder = new RollCallBuilder();

    const session = this.context.request.getSessionAttributes();
    const buttonGroups = session.rollcall.rollcallButtonGroups;

    const currentGroup = buttonGroups.find(group => {
      return group.buttons.some(button => {
        return button.id === undefined;
      });
    });

    if (currentGroup === undefined) {
      throw new Error('No button group found.');
    }

    // Prepare rollcall builder
    rollcallBuilder
      .WithColor(TriggerEvent.none, ButtonColor.off)
      .WithColor(TriggerEvent.buttonDown, ButtonColor.green)
      ;

    // Add name to rollcall builder
    rollcallBuilder.WithProxy(currentGroup.buttons.map(b => b.name));

    // Get start directive
    const startDirective = rollcallBuilder.BuildButtonGroup(
      currentGroup.name, // EventNames.ButtonGroupPressed,
      this.requirements.rollcallDuration,
      () => { this.context.SaveRequestId(); }
    );

    const sb = new AmazonSsmlBuilder();
    sb.AddText(`${currentGroup.name} drücke jetzt nacheinander`);
    currentGroup.buttons.forEach((button, index) => {
      sb.AddText(`den ${button.name}`);
      if (index === currentGroup.buttons.length - 2) {
        sb.AddText(`und`);
      }
    });
    sb.AddText(`Button`);

    this.context.Speak(sb);

    // this.context.Speak(`${currentGroup.name} drücke jetzt ${currentGroup.buttons.length} Buttons.`);
    this.context.Speak(`Du hast ${this.requirements.rollcallDuration / 1000} Sekunden zeit.`);
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

    // const currentGroup = this.model.rollcallButtonGroups.find(group => group.name === name);

    // const currentButton = currentGroup.buttons.find(button => button.name === nextButton.name);

    // currentButton.id = nextButton.id;

    // Notify user by light
    const light = GadgetBuilder.setLight(
      id,
      AnimationBuilder.GetFadeAnimation(ButtonColor.green),
      TriggerEvent.none
    );
    this.context.AddDirective(light);
    this.context.shouldEndSession(undefined);
  }

  isValid(): boolean {
    if (this.model.rollcallButtonGroups === undefined) {
      return false;
    }

    // Test each button group
    const result = this.model.rollcallButtonGroups.some(group => {

      // Buttons without id
      const withIds = group.buttons.filter(button => {
        return button.id !== undefined;
      });

      if (withIds.length < this.requirements.numberOfButtonsPerButtonGroupMin) {
        return true;
      }

      if (withIds.length > this.requirements.numberOfButtonsPerButtonGroupMax) {
        return true;
      }

    });

    return !result;

  }
}
