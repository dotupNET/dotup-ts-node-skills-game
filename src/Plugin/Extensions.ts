// tslint:disable: no-submodule-imports
import { IRequestAttributes } from 'dotup-ts-node-skills/dist/Attributes/IRequestAttributes';
import { ISessionAttributes } from 'dotup-ts-node-skills/dist/Attributes/ISessionAttributes';
import { NodeSkill } from 'dotup-ts-node-skills/dist/NodeSkill';
import { IGameRequirements } from '../Interfaces/IGameRequirements';
import { IRollcallModel } from '../Rollcall/IRollcallModel';

declare module 'dotup-ts-node-skills/dist/Attributes/ISessionAttributes' {
  export interface ISessionAttributes {
    rollcall: IRollcallModel;
  }
}

declare module 'dotup-ts-node-skills/dist/Attributes/IRequestAttributes' {
  export interface IRequestAttributes {
    gameRequirements: IGameRequirements;
  }
}

// declare module 'dotup-ts-node-skills/dist/NodeSkill' {
//   export interface NodeSkill {
//     addPersistenceAdapter(adapter: PersistenceAdapter): void;
//   }
// }
