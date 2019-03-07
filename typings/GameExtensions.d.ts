import { IGameRequirements } from '../src/Interfaces/IGameRequirements';
import { IRollcallModel } from '../src/Rollcall/IRollcallModel';

declare module 'dotup-ts-node-skills/dist/Interfaces/ISessionAttributes' {
  interface ISessionAttributes {
    rollcall: IRollcallModel;
  }
}
declare module 'dotup-ts-node-skills/dist/Interfaces/IRequestAttributes' {
  interface IRequestAttributes {
    gameRequirements: IGameRequirements;
  }
}
