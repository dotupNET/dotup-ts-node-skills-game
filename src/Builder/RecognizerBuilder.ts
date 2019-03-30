// tslint:disable:newline-before-return
import { AnchorMode, ButtonActionMode, ButtonColor, RecognizerType } from '../Constants/Enumerations';
import { IPattern, IPatternRecognizer, IRecognizer } from '../Interfaces/IGameEngine';

// Define some animations that we'll use during roll call, to be played in various situations,
// such as when buttons "check in" during roll call, or after both buttons were detected.
// See: https://developer.amazon.com/docs/gadget-skills/control-echo-buttons.html#animate

// Define two recognizers that will capture the first time each of two arbitrary buttons is pressed.
//  We'll use proxies to refer to the two different buttons because we don't know ahead of time
//  which two buttons will be used (see: https://developer.amazon.com/docs/gadget-skills/define-echo-button-events.html#proxies)
// The two recogniziers will be used as triggers for two input handler events, used during roll call.
// see: https://developer.amazon.com/docs/gadget-skills/define-echo-button-events.html#recognizers

// Define some animations that we'll use during roll call, to be played in various situations,
// such as when buttons "check in" during roll call, or after both buttons were detected.
// See: https://developer.amazon.com/docs/gadget-skills/control-echo-buttons.html#animate
// Define two recognizers that will capture the first time each of two arbitrary buttons is pressed.
//  We'll use proxies to refer to the two different buttons because we don't know ahead of time
//  which two buttons will be used (see: https://developer.amazon.com/docs/gadget-skills/define-echo-button-events.html#proxies)
// The two recogniziers will be used as triggers for two input handler events, used during roll call.
// see: https://developer.amazon.com/docs/gadget-skills/define-echo-button-events.html#recognizers
export enum RecognizerBuilderMode {
  PatternForEachProxy,
  // RecognizerForEachProxy,
  OnePattern,
  CustomPattern
}

export class RecognizerBuilder {

  constructor(recognizerName?: string, mode: RecognizerBuilderMode = RecognizerBuilderMode.OnePattern) {
    this.recognizerName = recognizerName;
    this.recognizerBuilderMode = mode;
    this.gadgetIds = [];
  }
  private gadgetIds: string[] = [];
  private colors: ButtonColor[];
  // private timeout: number = 10000;
  private action: ButtonActionMode = ButtonActionMode.down;
  private anchor: AnchorMode = AnchorMode.end;
  private fuzzy: boolean = false;
  private recognizerName?: string;
  private recognizerBuilderMode: RecognizerBuilderMode;
  private recognizerType: RecognizerType = RecognizerType.patternRecognizer;

  static ButtonDown(gadgetIds: string | string[], color?: ButtonColor | ButtonColor[]): IRecognizer {
    const rb = new RecognizerBuilder();
    rb
      .WithGadgets(gadgetIds)
      .WithRecognizerBuilderMode(RecognizerBuilderMode.OnePattern)
      .WithFuzzy(true)
      ;

    if (color !== undefined) {
      rb.WithColors(color);
    }
    return rb.Build();
  }

  static ButtonGroupDown(gadgetIds: string | string[]): IRecognizer {
    const rb = new RecognizerBuilder();
    return rb
      .WithGadgets(gadgetIds)
      .WithRecognizerBuilderMode(RecognizerBuilderMode.PatternForEachProxy)
      .WithFuzzy(true)
      .Build();
  }

  WithGadgets(proxyName: string | string[]): RecognizerBuilder {
    if (Array.isArray(proxyName)) {
      this.gadgetIds = this.gadgetIds.concat(proxyName);
    } else {
      this.gadgetIds.push(proxyName);
    }
    return this;
  }

  WithColors(color: ButtonColor | ButtonColor[]): RecognizerBuilder {
    if (Array.isArray(color)) {
      this.colors = color;
    } else {
      this.colors = [];
      this.colors.push(color);
    }
    return this;
  }

  WithName(recognizerName: string): RecognizerBuilder {
    this.recognizerName = recognizerName;
    return this;
  }

  WithRecognizerBuilderMode(mode: RecognizerBuilderMode): RecognizerBuilder {
    this.recognizerBuilderMode = mode;
    return this;
  }

  WithRecognizerType(recognizerType: RecognizerType): RecognizerBuilder {
    this.recognizerType = recognizerType;
    return this;
  }

  WithAction(action: ButtonActionMode): RecognizerBuilder {
    this.action = action;
    return this;
  }

  WithAnchor(anchor: AnchorMode): RecognizerBuilder {
    this.anchor = anchor;
    return this;
  }

  WithFuzzy(fuzzy: boolean): RecognizerBuilder {
    this.fuzzy = fuzzy;
    return this;
  }

  // TODO: remove that shit
  getPattern(gadgetIds: string[], action: ButtonActionMode): IPattern {
    if (this.colors === undefined) {
      return {
        gadgetIds: gadgetIds.slice(),
        action: action
      };
    } else {
      return {
        gadgetIds: gadgetIds.slice(),
        action: action,
        colors: this.colors.slice()
      };
    }
  }

