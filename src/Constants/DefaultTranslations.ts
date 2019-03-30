import { LanguageDictionary } from 'dotup-ts-internationalization';
import { GameTextKeys } from './GameTextKeys';

export const defaultTranslation: LanguageDictionary<GameTextKeys> = {
  'de-DE': {
    Player_0_IsCalled_1: [
      'Spieler {0} heißt {1}'
    ],
    Player_0_WhatIsYourName: 'Spieler {0} wie ist dein Name?',
    DidNotUnderstand: 'Das habe ich nicht verstanden.',
    HowManyRoundsToPlay: 'Wie viele Runden möchtet ihr spielen?',
    ReadyToPlay: 'Bereit zum spielen?',
    HowManyPlayers: [
      'Wie viele Spieler?',
      'Wie viele Spieler gibt es?',
      'Wie viele Spieler möchten mitspielen?'
    ],
    SayNumberOfPlayers_0:
    {
      plural: {
        one: 'Okay ein Spieler.',
        other: 'Okay # Spieler'
      }
    },
    SayRoundsToPlay_0:
    {
      plural: {
        one: 'Okay eine Runde.',
        other: 'Okay # Runden.'
      }
    },
    LeaveGame: 'Ciao',
    SayNumberBetween_0_And_1: `Sage eine Zahl zwischen {0} und {1}.`
  }
};
