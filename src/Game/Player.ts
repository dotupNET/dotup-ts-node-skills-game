import { JsonSerializable } from 'dotup-ts-json-serializer';
import { IButton } from '../Interfaces/IButton';
import { IPlayer } from '../Interfaces/IPlayer';

@JsonSerializable()
export class Player implements IPlayer {
  constructor(name?: string) {
    if (name !== undefined) {
      this.name = name;
    }
    this.currentRound = 0;
    this.score = 0;
  }
  name: string;
  age?: number;
  buttons?: IButton[];
  score: number;
  currentRound: number;
}
