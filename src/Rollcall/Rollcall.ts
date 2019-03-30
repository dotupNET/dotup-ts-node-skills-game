import { services } from 'ask-sdk-model';
import { IRequestContext } from 'dotup-ts-node-skills';
import { GadgetBuilder } from '../Builder/GadgetBuilder';
import { RollCallBuilder } from '../Builder/RollcallBuilder';
import { EventNames } from '../Constants/Enumerations';
import { IButton } from '../Interfaces/IButton';
import { IGameRequirements } from '../Interfaces/IGameRequirements';
import { IRollcallModel } from './IRollcallModel';
import { RollcallState } from './RollcallState';

export abstract class Rollcall {

  protected readonly context: IRequestContext;
  protected readonly requirements: IGameRequirements;

  readonly model: IRollcallModel;

  constructor(context: IRequestContext, requirements: IGameRequirements) {
    this.context = context;
    this.requirements = requirements;
    this.model = this.loadModel();
  }

  protected abstract createStartDirective(): void;
  abstract isValid(): boolean;
  abstract YesIntent(): void;
  abstract NoIntent(): void;
  protected abstract OnTimeout(item: services.gameEngine.InputHandlerEvent): void;
  protected abstract OnButtonFound(name: string, id: string, nextButton: IButton): void;

  Start(): void {
    const rollcallBuilder = new RollCallBuilder();

    this.context.shouldEndSession(undefined);

    this.model.state = RollcallState.Active;

    // Write context
    this.createStartDirective();
  }

  protected StopRollcall(): void {

    const lights = GadgetBuilder.setLightsOff([]);
    this.context.AddDirective(lights);

    // Done
    if (this.isValid()) {
      this.model.state = RollcallState.Completed;
    } else {
      this.model.state = RollcallState.Cancelled;
    }
  }

  GameEngineInputHandlerEvent(): void {
    const request = this.context.request.getInputHandlerEventRequest();

    request.events.forEach(event => {
      this.InputHandlerEvent(event);
    });
  }

  protected CancelRollcall(): void {
    const stop = GadgetBuilder.stopInputHandler(this.context.request.getSessionAttributes().originatingRequestId);
    this.context.AddDirective(stop);
    const lights = GadgetBuilder.setLightsOff([]);
    this.context.AddDirective(lights);
    this.model.state = RollcallState.Cancelled;
  }

  private InputHandlerEvent(item: services.gameEngine.InputHandlerEvent): void {
    const request = this.context.request.getInputHandlerEventRequest();
    const session = this.context.request.getSessionAttributes();

    if (request.originatingRequestId !== session.originatingRequestId) {
      // this.context.shouldEndSession(false);
      console.log(`event: ${item.name} | request ${request.originatingRequestId} !==!== session ${session.originatingRequestId}`);

      return;
    }

    const event = item.name.split('_');

    switch (event[0]) {
      case EventNames.ButtonDown:
        item.inputEvents.forEach(inputEvent => {
          this.ButtonDown(event[1], inputEvent);
        });
        break;

      case EventNames.ButtonGroupPressed:
        this.ButtonGroupDown(event[1], item.inputEvents);
        break;

      case EventNames.Timeout:
        // this.model.completed = true;
        console.log('ROLLCALL timeout');
        this.OnTimeout(item);
    }

  }

  protected ButtonGroupDown(buttonName: string, inputEvent: services.gameEngine.InputEvent[]): void {

    // TODO: Fehlerbehandlung
    // if (nextButton === undefined && !this.isValid()) {
    //   throw new Error('wrong configuration. No more rollcall buttons and model is invalid.');
    // }
    const group = this.model.rollcallButtonGroups.find(item => item.name === buttonName);

    for (let buttonIndex = 0; buttonIndex < group.buttons.length; buttonIndex += 1) {
      group.buttons[buttonIndex].id = inputEvent[buttonIndex].gadgetId;
    }

    group.buttons.forEach(button => {
      // Next button
      this.OnButtonFound(button.name, button.id, undefined);
    });

    if (this.isValid()) {
      this.StopRollcall();
    } else {
      this.Start();
    }
  }

  protected ButtonDown(buttonName: string, inputEvent: services.gameEngine.InputEvent): void {

    const foundButton = this.model.rollcallButtons.find(item => item.name === buttonName);

    if (foundButton.id !== undefined) {
      throw new Error(`${buttonName} already assigned to ${foundButton.id}`);
    }

    foundButton.id = inputEvent.gadgetId;

    // Next button
    const nextButton = this.model.rollcallButtons.find(item => item.id !== undefined);

    if (nextButton === undefined && !this.isValid()) {
      throw new Error('wrong configuration. No more rollcall buttons and model is invalid.');
    }

    this.OnButtonFound(foundButton.name, foundButton.id, nextButton);

  }

  private loadModel(): IRollcallModel {
    const session = this.context.request.getSessionAttributes();

    if (session.rollcall === undefined) {
      throw new Error('RollcallModel === undefined');
    }

    return session.rollcall;
  }

}
