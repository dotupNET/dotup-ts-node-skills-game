import { interfaces, services } from 'ask-sdk-model';
import { IRequestContext } from 'dotup-ts-node-skills';
import { EventNames } from '../Constants/Enumerations';

export abstract class GameEngineInput {

  protected abstract Timeout(item: services.gameEngine.InputHandlerEvent): void;
  protected abstract ButtonDown(buttonName: string, inputEvent: services.gameEngine.InputEvent): void;
  protected abstract Event(buttonName: string, inputEvent?: services.gameEngine.InputEvent): void;

  GameEngineInputHandlerEvent(context: IRequestContext, request: interfaces.gameEngine.InputHandlerEventRequest): void {
    request.events.forEach(event => {
      this.InputHandlerEvent(context, event);
    });
  }

  private InputHandlerEvent(context: IRequestContext, item: services.gameEngine.InputHandlerEvent): void {
    const request = context.request.getInputHandlerEventRequest();
    const session = context.request.getSessionAttributes();

    if (request.originatingRequestId !== session.originatingRequestId) {
      context.shouldEndSession(false);
      console.log(`request ${request.originatingRequestId} !==!== session ${session.originatingRequestId}`);

      return;
    }

    const event = item.name.split('_');
    const eventname = event[0];

    switch (eventname) {
      case EventNames.ButtonDown:
        const rest = event
          .slice(1)
          .join('_');

        if (item.inputEvents.length > 0) {
          item.inputEvents.forEach(inputEvent => {
            this.ButtonDown(rest, inputEvent);
          });
        } else {
          this.ButtonDown(rest, undefined);
        }

        break;

      case EventNames.Timeout:
        this.Timeout(item);
        break;

      default:
        if (item.inputEvents.length > 0) {
          item.inputEvents.forEach(inputEvent => {
            this.Event(item.name, inputEvent);
          });
        } else {
          this.Event(item.name);
        }
    }

  }
}
