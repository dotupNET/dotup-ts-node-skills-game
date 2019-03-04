import { GameModel } from '../Game/GameModel';
import { LeaderBoardItem } from './LeaderBoardItem';

export class LeaderBoard {
  getRanking(gameModel: GameModel): LeaderBoardItem[] {
    return gameModel.Players
      .sort((a, b) => b.score - a.score)
      .map(item => {
        const result = new LeaderBoardItem();
        result.playerName = item.name;
        result.score = item.score;

        return result;
      });
  }
}
