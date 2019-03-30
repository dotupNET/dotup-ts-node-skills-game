import { ButtonColor } from '../Constants/Enumerations';
import { IAnimation, ISequence } from '../Interfaces/IGadgetControler';

const targetLights: string[] = ['1'];

export class AnimationBuilder {
  sequences: ISequence[] = [];

  private repeat: number = 1;

  // FadeIn Animation
  static GetFadeInAnimation(repeats: number, color: ButtonColor, duration: number): IAnimation {
    return {
      repeat: repeats,
      targetLights: targetLights,
      sequence: [
        {
          durationMs: 1,
          blend: true,
          color: '000000'
        }, {
          durationMs: duration,
          blend: true,
          color: color
        }
      ]
    };
  }

  static GetAnimation(repeat: number, sequences: ISequence[]): IAnimation {
    return {
      repeat: repeat,
      targetLights: targetLights,
      sequence: sequences
    };
  }

  // Solid Animation
  static GetSolidAnimation(repeat: number, color: ButtonColor, duration: number = 500): IAnimation {
    return {
      repeat: repeat,
      targetLights: targetLights,
      sequence: [
        {
          durationMs: duration,
          blend: false,
          color: color
        }
      ]
    };
  }

  // FadeIn Animation
  static GetFadeAnimation(color: ButtonColor, duration: number = 500): IAnimation {
    return {
      repeat: 1,
      targetLights: targetLights,
      sequence: [
        {
          durationMs: duration,
          blend: true,
          color: color
        }
      ]
    };
  }

  // FadeOut Animation
  static GetFadeOutAnimation(repeats: number, color: ButtonColor, duration: number): IAnimation {

    return {
      repeat: repeats,
      targetLights: targetLights,
      sequence: [
        {
          durationMs: duration,
          blend: true,
          color: color
        }, {
          durationMs: 1,
          blend: true,
          color: '000000'
        }
      ]
    };
  }

  // CrossFade Animation
  // tslint:disable-next-line:max-line-length
  static GetCrossFadeAnimation(repeats: number, color1: ButtonColor, color2: ButtonColor, duration1: number, duration2: number): IAnimation {
    return {
      repeat: repeats,
      targetLights: targetLights,
      sequence: [
        {
          durationMs: duration1,
          blend: true,
          color: color1
        }, {
          durationMs: duration2,
          blend: true,
          color: color2
        }
      ]
    };
  }

  static GetBreatheAnimation(repeats: number, color: ButtonColor, duration: number): IAnimation {
    return {
      repeat: repeats,
      targetLights: targetLights,
      sequence: [
        {
          durationMs: 1,
          blend: true,
          color: '000000'
        },
        {
          durationMs: duration,
          blend: true,
          color: color
        },
        {
          durationMs: 300,
          blend: true,
          color: color
        },
        {
          durationMs: 300,
          blend: true,
          color: '000000'
        }
      ]
    };
  }

  // Blink Animation
  static GetBlinkAnimation(repeats: number, color: ButtonColor): IAnimation {
    return {
      repeat: repeats,
      targetLights: targetLights,
      sequence: [
        {
          durationMs: 500,
          blend: false,
          color: color
        }, {
          durationMs: 500,
          blend: false,
          color: '000000'
        }
      ]
    };
  }

  // Flip Animation
  // tslint:disable-next-line:max-line-length
  static GetFlipAnimation(repeats: number, color1: ButtonColor, color2: ButtonColor, duration1: number, duration2: number): IAnimation {
    return {
      repeat: repeats,
      targetLights: targetLights,
      sequence: [
        {
          durationMs: duration1,
          blend: false,
          color: color1
        }, {
          durationMs: duration2,
          blend: false,
          color: color2
        }
      ]
    };
  }

  // Pulse Animation
  static GetPulseAnimation(repeats: number, color1: ButtonColor, color2: ButtonColor): IAnimation {
    return {
      repeat: repeats,
      targetLights: targetLights,
      sequence: [
        {
          durationMs: 500,
          blend: true,
          color: color1
        }, {
          durationMs: 1000,
          blend: true,
          color: color2
        }
      ]
    };
  }

  Repeat(value: number): AnimationBuilder {
    this.repeat = value;

    return this;
  }

  Sequence(sequence: ISequence | ISequence[]): AnimationBuilder {
    if (Array.isArray(sequence)) {
      this.sequences = this.sequences.concat(sequence);
    } else {
      this.sequences.push(sequence);
    }

    return this;
  }

  Build(): IAnimation {
    return {
      repeat: this.repeat,
      sequence: this.sequences,
      targetLights: targetLights
    };
  }
}

  // // Function to validate the color argument passed. If it's a color name,
  // // it compares it to the list of colors defined in the colorList.js,
  // // and returns back the Hex code if applicable.
  // function validateColor(requestedColor: ButtonColors) {
  //   const color = requestedColor || '';
  //   if (color.indexOf('0x') === 0) {
  //     return color.substring(2);
  //   } else if (color.indexOf('#') === 0) {
  //     return color.substring(1);
  //   } else {
  //     return requestedColor;
  //   }
  // }
