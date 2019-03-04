// tslint:disable:newline-before-return
import { ButtonActionMode, ButtonColor } from '../Enumerations';
import { IPattern } from '../Interfaces/IGameEngine';

export class PatternBuilder {

  private pattern: IPattern = {};

  constructor(action?: ButtonActionMode, repeat?: number) {
    this.pattern.action = action;
    this.pattern.repeat = repeat;
  }

  static ButtonGroupDown(gadgetIds?: string[], colors?: ButtonColor[], repeat: number = 1): IPattern {
    const result: IPattern = {
      action: ButtonActionMode.down,
      repeat: repeat
    };

    if (gadgetIds !== undefined) {
      result.gadgetIds = gadgetIds;
    }

    if (colors !== undefined) {
      result.colors = colors;
    }

    if (gadgetIds !== undefined) {
      result.gadgetIds = gadgetIds;
    }

    return result;
  }

  WithAction(buttonActionMode: ButtonActionMode): PatternBuilder {
    this.pattern.action = buttonActionMode;
    return this;
  }

  WithRepeat(repeat: number): PatternBuilder {
    this.pattern.repeat = repeat;
    return this;
  }

  WithColor(color: string | ButtonColor): PatternBuilder {
    if (this.pattern.colors === undefined) {
      this.pattern.colors = [];
    }
    this.pattern.colors.push(color);
    return this;
  }

  WithGadger(gadgetId: string | string[]): PatternBuilder {
    this.pattern.gadgetIds = Array.isArray(gadgetId) ? gadgetId : [gadgetId];
    return this;
  }

  Build(): IPattern {
    const result = this.pattern;
    this.pattern = {};
    return result;
  }
}

// const builder = new PatternBuilder();
// const x = builder
//   .WithAction(ButtonActionMode.down)
//   .WithGadger('peter');
//   .WithEventName('ButtonAssigned')
//   .ForRecognizer('peter')
//   .ForRecognizer('lena')
//   .FailsWhen('timeout')
//   .Build();

// const y = builder
//   .ForRecognizer('peter')
//   .ForRecognizer('lena')
//   .FailsWhen('timeout')
//   .Build();

// console.log(JSON.stringify(x, undefined, 2));
// console.log(JSON.stringify(y, undefined, 2));

// const all = ObjectTools.CopyEachSource(x, y);
// console.log(JSON.stringify(y, undefined, 2));

// console.log('');
