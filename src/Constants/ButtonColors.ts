import { ButtonColor, ColorTranslation } from './Enumerations';

// tslint:disable
export namespace ButtonColors {

  export function getAllColors(): ButtonColor[] {
    const f = Object.getOwnPropertyNames(ButtonColor);
    const result = f.map<ButtonColor>(item => {
      const typedColorString = <keyof typeof ButtonColor>item;
      return ButtonColor[typedColorString];
    });

    return result;
  }

  export function getRandomColorName(): ButtonColor {
    const f = Object.getOwnPropertyNames(ButtonColors);
    const key = f[Math.floor(Math.random() * f.length)];
    const typedColorString = <keyof typeof ButtonColor>key;

    return ButtonColor[typedColorString];
  }

  export function getRandomColorNames(count: number = 1): string[] {
    const f = Object.getOwnPropertyNames(ButtonColor);

    const result: string[] = [];
    while (result.length < count) {

      const key = f[Math.floor(Math.random() * f.length)];

      if (!result.find(item => item === key)) {
        result.push(key);
      }
    }

    return result;
  }

  export function getUniqueRandomColors(count: number = 1, excludedColors: ButtonColor[] = []): ButtonColor[] {
    const f = Object.getOwnPropertyNames(ButtonColor);

    if (count > f.length) {
      throw new Error('not enough colors');
    }

    const result: ButtonColor[] = [];
    while (result.length < count) {

      const key = f[Math.floor(Math.random() * f.length)];
      const typedColorString = <keyof typeof ButtonColor>key;
      const nextColor = ButtonColor[typedColorString];

      if (!result.find(item => item === nextColor) && !excludedColors.find(item => item === nextColor)) {
        result.push(nextColor);
      }
    }

    return result;
  }

  export function getRandomColors(count: number = 1, excludedColors: ButtonColor[] = []): ButtonColor[] {
    const f = Object.getOwnPropertyNames(ButtonColor);

    const result: ButtonColor[] = [];
    while (result.length < count) {

      const key = f[Math.floor(Math.random() * f.length)];
      const typedColorString = <keyof typeof ButtonColor>key;
      const nextColor = ButtonColor[typedColorString];

      if (!excludedColors.find(item => item === nextColor)) {
        result.push(nextColor);
      }
    }

    return result;
  }

  export function getColorName(value: string): string {
    const f = Object.getOwnPropertyNames(ButtonColor);

    const corecctKey = <keyof typeof ButtonColor>f.find(key => {
      return ButtonColor[<keyof typeof ButtonColor>key] === value;
    });

    return corecctKey;
  }

  export function getTranslation(color: ButtonColor): string {
    const name = <keyof typeof ColorTranslation>getColorName(color);
    const result = ColorTranslation[name];

    return result;
  }

}
