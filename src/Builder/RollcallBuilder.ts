// tslint:disable
import { ObjectTools } from 'dotup-ts-types';
import { ButtonColor, TriggerEvent } from '../Enumerations';
import { IEventsObject, IRecognizerObject } from '../Interfaces/IGameEngine';
import { AnimationBuilder } from './AnimationBuilder';
import { EventsBuilder } from './EventsBuilder';
import { GadgetBuilder } from './GadgetBuilder';
import { RecognizerBuilder } from './RecognizerBuilder';
import { IDirective } from 'dotup-ts-node-skills';

export class RollCallBuilder {

  private buttonColors: Map<TriggerEvent, ButtonColor> = new Map<TriggerEvent, ButtonColor>();

  // private recognizerBuilder: RecognizerBuilder;
  private proxies: string[] = [];

  constructor() {
  }

  WithProxy(buttonName: string | string[]): RollCallBuilder {
    if (Array.isArray(buttonName)) {
      this.proxies.push(...buttonName);
    } else {
      this.proxies.push(buttonName);
    }
    return this;
  }

  // FindButton(buttonName: string, color: ButtonColors, arg2: string): any {
  //   throw new Error("Method not implemented.");
  // }

  WithColor(event: TriggerEvent, color: ButtonColor): RollCallBuilder {
    this.buttonColors.set(event, color);
    return this;
  }

  Build(timeout: number, saveRequestId: () => void): IDirective[] {
    let rb = new RecognizerBuilder();

    const allRecognizers: IRecognizerObject = {};
    const allEvents: IEventsObject = {}

    // Build recognizer and events for each button
    this.proxies.forEach((proxyName, index) => {

      // Recognizer
      allRecognizers[proxyName] = rb.WithGadgets(proxyName).WithFuzzy(true).Build();

      // Event
      const event = EventsBuilder.GetButtonDown(proxyName, index === this.proxies.length - 1);
      ObjectTools.CopyEachSource(event, allEvents);

    });

    // Build button colors
    const lights = this.SetButtons(timeout, this.proxies);

    // Add timeout
    const timeoutEvent = EventsBuilder.GetTimeoutEvent()

    ObjectTools.CopyEachSource(timeoutEvent, allEvents);

    // Build recognizer for completed
    // rb = new RecognizerBuilder('compleded', RecognizerBuilderMode.PatternForEachProxy);
    // rb.WithFuzzy(true);
    // this.proxies.forEach(item => rb.WithProxy(item));

    // Merge recognizer
    // ObjectTools.CopyEachSource(rb.Build(), allRecognizers);

    const start = GadgetBuilder.startInputHandler(
      timeout,
      allEvents,
      saveRequestId,
      allRecognizers,
      this.proxies
    );

    // console.log('### ROLLCALL ###');
    // console.log(JSON.stringify(start, undefined, 2));

    return [start, ...lights];
  }

  BuildButtonGroup(eventName: string, timeout: number, saveRequestId: () => void): IDirective[] {
    let rb = new RecognizerBuilder();

    const allRecognizers: IRecognizerObject = {};
    const allEvents: IEventsObject = {}

    // Recognizer
    allRecognizers[eventName] = RecognizerBuilder.ButtonGroupDown(this.proxies);
    // const recognizer = this.BuildRecognizer(eventName, this.proxies);
    // ObjectTools.CopyEachSource(recognizer, allRecognizers);

    // Event
    const event = EventsBuilder.GetButtonGroupDown(eventName, true);
    ObjectTools.CopyEachSource(event, allEvents);

    // Build button colors
    const lights = this.SetButtons(timeout, this.proxies);

    // Add timeout
    const timeoutEvent = EventsBuilder.GetTimeoutEvent()

    ObjectTools.CopyEachSource(timeoutEvent, allEvents);

    // Build recognizer for completed
    // rb = new RecognizerBuilder('compleded', RecognizerBuilderMode.PatternForEachProxy);
    // rb.WithFuzzy(true);
    // this.proxies.forEach(item => rb.WithProxy(item));

    // Merge recognizer
    // ObjectTools.CopyEachSource(rb.Build(), allRecognizers);

    const start = GadgetBuilder.startInputHandler(
      timeout,
      allEvents,
      saveRequestId,
      allRecognizers,
      this.proxies
    );

    // console.log('### ROLLCALL ###');
    // console.log(JSON.stringify(start, undefined, 2));

    return [start, ...lights];
  }

  SetButtons(timeout: number, targets: string | string[]): IDirective[] {
    const ids = Array.isArray(targets) ? targets : [targets];

    const noneColor = this.buttonColors.get(TriggerEvent.none) || ButtonColor.off;
    const noneLight = GadgetBuilder.setLight(
      [],
      AnimationBuilder.GetSolidAnimation(1, noneColor),
      TriggerEvent.none
    );

    const downColor = this.buttonColors.get(TriggerEvent.buttonDown) || ButtonColor.green;
    const downLight = GadgetBuilder.setLight(
      [],
      AnimationBuilder.GetSolidAnimation(1, downColor, 500),
      TriggerEvent.buttonDown
    );

    return [downLight, noneLight];
  }
  // HandleFirstButtonCheckIn(handlerInput: any): Response {
  //   console.log('RollCall::InputHandlerEvent::first_button_checked_in');
  //   const { attributesManager } = handlerInput;
  //   const ctx = attributesManager.getRequestAttributes();
  //   const sessionAttributes = attributesManager.getSessionAttributes();

  //   console.log('RollCall:: request attributes  = ' + JSON.stringify(ctx, null, 2));

