import { IGameRequirements } from '../dist/Interfaces/IGameRequirements';
import { IRollcallModel } from '../dist/Rollcall/IRollcallModel';

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