  Build(pattern?: IPattern | IPattern[]): IRecognizer {
    let result: IRecognizer;
    const patternArray = Array.isArray(pattern) ? pattern : [pattern];

    if (pattern !== undefined) {
      this.recognizerBuilderMode = RecognizerBuilderMode.CustomPattern;
    }

    switch (this.recognizerBuilderMode) {
      case RecognizerBuilderMode.OnePattern:
        const onePattern: IPatternRecognizer = {
          type: this.recognizerType,
          fuzzy: this.fuzzy,
          anchor: this.anchor,
          pattern: [this.getPattern(this.gadgetIds, this.action)]
        };

        result = onePattern;

        break;

      case RecognizerBuilderMode.PatternForEachProxy:

        const p = this.gadgetIds.map((proxyName, index) => {
          return this.getPattern([this.gadgetIds[index]], this.action);
        });

        const rrecognizer: IPatternRecognizer = {
          type: RecognizerType.patternRecognizer,
          fuzzy: this.fuzzy,
          anchor: this.anchor,
          pattern: p
        };

        result = rrecognizer;

        // tslint:disable-next-line:switch-final-break
        break;

      case RecognizerBuilderMode.CustomPattern:
        const crecognizer: IPatternRecognizer = {
          type: RecognizerType.patternRecognizer,
          fuzzy: this.fuzzy,
          anchor: this.anchor,
          pattern: patternArray
        };

        if (this.gadgetIds !== undefined && this.gadgetIds.length > 0) {
          crecognizer.gadgetIds = this.gadgetIds;
        }

        if (this.action !== undefined) {
          crecognizer.actions = [this.action];
        }

        result = crecognizer;

      // case RecognizerBuilderMode.RecognizerForEachProxy:

      //   this.gadgetIds.forEach((proxyName, index) => {

      //     const recognizer: IPatternRecognizer = {
      //       type: RecognizerType.patternRecognizer,
      //       fuzzy: this.fuzzy,
      //       anchor: this.anchor,
      //       pattern: [this.getPattern([proxyName], this.action)]
      //     };

      //     result = recognizer;
      //   });

      //   // tslint:disable-next-line:switch-final-break
      //   break;

    }

    this.gadgetIds = [];

    return result;
  }
  // BuildObject(): IRecognizerObject {
  //   const result: IRecognizerObject = {};

  //   switch (this.recognizerBuilderMode) {

  //     case RecognizerBuilderMode.OnePattern:

  //       const onePatternName = this.recognizerName || this.gadgetIds.join('_');
  //       result[onePatternName] = this.Build();

  //       break;

  //     case RecognizerBuilderMode.PatternForEachProxy:

  //       const rname = this.recognizerName || this.gadgetIds.join('_');
  //       result[rname] = this.Build();

  //       break;

  //     case RecognizerBuilderMode.RecognizerForEachProxy:

  //       this.gadgetIds.forEach((proxyName, index) => {

  //         const name = this.recognizerName || proxyName;
  //         const recognizer: IPatternRecognizer = {
  //           type: RecognizerType.patternRecognizer,
  //           fuzzy: this.fuzzy,
  //           anchor: this.anchor,
  //           pattern: [this.getPattern([this.gadgetIds[index]], this.action)]
  //         };

  //         result[name] = recognizer;
  //         // result[`${proxyName}_recognizer`] = recognizer;
  //       });

  //       // tslint:disable-next-line:switch-final-break
  //       break;

  //   }

  //   return result;
  // }
  // Define named events based on the ROLL_CALL_RECOGNIZERS and the built-in "timed out" recognizer
  // to report back to the skill when the first button checks in, when the second button checks in,
  // as well as then the input handler times out, if this happens before two buttons checked in.
  // see: https://developer.amazon.com/docs/gadget-skills/define-echo-button-events.html#define
  // const buttonCheckedIntEvent: IEvents = {
  //   meets: ['roll_call_first_button_recognizer'],
  //   reports: IEventReport.matches,
  //   shouldEndInputHandler: false,
  //   maximumInvocations: 1
  // }
  // const ROLL_CALL_EVENTS = {
  //   first_button_checked_in: {
  //     meets: ['roll_call_first_button_recognizer'],
  //     reports: IEventReport.matches,
  //     shouldEndInputHandler: false,
  //     maximumInvocations: 1
  //   },
  //   second_button_checked_in: {
  //     meets: ['roll_call_second_button_recognizer'],
  //     reports: IEventReport.matches,
  //     shouldEndInputHandler: true,
  //     maximumInvocations: 1
  //   },
  //   timeout: {
  //     meets: ['timed out'],
  //     reports: IEventReport.history,
  //     shouldEndInputHandler: true
  //   }
  // };

}

// const builder = new RecognizerBuilder('done', RecognizerBuilderMode.PatternForEachProxy);
// const x = builder
//   .WithProxy('Lena')
//   .WithProxy('Peter')
//   .Build();

// console.log(JSON.stringify(x, undefined, 2));
