import { services } from 'ask-sdk-model';
import { IDirective, IRequestContext, NodeSkill } from 'dotup-ts-node-skills';
import { ObjectTools } from 'dotup-ts-types';
import { AnimationBuilder } from '../Builder/AnimationBuilder';
import { EventsBuilder } from '../Builder/EventsBuilder';
import { GadgetBuilder } from '../Builder/GadgetBuilder';
import { RecognizerBuilder } from '../Builder/RecognizerBuilder';
import { ButtonColor, EventNames, GameState, TriggerEvent } from '../Constants/Enumerations';
import { IEventsObject, IRecognizerObject } from '../Interfaces/IGameEngine';
import { ITurnOrder } from '../Interfaces/ITurnOrder';
import { GameEngineInput } from './GameEngineInput';
import { GameModel } from './GameModel';

/**
 * Nice game
 */
export abstract class AlexaGame<T extends GameModel> extends GameEngineInput {
  private readonly turnOrder: ITurnOrder;
  protected readonly model: T;
  protected readonly context: IRequestContext;
  protected readonly waitToContinueGameDuration: number;

  get state(): GameState {
    return this.model.CurrentGameState;
  }

  constructor(
    context: IRequestContext,
    model: T,
    turnOrder: ITurnOrder,
    waitToContinueGameDuration: number
  ) {
    super();
    this.model = model;
    this.context = context;
    this.turnOrder = turnOrder;
    this.waitToContinueGameDuration = waitToContinueGameDuration;
  }

  abstract Start(): void;

  protected abstract OnEvent(eventName: string, inputEvent: services.gameEngine.InputEvent): void;

  Stop(): void {
    // this.turnOrder.cancelGame();
    this.model.CurrentGameState = GameState.None;
    const id = this.context.request.getSessionAttributes().originatingRequestId;
    this.context.AddDirective(GadgetBuilder.stopInputHandler(id));
    this.context.AddDirective(GadgetBuilder.setLightsOff(this.getAllIds()));
    this.context.shouldEndSession(true);
  }

  ContinueGame(): void {

    switch (this.model.CurrentGameState) {

      case GameState.Completed:
        this.turnOrder.reset();
        this.Start();

        break;

      case GameState.WaitingToContinue:
        this.Start();

        break;

      default:
        console.log('ContinueGame with invalid game state');

    }

  }

  protected getAllIds(): string[] {
    if (this.model.RegisteredButtons === undefined) {
      return this.model.Players.map(
        p => p.buttons.map(b => b.id))
        .reduce((p, c) => {
          p.push(...c);

          return p;
        });
    } else {
      return this.model.RegisteredButtons.map(item => item.id);
    }
  }

  protected InitializeButtonColors(): IDirective[] {
    const ids = this.getAllIds();

    const downLight = GadgetBuilder.setLight(
      ids,
      AnimationBuilder.GetSolidAnimation(1, ButtonColor.black, 1),
      TriggerEvent.buttonDown
    );

    return [downLight];
  }

  // protected validateConfigration(): void {
  //   const r = NodeSkill.requirements;

  //   // Button validation
  //   this.model.Players.forEach(player => {
  //     if (player.buttons.length < r.numberOfButtonsPerButtonGroupMin) {
  //       throw new Error(`you need at least ${r.numberOfButtonsPerButtonGroupMin} registered buttons per player`);
  //     }
  //   });

  //   this.model.Players.forEach(player => {
  //     if (player.buttons.length > r.numberOfButtonsPerButtonGroupMax) {
  //       throw new Error(`you can use a maximum of ${r.numberOfButtonsPerButtonGroupMax} registered buttons per player`);
  //     }
  //   });

  //   // Player validation
  //   if (this.model.Players.length !== this.model.NumberOfPlayer) {
  //     throw new Error('number of players not corret');
  //   }

  //   if (this.model.Players.length > r.numberOfPlayerMax) {
  //     throw new Error(`you can use a maximum of ${r.numberOfPlayerMax} player`);
  //   }

  //   if (this.model.Players.length < r.numberOfPlayerMin) {
  //     throw new Error(`you need at least ${r.numberOfPlayerMin} player`);
  //   }

  //   if (this.model.RoundsToPlay > r.roundsToPlayMax) {
  //     throw new Error(`you can use a maximum of ${r.roundsToPlayMax} rounds to play`);
  //   }

  //   if (this.model.RoundsToPlay < r.roundsToPlayMin) {
  //     throw new Error(`you need at least ${r.roundsToPlayMin} rounds to play`);
  //   }

  // }

  /**
   * Ask player for correct button
   */
  protected Timeout(item: services.gameEngine.InputHandlerEvent): void {

    switch (this.model.CurrentGameState) {

      // We're playing, but it's over. Ask for answer
      case GameState.Playing:
        this.TryStart();
        break;

      // Timeout. answer not given. Handle with WrongAnswer event
      case GameState.WaitingForAnswer:

        // Timeout, that's wrong answer. CALL the event!!
        this.Event(EventNames.WrongAnswer, undefined);
        this.model.CurrentGameState = GameState.WaitingToContinue;
        break;

      case GameState.WaitingToContinue:
      case GameState.Completed:

        this.Stop();
        break;

      default:
    }
  }

