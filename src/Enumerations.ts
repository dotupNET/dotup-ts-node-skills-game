// tslint:disable:no-reserved-keywords
// tslint:disable:max-line-length
// tslint:disable:no-any

export enum GameEngineRecognizer {
  RightAnswer = 'RightAnswer',
  WrongAnswer = 'WrongAnswer'
}

export enum EventNames {
  ButtonDown = 'ButtonDown',
  ButtonUp = 'ButtonUp',
  Timeout = 'Timeout',
  RightAnswer = 'RightAnswer',
  WrongAnswer = 'WrongAnswer',
  Continue = 'Continue',
  Exit = 'Exit',
  ButtonGroupPressed = 'ButtonGroupPressed'
}

export enum ButtonMode {
  down = 'down',  // button pressed
  up = 'up' // button released
}

export enum GameEngineDirectives {
  // Sends Alexa a command to configure Echo Button events and start the Input Handler, which translates button presses into Echo Button events.
  StartInputHandler = 'GameEngine.StartInputHandler',
  // Sends Alexa a command to stop sending Echo Button press events to your skill.
  StopInputHandler = 'GameEngine.StopInputHandler'
}

export enum RecognizerType {
  /**
   * match
   */
  patternRecognizer = 'match',
  /**
   * deviation
   */
  deviationRecognizer = 'deviation',
  /**
   * progress
   */
  progressRecognizer = 'progress'

}

export enum AnchorMode {
  start = 'start', // (Default) The first event in the pattern must be the first event in the history of raw Echo Button events.
  end = 'end', // The last event in the pattern must be the last event in the history of raw Echo Button events.
  anywhere = 'anywhere' // The pattern may appear anywhere in the history of raw Echo Button events.
}

export enum ButtonActionMode {
  /**
   * A button is pressed down.
   */
  down = 'down',
  /**
   * A button is released.
   */
  up = 'up'
}

export enum EventReportMode {
  history = 'history', // All button presses since this Input Handler was started.
  matches = 'matches', // Just the button presses that contributed to this event (that is, were in the recognizers).
  nothing = 'nothing' // The inputEvents list will be empty.
}

export enum TriggerEvent {
  buttonDown = 'buttonDown', // Play the animation when the button is pressed.
  buttonUp = 'buttonUp', // Play the animation when the button is released.
  none = 'none' // Play the animation as soon as it arrives.
}

export enum GameState {
  None = 'none',
  Playing = 'Playing',
  WaitingForAnswer = 'WaitingForAnswer',
  WaitingToContinue = 'WaitingToContinue',
  Completed = 'Completed'
}

export enum TurnOrderMode {
  Clockwise,
  ClockwisePlayer,
  AntiClockwise,
  Shuffle,
  LowerScoreFirst,
  HigherScoreFirst
}

export enum ButtonColor {
  white = 'FFFFFF',
  red = 'FF0000',
  orange = 'FF3300',
  green = '00FF00',
  darkGreen = '004411',
  blue = '0000FF',
  lightBlue = '00A0B0',
  purple = '4B0098',
  yellow = 'FFD400',
  black = '000000',
  off = '000000'
}

export enum ColorTranslation {
  white = 'weiß',
  red = 'rot',
  orange = 'orange',
  green = 'grün',
  darkGreen = 'dunkelgrün',
  blue = 'blau',
  lightBlue = 'hellblau',
  purple = 'lila',
  yellow = 'gelb',
  black = 'schwarz'
}
