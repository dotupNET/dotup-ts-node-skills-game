import { ButtonColor } from '../Enumerations';
import { ISequence } from '../Interfaces/IGadgetControler';

export class SequenceBuilder {
  sequences: ISequence[] = [];

  private blend: boolean = true;

  private durationMs: number = 1000;

  color: ButtonColor | string;

  static GetSolid(color: ButtonColor, duration: number): ISequence {
    return {
      blend: false,
      color: color,
      durationMs: duration
    };
  }

  static GetLightsOff(duration: number = 1): ISequence {
    return {
      blend: true,
      color: ButtonColor.off,
      durationMs: duration
    };
  }

  Sequence(sequence: ISequence): SequenceBuilder {
    this.sequences.push(sequence);

    return this;
  }

  Blend(value: boolean): SequenceBuilder {
    this.blend = value;

    return this;
  }

  Color(value: ButtonColor | string): SequenceBuilder {
    this.color = value;

    return this;
  }

  Duration(valueMs: number): SequenceBuilder {
    this.durationMs = valueMs;

    return this;
  }

  Build(): void {
    this.sequences.push({
      blend: this.blend,
      color: this.color,
      durationMs: this.durationMs
    });
  }
}

  //     const x: any;

  //     x
  //       .WithTargets(['id1'])
  //       .WithAnimation('')
  //       .WithAnimation('')
  //       .WithAnimation('')
  // return {
  //   repeat:
  //   targetLights: targetLights

  // export function GetAnimation(buttonAnimation: ButtonAnimation, duration?: number): IAnimation[] {
  //   let animation: IAnimation[];

  //   switch (buttonAnimation) {
  //     case ButtonAnimation.ButtonCheckInDown:
  //       animation = BasicAnimations.SolidAnimation(1, ButtonColors.green, duration || 1000);
  //       break;

  //     case ButtonAnimation.ButtonCheckInIdle:
  //       animation = BasicAnimations.SolidAnimation(1, ButtonColors.green, duration || 8000);
  //       break;

  //     case ButtonAnimation.ButtonCheckInUp:
  //       animation = BasicAnimations.SolidAnimation(1, ButtonColors.white, duration || 4000);
  //       break;

  //     case ButtonAnimation.RollCallComplete:
  //       animation = BasicAnimations.FadeInAnimation(1, ButtonColors.green, duration || 5000);
  //       break;

  //     case ButtonAnimation.ButtonDown:
  //       animation = BasicAnimations.FadeOutAnimation(1, ButtonColors.blue, duration || 500);
  //       break;

  //     case ButtonAnimation.ButtonUp:
  //       animation = BasicAnimations.SolidAnimation(1, ButtonColors.black, duration || 200);
  //       break;

  //     case ButtonAnimation.Timeout:
  //       animation = BasicAnimations.FadeAnimation(ButtonColors.black, duration || 1000);
  //       break;

  //     default:

  //   }

  //   return animation;
  //   // return {
  //   //   targetGadgets: [id],
  //   //   animations: animation
  //   // };
  // }

  // // Solid Animation
  // export function SolidAnimation(repeat: number, color: ButtonColors, duration: number = 500): IAnimation[] {

  //   return [
  //     {
  //       repeat: repeat,
  //       targetLights: targetLights,
  //       sequence: [
  //         {
  //           durationMs: duration,
  //           blend: false,
  //           color: validateColor(color)
  //         }
  //       ]
  //     }
  //   ];
  // }

  // // FadeIn Animation
  // export function FadeAnimation(color: ButtonColors, duration: number = 500): IAnimation[] {
  //   return [
  //     {
  //       repeat: 1,
  //       targetLights: targetLights,
  //       sequence: [
  //         {
  //           durationMs: duration,
  //           blend: true,
  //           color: validateColor(color)
  //         }
  //       ]
  //     }
  //   ];
  // }

  // // FadeIn Animation
  // export function FadeInAnimation(repeats: number, color: ButtonColors, duration: number) {
  //   return [
  //     {
  //       repeat: repeats,
  //       targetLights: targetLights,
  //       sequence: [
  //         {
  //           durationMs: 1,
  //           blend: true,
  //           color: '000000'
  //         }, {
  //           durationMs: duration,
  //           blend: true,
  //           color: validateColor(color)
  //         }
  //       ]
  //     }
  //   ];
  // }

  // // FadeOut Animation
  // export function FadeOutAnimation(repeats: number, color: ButtonColors, duration: number) {

  //   return [
  //     {
  //       repeat: repeats,
  //       targetLights: targetLights,
  //       sequence: [
  //         {
  //           durationMs: duration,
  //           blend: true,
  //           color: validateColor(color)
  //         }, {
  //           durationMs: 1,
  //           blend: true,
  //           color: '000000'
  //         }
  //       ]
  //     }
  //   ];
  // }

  // // CrossFade Animation
  // tslint:disable:max-line-length
  // export function CrossFadeAnimation(repeats: number, colorOne: ButtonColors, colorTwo: ButtonColors, durationOne: number, durationTwo: number) {
  //   // console.log('CrossFadeAnimation');

  //   return [
  //     {
  //       repeat: repeats,
  //       targetLights: targetLights,
  //       sequence: [
  //         {
  //           durationMs: durationOne,
  //           blend: true,
  //           color: validateColor(colorOne)
  //         }, {
  //           durationMs: durationTwo,
  //           blend: true,
  //           color: validateColor(colorTwo)
  //         }
  //       ]
  //     }
  //   ];
  // }

  // export function BreatheAnimation(repeats: number, color: ButtonColors, duration: number) {
  //   // console.log('BreatheAnimation');

  //   return [
  //     {
  //       repeat: repeats,
  //       targetLights: targetLights,
  //       sequence: [
  //         {
  //           durationMs: 1,
  //           blend: true,
  //           color: '000000'
  //         },
  //         {
  //           durationMs: duration,
  //           blend: true,
  //           color: validateColor(color)
  //         },
  //         {
  //           durationMs: 300,
  //           blend: true,
  //           color: validateColor(color)
  //         },
  //         {
  //           durationMs: 300,
  //           blend: true,
  //           color: '000000'
  //         }
  //       ]
  //     }
  //   ];
  // }

  // // Blink Animation
  // export function BlinkAnimation(repeats: number, color: ButtonColors) {
  //   return [
  //     {
  //       repeat: repeats,
  //       targetLights: targetLights,
  //       sequence: [
  //         {
  //           durationMs: 500,
  //           blend: false,
  //           color: validateColor(color)
  //         }, {
  //           durationMs: 500,
  //           blend: false,
  //           color: '000000'
  //         }
  //       ]
  //     }
  //   ];
  // }

  // // Flip Animation
  // export function FlipAnimation(repeats: number, colorOne: ButtonColors, colorTwo: ButtonColors, durationOne: number, durationTwo: number) {
  //   return [
  //     {
  //       repeat: repeats,
  //       targetLights: targetLights,
  //       sequence: [
  //         {
  //           durationMs: durationOne,
  //           blend: false,
  //           color: validateColor(colorOne)
  //         }, {
  //           durationMs: durationTwo,
  //           blend: false,
  //           color: validateColor(colorTwo)
  //         }
  //       ]
  //     }
  //   ];
  // }

  // // Pulse Animation
  // export function PulseAnimation(repeats: number, colorOne: ButtonColors, colorTwo: ButtonColors) {
  //   return [
  //     {
  //       repeat: repeats,
  //       targetLights: targetLights,
  //       sequence: [
  //         {
  //           durationMs: 500,
  //           blend: true,
  //           color: validateColor(colorOne)
  //         }, {
  //           durationMs: 1000,
  //           blend: true,
  //           color: validateColor(colorTwo)
  //         }
  //       ]
  //     }
  //   ];
  // }

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