  protected TryStart(): void {

    // Game completed?
    if (this.turnOrder.isGameCompleted()) {

      // Say result
      // const result = new LeaderBoard().getRanking(this.model);
      // result.forEach(item => {
      //   this.context.Speak(this.GameText.leaderBoard(item));
      // });

      this.model.CurrentGameState = GameState.Completed;

      // Wait for user input
      this.onGameCompleted();
    } else {
      this.Start();
      // Wait for next player
      // this.waitForNextPlayer();
    }

  }

  protected Event(eventName: string, inputEvent: services.gameEngine.InputEvent): void {

    switch (eventName) {

      case EventNames.Continue:
        this.turnOrder.reset();
        this.Start();

        return;

      case EventNames.Exit:
        this.Stop();

        return;

      default:
        this.OnEvent(eventName, inputEvent);
    }

  }
  // protected Event(eventName: string, inputEvent: services.gameEngine.InputEvent): void {

  //   switch (eventName) {

  //     case EventNames.RightAnswer:
  //       this.context.Speak('richtig');
  //       //        this.turnOrder.addScore(1);

  //       break;

  //     case EventNames.WrongAnswer:
  //       this.context.Speak('falsch');
  //       break;

  //     default:
  //       console.log(eventName);

  //   }
  //   this.Start();
  //   // switch (eventName) {

  //   //   case EventNames.RightAnswer:

  //   //     this.context.Speak(this.GameText.rightAnswer(this.model.CurrentPlayerName));
  //   //     this.turnOrder.addScore(1);

  //   //     break;

  //   //   case EventNames.WrongAnswer:
  //   //     this.OnWrongAnswer();
  //   //     break;

  //   //   case EventNames.Continue:
  //   //     this.turnOrder.reset();
  //   //     this.Start();

  //   //     return;

  //   //   case EventNames.Exit:
  //   //     this.Stop();

  //   //     return;

  //   //   default:
  //   // }

  //   // // Game completed?
  //   // if (this.turnOrder.isGameCompleted()) {

  //   //   // Say result
  //   //   const result = new LeaderBoard().getRanking(this.model);
  //   //   result.forEach(item => {
  //   //     this.context.Speak(this.GameText.leaderBoard(item));
  //   //   });

  //   //   this.model.CurrentGameState = GameState.Completed;

  //   //   // Wait for user input
  //   //   this.waitToContinueGame();
  //   // } else {
  //   //   // Wait for next player
  //   //   this.waitForNextPlayer();
  //   // }

  // }

  /**
   * Analyse the answer. Later do it with Recognizer.
   *
   * One for RightAnswer. type match with correct gadget id.
   * Ans one for WrongAnswer. "type": "deviation" with the two wrong gadget ids.
   */
  // protected ButtonDown(buttonName: string, inputEvent: services.gameEngine.InputEvent): void {
  //   // this.OnButtonDown(buttonName, inputEvent);
  //   console.log(buttonName);

  //   switch (buttonName) {
  //     case GameState.WaitingToContinue:

  //       // Start gameplay
  //       this.Start();

  //       break;
  //     // EventNames.ContinueGame, EventNames.ExitGame
  //     default:
  //   }
  // }

  protected onGameCompleted(): void {
    const result: IDirective[] = [];
    const events: IEventsObject = {};
    const recognizers: IRecognizerObject = {};

    const buttons = this.getAllIds();

    const redOne = buttons.filter((item, index) => index % 2 === 0);

    const greenOne = buttons.filter((item, index) => index % 2 === 1);

    // Get red exit button down recognizer
    recognizers[EventNames.Exit] = RecognizerBuilder.ButtonDown(redOne);

    // Listen for any red exit button)
    ObjectTools.CopyEachSource(EventsBuilder.GetExitEvent(), events);

    // Get green exit button down recognizer
    recognizers[EventNames.Continue] = RecognizerBuilder.ButtonDown(greenOne);

    // Listen for any red exit button)
    ObjectTools.CopyEachSource(EventsBuilder.GetContinueEvent(), events);

    // Add timeout
    const timeOutEvent = EventsBuilder.GetTimeoutEvent();
    ObjectTools.CopyEachSource(timeOutEvent, events);

    // Show red exit button
    redOne.forEach(button => {
      const light = GadgetBuilder.setLight(
        redOne,
        AnimationBuilder.GetSolidAnimation(1, ButtonColor.red, this.waitToContinueGameDuration),
        TriggerEvent.none
      );
      result.push(light);
    });

    // Show green continue button
    greenOne.forEach(button => {
      const light = GadgetBuilder.setLight(
        greenOne,
        AnimationBuilder.GetSolidAnimation(1, ButtonColor.green, this.waitToContinueGameDuration),
        TriggerEvent.none
      );
      result.push(light);
    });

    // Start input handler
    const start = GadgetBuilder.startInputHandler(
      this.waitToContinueGameDuration,
      events,
      () => { this.context.SaveRequestId(); },
      recognizers
    );
    result.push(start);

    // Set result
    this.context.AddDirective(result);

  }

}
