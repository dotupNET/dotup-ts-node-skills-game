import { HandlerInput, RequestInterceptor } from 'ask-sdk-core';
import { LoggerFactory } from 'dotup-ts-logger';
import { IRequestAttributes, ISessionAttributes } from 'dotup-ts-node-skills';
import { IGameRequirements } from '../Interfaces/IGameRequirements';
import { RollcallMode } from '../Rollcall/RollcallMode';
import { RollcallState } from '../Rollcall/RollcallState';

export class AlexaGameRequestInterceptor implements RequestInterceptor {
  private readonly logger = LoggerFactory.createLogger('AlexaGameRequestInterceptor');
  private readonly gameRequirements: IGameRequirements;

  constructor(gameRequirements: IGameRequirements) {
    this.logger.Info('AlexaGameRequestInterceptor activated', 'ctor');
    this.gameRequirements = gameRequirements;
  }

  async process(handlerInput: HandlerInput): Promise<void> {

    // Request - Game requirements
    const requestAttributes = <IRequestAttributes>handlerInput.attributesManager.getSessionAttributes();
    requestAttributes.gameRequirements = this.gameRequirements;

    // Session - Create Rollcall model
    const sessionAttributes = <ISessionAttributes>handlerInput.attributesManager.getSessionAttributes();

    if (sessionAttributes.rollcall === undefined) {
      sessionAttributes.rollcall = {
        name: 'rollcall',
        state: RollcallState.None
      };

      switch (this.gameRequirements.rollcallMode) {

        case RollcallMode.AssignToPlayer:
          sessionAttributes.rollcall.rollcallButtonGroups = [];
          break;

        case RollcallMode.PressToRegister:
          sessionAttributes.rollcall.rollcallButtons = [];
          break;

        default:
      }
    }
  }
}

/**
 * If IRequestAttributes.persistentAttributes not is undefined, the data ist stored
 * with the configured persistence adapter
 */
// export class SaveAttributesInterceptor implements ResponseInterceptor<HandlerInput, Response> {
//   private readonly logger = LoggerFactory.createLogger('SaveAttributesInterceptor');

//   constructor() {
//     this.logger.Info('SaveAttributesInterceptor activated', 'ctor');
//   }

//   async process(input: HandlerInput, response?: Response): Promise<void> {

//     // Presistent session attributes
//     const r = <IRequestAttributes>input.attributesManager.getRequestAttributes();

//     if (r.savePersistentAttributes && r.persistentAttributes !== undefined) {
//       Object.keys(r.persistentAttributes)
//         .forEach(item => {
//           input.attributesManager.setPersistentAttributes({ [item]: r.persistentAttributes[item] });
//         });
//       await input.attributesManager.savePersistentAttributes();
//       this.logger.Debug('Persistent attributes saved', 'process');
//     }
//   }

// }
