import { CustomSkillBuilder } from 'ask-sdk-core';
import { LanguageEnum, TextLibrary } from 'dotup-ts-internationalization';
import { LoggerFactory } from 'dotup-ts-logger';
import { IPlugin } from 'dotup-ts-node-skills';
import { defaultTranslation, GameTextKeys } from '../Constants';
import { AlexaGameRequestInterceptor } from './AlexaGameRequestInterceptor';
import { IAlexaPluginConfiguration } from './IAlexaGamePluginConfiguration';

export class AlexaGamePlugin implements IPlugin {
  private readonly config: IAlexaPluginConfiguration;

  constructor(config: IAlexaPluginConfiguration) {
    this.config = config;
  }

  initialize(skillBuilder: CustomSkillBuilder, textLibrary: TextLibrary<GameTextKeys>): void {
    const logger = LoggerFactory.createLogger('AlexaGamePlugin');
    logger.Info('game plugin initialized', 'initialize');

    // Add interceptor for game handling
    const requestInterceptor = new AlexaGameRequestInterceptor(this.config.requirements);
    skillBuilder.addRequestInterceptors(requestInterceptor);

    // Add default text
    const languages = Object.keys(defaultTranslation);
    languages.forEach(l => textLibrary.addTranslations(<LanguageEnum>l, defaultTranslation[<LanguageEnum>l]));
  }

}