  //   // just in case we ever get this event, after the `second_button_checked_in` event
  //   //  was already handled, we check the make sure the `buttonCount` attribute is set to 0;
  //   //   if not, we will silently ignore the event
  //   if (sessionAttributes.buttonCount === 0) {
  //     // Say something when we first encounter a button
  //     ctx.outputSpeech = ['Hello, button 1.'];
  //     ctx.outputSpeech.push(Settings.WAITING_AUDIO);

  //     const fistButtonId = ctx.gameInputEvents[0].gadgetId;
  //     ctx.directives.push(
  //       GadgetDirectives.setIdleAnimation(
  //         [fistButtonId],
  //         BasicAnimations.GetAnimation(ButtonAnimation.ButtonCheckInIdle)
  //       )
  //     );

  //     sessionAttributes.DeviceIDs[1] = fistButtonId;
  //     sessionAttributes.buttonCount = 1;
  //   }

  //   ctx.openMicrophone = false;
  //   return handlerInput.responseBuilder.getResponse();
  // }

  // HandleSecondButtonCheckIn(handlerInput: any) {
  //   console.log('RollCall::InputHandlerEvent::second_button_checked_in');
  //   const { attributesManager } = handlerInput;
  //   const ctx = attributesManager.getRequestAttributes();
  //   const sessionAttributes = attributesManager.getSessionAttributes();
  //   const gameInputEvents = ctx.gameInputEvents;
  //   console.log('RollCall::InputHandlerEvent::second_button_checked_in');

  //   ctx.reprompt = ['Please pick a color: green, red, or blue'];
  //   ctx.outputSpeech = [];

  //   if (sessionAttributes.buttonCount === 0) {
  //     // just got both buttons at the same time
  //     ctx.outputSpeech.push('hello buttons 1 and 2');
  //     ctx.outputSpeech.push('<break time=\'1s\'/>');
  //     ctx.outputSpeech.push('Awesome!');

  //     sessionAttributes.DeviceIDs[1] = gameInputEvents[0].gadgetId;
  //     sessionAttributes.DeviceIDs[2] = gameInputEvents[1].gadgetId;

  //   } else {
  //     // already had button 1, just got button 2..
  //     ctx.outputSpeech.push('hello, button 2');
  //     ctx.outputSpeech.push('<break time=\'1s\'/>');
  //     ctx.outputSpeech.push('Awesome. I\'ve registered two buttons.');

  //     if (sessionAttributes.DeviceIDs.indexOf(gameInputEvents[0].gadgetId) === -1) {
  //       sessionAttributes.DeviceIDs[2] = gameInputEvents[0].gadgetId;
  //     } else {
  //       sessionAttributes.DeviceIDs[2] = gameInputEvents[1].gadgetId;
  //     }
  //   }
  //   sessionAttributes.buttonCount = 2;

  //   // .. and ask use to pick a color for the next stage of the skill
  //   ctx.outputSpeech.push('Now let\'s learn about button events.');
  //   ctx.outputSpeech.push('Please select one of the following colors: red, blue, or green.');

  //   let deviceIds = sessionAttributes.DeviceIDs;
  //   deviceIds = deviceIds.slice(-2);

  //   // send an idle animation to registered buttons
  //   ctx.directives.push(
  //     GadgetDirectives.setIdleAnimation(
  //       deviceIds,
  //       BasicAnimations.GetAnimation(ButtonAnimation.RollCallComplete))
  //   );

  //   // reset button press animations until the user chooses a color
  //   ctx.directives.push(
  //     GadgetDirectives.setButtonDownAnimation(
  //       [],
  //       BasicAnimations.GetAnimation(ButtonAnimation.ButtonDown)
  //     )
  //   );

  //   ctx.directives.push(
  //     GadgetDirectives.setButtonUpAnimation(
  //       [],
  //       BasicAnimations.GetAnimation(ButtonAnimation.ButtonUp)
  //     )
  //   );

  //   sessionAttributes.isRollCallComplete = true;
  //   sessionAttributes.state = Settings.SKILL_STATES.PLAY_MODE;

  //   ctx.openMicrophone = true;
  //   return handlerInput.responseBuilder.getResponse();
  // }

  // HandleTimeout(handlerInput: any) {
  //   console.log('rollCallModeIntentHandlers::InputHandlerEvent::timeout');
  //   const { attributesManager } = handlerInput;
  //   const ctx = attributesManager.getRequestAttributes();
  //   const sessionAttributes = attributesManager.getSessionAttributes();

  //   ctx.outputSpeech = ['For this skill we need two buttons.'];
  //   ctx.outputSpeech.push('Would you like more time to press the buttons?');
  //   ctx.reprompt = ['Say yes to go back and add buttons, or no to exit now.'];

  //   let deviceIds = sessionAttributes.DeviceIDs;
  //   deviceIds = deviceIds.slice(-2);

  //   ctx.directives.push(
  //     GadgetDirectives.setIdleAnimation(
  //       deviceIds,
  //       BasicAnimations.GetAnimation(ButtonAnimation.Timeout)
  //     )
  //   );

  //   ctx.directives.push(
  //     GadgetDirectives.setButtonDownAnimation(
  //       deviceIds,
  //       BasicAnimations.GetAnimation(ButtonAnimation.ButtonDown))
  //   );

  //   ctx.directives.push(GadgetDirectives.setButtonUpAnimation(
  //     deviceIds,
  //     BasicAnimations.GetAnimation(ButtonAnimation.ButtonUp))
  //   );

  //   sessionAttributes.expectingEndSkillConfirmation = true;

  //   ctx.openMicrophone = true;
  //   return handlerInput.responseBuilder.getResponse();
  // }

};


// const builder = new RollCallBuilder('MyRollcall');
// builder
//   .WithProxy('peter')
//   .WithProxy('lena');

// const result = builder.Build();

// console.log(JSON.stringify(result, undefined, 2));
