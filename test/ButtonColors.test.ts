// tslint:disable: newline-per-chained-call
// tslint:disable-next-line: no-implicit-dependencies
import { expect } from 'chai';
import { ButtonColor, ButtonColors } from '../src';

describe('ButtonColors', () => {

  it('should get two colors', () => {

    const names = ButtonColors.getRandomColorNames(2);
    expect(names.length).equals(2);

    const colors = ButtonColors.getRandomColors(2);
    expect(colors.length).equals(2);

    const value = ButtonColor.red;
    const convertet = ButtonColors.getColorName(value);
    expect(convertet).equals('red');

    const allColors = ButtonColors.getAllColors();
    expect(allColors.length).equals(11);

    expect(allColors[0]).equals(ButtonColor.white);

  });

});
