import { ButtonColor, ButtonColors } from '../src';

describe('ButtonColors', () => {

  it('should get two colors', () => {

    const names = ButtonColors.getRandomColorNames(2);
    expect(names.length)
      .toBe(2);

    const colors = ButtonColors.getRandomColors(2);
    expect(colors.length)
      .toBe(2);

    const value = ButtonColor.red;
    const convertet = ButtonColors.getColorName(value);
    expect(convertet === 'red')
      .toBeTruthy();

    const allColors = ButtonColors.getAllColors();
    expect(allColors.length)
      .toBe(11);

    expect(allColors[0] === ButtonColor.white)
      .toBeTruthy();

  });

});
