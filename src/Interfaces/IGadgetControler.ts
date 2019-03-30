// tslint:disable:no-reserved-keywords
import { IDirective } from 'dotup-ts-node-skills';
import { TriggerEvent } from '../Constants/Enumerations';

/**
 * type: string; Must be set to GadgetController.SetLight.
 */
export interface IGadgetControllerDirectives extends IDirective {

  /**
   * The version of the directive. Must be set to 1.
   */
  version: string;
  /**
   * The gadget IDs that will receive the command. An empty array,
   * or leaving this parameter out, signifies that all gadgets will receive the command.
   */
  targetGadgets?: string[];
  /**
   * Arguments that pertain to animating the buttons.
   */
  parameters: IParameters;

}

export interface IParameters {
  /**
   * The action that triggers the animation.
   * You can send three directives to a single Echo Button simultaneously to populate
   * each of the trigger events, but each subsequent command to the same Echo Button
   * that addresses the same trigger event overwrites the one that you previously set.
   */
  triggerEvent: TriggerEvent;

  /**
   * The delay in milliseconds to wait after the trigger event before playing the animation.
   * Minimum: 0.
   * Maximum: 65, 535.
   */
  triggerEventTimeMs: number;

  /**
   * One animation.An animation contains one or more sequences of instructions to be performed
   * in a specific order. (An animation can contain multiple sequences, but there can be only
   * one animation per SetLight directive.)
   */
  animations: IAnimation[];

}

export interface IAnimation {
  /**
   * The number of times to play this animation.
   * Minimum: 0.
   * Maximum: 255.
   */
  repeat: number;

  /**
   * An array of strings that represent the light addresses on the target gadgets that this animation will be applied to.
   * Because the Echo Button has one light only, use ["1"] to signify that this animation should be sent to light one.
   */
  targetLights: string[];

  /**
   * The animation steps to render in order. The maximum number of steps that you can define
   * depends on the number of target gadgets that you specify.
   *
   * To calculate the maximum number of steps that you can include in the sequence array
   * for a given trigger, use the following formula:
   * maxStepsPerSequence = 38 - numberOfTargetGadgetsSpecified * 3
   *
   * For example, if you want to send animations to all buttons, you can send a maximum of 38 steps.
   * If you specify one target button, then you can send at most 35 steps, and so on.
   * The minimum number of steps is 0 (though a zero-step animation sets the animation for that
   * trigger to blank, clearing any animation that is currently set for that trigger).
   */
  sequence: ISequence[];
}

export interface ISequence {
  /**
   * The duration in milliseconds to render this step. Minimum: 1. Maximum: 65,535.
   */
  durationMs: number;
  /**
   * The color to render specified in RGB hexadecimal values. There are a number of Node.js
   * libraries available for working with color.
   * Remember to remove the # after you convert the value to hexadecimal.
   *
   * Due to the limitations of the hardware, some colors do not look as expected when rendered
   * on Echo Buttons. You may need to experiment to find colors that work well with your skill.
   * For examples of how colors might appear when rendered on Echo Buttons, see Echo Button
   * Animations.
   */
  color: string;

  /**
   * A boolean that indicates whether to interpolate from the previous color into this one over
   * the course of this directive's durationMs
   */
  blend: boolean;
}
