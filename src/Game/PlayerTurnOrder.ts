import { GameState, TurnOrderMode } from '../Constants/Enumerations';
import { IGameModel } from '../Interfaces/IGameModel';
import { IPlayer } from '../Interfaces/IPlayer';
import { ITurnOrder } from '../Interfaces/ITurnOrder';

export class PlayerTurnOrder implements ITurnOrder {
  protected model: IGameModel;

  constructor(model: IGameModel, turnOrderMode: TurnOrderMode = TurnOrderMode.Clockwise) {
    this.model = model;
    if (turnOrderMode !== TurnOrderMode.ClockwisePlayer) {
      throw new Error('wrong TurnOrderMode');
    }
  }

  reset(): void {
    this.model.CurrentGameState = GameState.None;
    this.model.CurrentPlayerName = undefined;
    this.model.CurrentRound = 0;
    this.model.Players.forEach(player => {
      player.currentRound = 0;
      player.score = 0;
    });
  }

  // cancelGame(): void {
  //   this.model.CurrentGameState = GameState.Completed;
  // }

  getCurrentPlayer(): IPlayer {
    return this.model.Players.find(item => item.name === this.model.CurrentPlayerName);
  }

  peekNextPlayer(): IPlayer {
    const nextIndex = this.getNextClockwiseIndex();

    if (this.isGameCompleted()) {
      return undefined;
    } else {
      return this.model.Players[nextIndex];
    }
  }

  getNextPlayer(): IPlayer {
    if (this.model.CurrentPlayerName === undefined || this.model.CurrentPlayerName === '') {
      return this.changePlayer(0);
    } else {
      return this.changePlayer(this.getNextClockwiseIndex());
    }
  }

  addScore(value: number) {
    const current = this.getCurrentPlayer();
    if (current === undefined) {
      throw new Error('no current player');
    }

    current.score += value;
  }

  isGameCompleted(): boolean {
    if (this.allPassedCurrentRound()) {

      // All rounds played?
      if (this.model.CurrentRound >= this.model.RoundsToPlay) {
        // this.model.CurrentGameState = GameState.Completed;

        return true;
      } else {
        // Next round
        return false;
      }

    } else {
      return false;
    }
  }

  private changePlayer(nextIndex: number): IPlayer {

    // Update game rounds
    if (this.allPassedCurrentRound()) {

      // All rounds played?
      if (this.model.CurrentRound >= this.model.RoundsToPlay) {
        // this.model.CurrentGameState = GameState.Completed;

        return undefined;
      } else {
        // Next round
        this.model.CurrentRound += 1;
      }

    }

    // Game is on, return next player
    const nextPlayer = this.model.Players[nextIndex];

    // Update Player
    nextPlayer.currentRound = this.model.CurrentRound;

    // Update round
    this.model.CurrentPlayerName = nextPlayer.name;
    // this.model.CurrentGameState = GameState.Playing;

  }

  allPassedCurrentRound(): boolean {
    return this.model.Players.every(player => player.currentRound === this.model.CurrentRound);
  }

  private getNextClockwiseIndex(): number {
    const arr = this.model.Players.map(i => i.name);
    const indexOfCurrentPlayer = arr.indexOf(this.model.CurrentPlayerName);

    return indexOfCurrentPlayer >= arr.length - 1 ? 0 : indexOfCurrentPlayer + 1;
  }

}
