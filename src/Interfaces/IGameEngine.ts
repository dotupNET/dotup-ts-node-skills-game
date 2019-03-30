import { AnchorMode, ButtonActionMode, ButtonMode, EventReportMode, GameEngineDirectives, RecognizerType } from '../Constants/Enumerations';

// tslint:disable:no-reserved-keywords
// tslint:disable:max-line-length
// tslint:disable:no-any
export interface IRecognizerObject {
  [property: string]: IRecognizer;
}

export interface IEventsObjectItem {
  name: string;
  event: IEvents;
}

export interface IEventsObject {
  [property: string]: IEvents;
}

export interface IPatternRecognizerObject {
  [property: string]: IPatternRecognizer;
}

export interface IStartInputHandlerDirective {
  /**
   * Must be set to GameEngine.StartInputHandler
   */
  type: GameEngineDirectives;
  /**
   *  Minimum value: 0. Maximum value: 90,000
   */
  timeout: number;
  /**
   *  Names for unknown gadget IDs to use in recognizers
   */
  proxies?: string[];
  /**
   * Conditions that, at any moment, are either true or false.
   * You use recognizers when you specify the conditions under which your skill
   * is notified of Echo Button input.
   * Minimum number of recognizers: 0 (leave the object empty).
   * Maximum number of recognizers: 20
   */
  recognizers?: IRecognizerObject;
  /**
   * The logic that determines when your skill is notified of Echo Button input.
   * Minimum number of events: 1.
   * Maximum number of events: 32.
   */
  events: IEventsObject;

}

export interface IStopInputHandlerDirective {
  /**
   * Set to GameEngine.StopInputHandler
   */
  type: GameEngineDirectives;
  /**
   * Provides the requestId of the request to which you responded with
   * a StartInputHandler directive.
   */
  originatingRequestId: string;
}

export interface IPattern {
  /**
   * A whitelist of gadgetIds that are eligible for this match.
   */
  gadgetIds?: string[];
  /**
   * A whitelist of colors that are eligible for this match.
   */
  colors?: string[];

  /**
   * The specific action name that must match.
   */
  action?: ButtonActionMode;

  /**
   * The number of times that the specified action must occur to be considered complete.
   */
  repeat?: number;

}

export interface IRecognizer {
  type: RecognizerType;
}

/**
 * Must be set to match.
 */
export interface IPatternRecognizer extends IRecognizer {

  /**
   * Where the pattern must appear in the history of this input handler.
   */
  anchor?: AnchorMode;

  /**
   * When true, the recognizer will ignore additional events that occur between
   * the events specified in the pattern.
   */
  fuzzy?: boolean;

  /**
   * The gadget IDs of the Echo Buttons to consider in this pattern recognizer.
   */
  gadgetIds?: string[];

  /**
   * The actions to consider in this pattern recognizer.All other actions will be ignored.
   */
  actions?: string[];

  /**
   * An object that provides all of the events that need to occur, in a specific order,
   * for this recognizer to be true.Omitting any parameters in this object means "match anything".
   */
  pattern: IPattern[];

}

/**
 * type Must be set to deviation.
 */
export interface IDeviationRecognizer extends IRecognizer {

  /**
   * The name of the recognizer that defines a pattern that must not be deviated from.
   */
  recognizer: string;

}

export interface IProgressRecognizer extends IDeviationRecognizer {
  /**
   * The completion threshold, as a decimal percentage, of the specified recognizer
   * before which this recognizer becomes true
   */
  completion: number;
}

export interface IEvents {
  /**
   * Specifies that this event will be sent when all of the recognizers are true.
   */
  meets: string[];

  /**
   * Specifies that this event will not be sent if any of these recognizers are true.
   */
  fails?: string[];

  /**
   * Specifies what raw button presses to put in the  inputEvents field of the event.
   */
  reports?: EventReportMode;

  /**
   * Whether the Input Handler should end after this event fires.
   * If true, the Input Handler will stop and no further events will be sent to your skill
   * unless you call StartInputHandler again.
   */
  shouldEndInputHandler: boolean;

  /**
   * Enables you to limit the number of times that the skill is notified
   * about the same event during the course of the Input Handler.The default value is 1.
   * This property is mutually exclusive with triggerTimeMilliseconds.
   * Minimum: 1.
   * Maximum: 2, 048.
   */
  maximumInvocations?: number;

  /**
   * Adds a time constraint to the event. Instead of being consideredwhenever a raw button event occurs,
   * an event that has this parameter will only be considered once at triggerTimeMilliseconds
   * after the Input Handler has started.
   * Because a time - triggered event can only fire once, the maximumInvocations value is ignored.
   * Omit this property entirely if you do not want to time - constrain the event.
   * Minimum: 0.
   * Maximum: 300, 000.
   */
  triggerTimeMilliseconds?: number;

}

export interface IInputHandlerEvent {
  /**
   * GameEngine.InputHandlerEvent
   */
  type: string;

  /**
   * Represents a unique identifier for the specific request.
   */
  requestId: string;
  /**
   * Provides the date and time when Alexa sent the request as an ISO 8601 formatted string.
   * Used to verify the request when hosting your skill as a web service.	string
   */
  timestamp: string;
  /**
   * A string indicating the user's locale. For example: en-US.
   */
  locale: string;
  /**
   * The requestId of the request to which your skill responded with a StartInputHandler directive.
   * You should store that requestId to use as a filter here to reject any older stray
   * asynchronous InputHanderEvents that show up after you've started a new Input Handler.
   */
  originatingRequestId: string;
  /**
   * A list of events sent from the Input Handler. Each event that you specify will be sent
   * only once to your skill as it becomes true. Note that in any InputHandlerEvent request
   * one or more events may have become true at the same time.
   */
  events: IInputHandlerEvents[];
}

export interface IInputHandlerEvents {
  /**
   * The name of the event as you defined it in your GameEngine.StartInputHandler directive.
   */
  name: string;
  /**
   * A chronologically ordered report of the raw Button Events that contributed to this Input Handler Event.
   */
  inputEvents: IRawButtonEvent[];

}

export interface IRawButtonEvent {
  /**
   * The permanent identifier of the Echo Button in question.
   * It matches the gadgetId that you will have discovered in roll call.
   */
  gadgetId: string;
  /**
   * The event's original moment of occurrence, in ISO format.
   */
  timestamp: string;
  /**
   * Either "down" for a button pressed or "up" for a button released.
   */
  action: ButtonMode;
  /**
   * The hexadecimal RGB values of the button LED at the time of the event.
   */
  color: string;
  /**
   * For gadgets with multiple features, this is the feature that the event represents.
   * Echo Buttons have one feature only, so this is always press.
   */
  feature: string;

}
