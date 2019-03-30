import { GameState, TurnOrderMode } from '../Constants/Enumerations';
import { IGameModel } from '../Interfaces/IGameModel';
import { ITurnOrder } from '../Interfaces/ITurnOrder';

export class RoundTurnOrder implements ITurnOrder {
  protected model: IGameModel;

  constructor(model: IGameModel, turnOrderMode: TurnOrderMode = TurnOrderMode.Clockwise) {
    this.model = model;
    if (turnOrderMode !== TurnOrderMode.Clockwise) {
      throw new Error('wrong TurnOrderMode');
    }
  }

  nextRound() {
    this.model.CurrentRound += 1;
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

  addScore(value: number, playerName: string): void {
    const current = this.model.Players.find(item => item.name === playerName);
    if (current === undefined) {
      throw new Error('player not found');
    } else {
      current.score += value;
    }
  }

  isGameCompleted(): boolean {

    // All rounds played?
    if (this.model.CurrentRound >= this.model.RoundsToPlay) {
      // this.model.CurrentGameState = GameState.Completed;

      return true;
    } else {
      // Next round
      return false;
    }

  }

}
