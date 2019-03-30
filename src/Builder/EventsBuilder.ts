// tslint:disable:newline-before-return
import { EventNames, EventReportMode } from '../Constants/Enumerations';
import { IEvents, IEventsObject } from '../Interfaces/IGameEngine';

export class EventsBuilder {

  constructor() {
    this.event.shouldEndInputHandler = false;
    this.event.maximumInvocations = 1;
  }

  private meets: string[] = [];

  private fails?: string[];

  // tslint:disable-next-line:no-any
  private event: IEvents = <any>{};
  private eventName: string;

  static GetButtonDown(recognizerName: string, shouldEndInputHandler: boolean = true): IEventsObject {
    const eb = new EventsBuilder();
    return eb
      .WithEventName(`${EventNames.ButtonDown}_${recognizerName}`)
      .ForRecognizer(recognizerName)
      .MaximumInvocations(1)
      .ShouldEndInputHandler(shouldEndInputHandler)
      .ReportMode(EventReportMode.matches)
      .BuildObject();
  }

  static GetButtonGroupDown(recognizerName: string, shouldEndInputHandler: boolean = true): IEventsObject {
    const eb = new EventsBuilder();
    return eb
      .WithEventName(`${EventNames.ButtonGroupPressed}_${recognizerName}`)
      .ForRecognizer(recognizerName)
      .MaximumInvocations(1)
      .ShouldEndInputHandler(shouldEndInputHandler)
      .ReportMode(EventReportMode.matches)
      .BuildObject();
  }

  static GetContinueEvent(): IEventsObject {
    return new EventsBuilder()
      .WithEventName(EventNames.Continue)
      .ForRecognizer(EventNames.Continue)
      .FailsWhen(EventNames.Exit)
      .ReportMode(EventReportMode.nothing)
      .ShouldEndInputHandler(true)
      .BuildObject();
  }

  static GetExitEvent(): IEventsObject {
    return new EventsBuilder()
      .WithEventName(EventNames.Exit)
      .ForRecognizer(EventNames.Exit)
      .FailsWhen(EventNames.Continue)
      .ReportMode(EventReportMode.nothing)
      .ShouldEndInputHandler(true)
      .BuildObject();
  }

  static GetRightAnswerEvent(): IEventsObject {
    return new EventsBuilder()
      .WithEventName(EventNames.RightAnswer)
      .ForRecognizer(EventNames.RightAnswer)
      .FailsWhen(EventNames.WrongAnswer)
      .ReportMode(EventReportMode.nothing)
      .ShouldEndInputHandler(true)
      .BuildObject();
  }

  static GetWrongAnswerEvent(): IEventsObject {
    return new EventsBuilder()
      .WithEventName(EventNames.WrongAnswer)
      .ForRecognizer(EventNames.WrongAnswer)
      .ReportMode(EventReportMode.nothing)
      .ShouldEndInputHandler(true)
      .BuildObject();
  }

  static GetTimeoutEvent(): IEventsObject {
    return new EventsBuilder()
      .WithEventName(EventNames.Timeout)
      .ForRecognizer('timed out')
      .ReportMode(EventReportMode.history)
      .ShouldEndInputHandler(true)
      .BuildObject();
  }

  WithEventName(eventName: string): EventsBuilder {
    this.eventName = eventName;
    return this;
  }

  ForRecognizer(recognizerName: string): EventsBuilder {
    this.meets.push(recognizerName);
    return this;
  }

  ReportMode(value: EventReportMode): EventsBuilder {
    this.event.reports = value;
    return this;
  }

  TriggerTimeMilliseconds(value: number): EventsBuilder {
    this.event.triggerTimeMilliseconds = value;
    this.event.maximumInvocations = undefined;
    return this;
  }

  MaximumInvocations(value: number): EventsBuilder {
    this.event.maximumInvocations = value;
    return this;
  }

  FailsWhen(recognizerName: string): EventsBuilder {
    if (this.fails === undefined) {
      this.fails = [];
    }
    this.fails.push(recognizerName);
    return this;
  }

  ShouldEndInputHandler(shouldEndInputHandler: boolean): EventsBuilder {
    this.event.shouldEndInputHandler = shouldEndInputHandler;
    return this;
  }

  BuildObject(): IEventsObject {
    return {
      [this.eventName]: this.Build()
    };
  }

  Build(): IEvents {
    this.event.meets = this.meets;
    if (this.fails !== undefined) {
      this.event.fails = this.fails;
    }

    if (this.eventName !== undefined) {
      this.eventName = this.meets.join('_');
    }

    const result = this.event;

    // Maybe not the best style
    this.meets = [];
    delete this.fails;
    delete this.eventName;
    // tslint:disable-next-line:no-any
    this.event = <any>{};

    return result;
  }
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

// const builder = new EventsBuilder();
// const x = builder
//   .WithEventName('ButtonAssigned')
//   .ForRecognizer('peter')
//   .ForRecognizer('lena')
//   .Build();

// const y = builder
//   .ForRecognizer('peter')
//   .ForRecognizer('lena')
//   .FailsWhen('timeout')
//   .Build();

// console.log(JSON.stringify(x, undefined, 2));
// console.log(JSON.stringify(y, undefined, 2));

// console.log('');
