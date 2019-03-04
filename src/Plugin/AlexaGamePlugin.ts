import { CustomSkillBuilder } from 'ask-sdk-core';
import { LoggerFactory } from 'dotup-ts-logger';
import { IPlugin } from 'dotup-ts-node-skills';
import { AlexaGameRequestInterceptor } from './AlexaGameRequestInterceptor';
import { IAlexaPluginConfiguration } from './IAlexaGamePluginConfiguration';

export class AlexaGamePlugin implements IPlugin {
  private readonly config: IAlexaPluginConfiguration;

  constructor(config: IAlexaPluginConfiguration) {
    this.config = config;
  }

  initialize(skillBuilder: CustomSkillBuilder): void {
    const logger = LoggerFactory.createLogger('AlexaGamePlugin');
    logger.Info('game plugin initialized', 'initialize');

    const requestInterceptor = new AlexaGameRequestInterceptor(this.config.requirements);
    skillBuilder.addRequestInterceptors(requestInterceptor);
  }

}
