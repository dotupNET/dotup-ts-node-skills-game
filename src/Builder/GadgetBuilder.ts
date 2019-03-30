import { ButtonColor, GameEngineDirectives, TriggerEvent } from '../Constants/Enumerations';
import { IAnimation, IGadgetControllerDirectives } from '../Interfaces/IGadgetControler';
// tslint:disable-next-line:max-line-length
import { IEventsObject, IPatternRecognizerObject, IRecognizerObject, IStartInputHandlerDirective, IStopInputHandlerDirective } from '../Interfaces/IGameEngine';
import { AnimationBuilder } from './AnimationBuilder';
import { SequenceBuilder } from './SequenceBuilder';

export namespace GadgetBuilder {

  // returns a StartInputHandler directive that can be added to an Alexa skill response
  export function startInputHandler(
    timeout: number,
    events: IEventsObject,
    saveRequestId: () => void,
    recognizers?: IRecognizerObject | IPatternRecognizerObject,
    proxies?: string[]
  ): IStartInputHandlerDirective {

    const result: IStartInputHandlerDirective = {
      type: GameEngineDirectives.StartInputHandler,
      timeout: timeout,
      // maximumHistoryLength: maximumHistoryLength,
      proxies: proxies,
      events: events
    };

    if (recognizers !== undefined) {
      result.recognizers = recognizers;
    }

    saveRequestId();

    return result;

  }

  // returns a StopInputHandler directive that can be added to an Alexa skill response
  export function stopInputHandler(id: string): IStopInputHandlerDirective {
    return {
      type: GameEngineDirectives.StopInputHandler,
      originatingRequestId: id
    };
  }

  export function setLightsOff(gadgetIds: string | string[]): IGadgetControllerDirectives {
    return setLight(
      gadgetIds,
      AnimationBuilder.GetSolidAnimation(1, ButtonColor.off, 1),
      TriggerEvent.none,
      0
    );
  }

  export function setButtonDown(gadgetIds: string | string[], color: ButtonColor, duration: number = 1): IGadgetControllerDirectives {
    return setLight(
      gadgetIds,
      AnimationBuilder.GetSolidAnimation(1, color, duration),
      TriggerEvent.buttonDown
    );
  }

  export function setLightAndPowerOff(
    gadgetIds: string | string[],
    color: ButtonColor,
    duration: number = 5000
  ): IGadgetControllerDirectives {
    const sequences = [
      SequenceBuilder.GetSolid(color, duration),
      SequenceBuilder.GetLightsOff(1)
    ];

    return setLight(
      gadgetIds,
      AnimationBuilder.GetAnimation(1, sequences),
      TriggerEvent.none
    );
  }

  // returns a SetLight directive, with a 'none' trigger, that can be added to an Alexa skill response
  export function setLight(
    targetGadgets: string | string[],
    animations: IAnimation | IAnimation[],
    triggerEvent: TriggerEvent,
    triggerEventTimeMs: number = 0
  ): IGadgetControllerDirectives {
    const ids = Array.isArray(targetGadgets) ? targetGadgets : [targetGadgets];
    const ani = Array.isArray(animations) ? animations : [animations];

    return {
      type: 'GadgetController.SetLight',
      version: '1',
      targetGadgets: ids,
      parameters: {
        animations: ani,
        triggerEvent: triggerEvent,
        triggerEventTimeMs: triggerEventTimeMs
      }
    };
  }

}
