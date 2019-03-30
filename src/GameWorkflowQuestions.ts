import { IWorkflowQuestion, WorkflowStepState } from 'dotup-ts-node-skills-workflows';
import { GameTextKeys } from './Constants/GameTextKeys';
import { GameModel } from './Game/GameModel';
import { Player } from './Game/Player';
import { WorkflowNames } from './Game/WorkflowNames';

export namespace GameWorkflowQuestions {

  export const numberOfPlayers: IWorkflowQuestion<GameModel> = {
    workflowName: WorkflowNames.GetNumberOfPlayer,
    ask: ctx => ctx.GetText(GameTextKeys.HowManyPlayers),
    reprompt: ctx => ctx.GetText(GameTextKeys.HowManyPlayers),
    askAgain: ctx => ctx.GetText(GameTextKeys.HowManyPlayers),
    handler: {
      GetNumberIntent: (context, wc, slotset) => {
        const r = context.request.getRequestAttributes().gameRequirements;

        let currentStep = wc.getCurrentStep();

        if (slotset.hasValue('numberSlot')) {

          const numberOfPlayer = slotset.getNumber('numberSlot');
          wc.payload.NumberOfPlayer = numberOfPlayer;

          if (isInRange(numberOfPlayer, r.numberOfPlayerMin, r.numberOfPlayerMax)) {

            for (let index = 0; index < numberOfPlayer; index += 1) {
              // Add workflow to get player name
              currentStep = wc.add(WorkflowNames.GetPlayerName, index + 1, currentStep);
            }
            const text = context.t.getPlural(GameTextKeys.SayNumberOfPlayers_0, numberOfPlayer);

            context.Speak(text);
            // context.Speak(`Okay ${numberOfPlayer} Spieler.`);

            return WorkflowStepState.GetFromNext;

          } else {
            context.SpeakT(GameTextKeys.SayNumberBetween_0_And_1, r.numberOfPlayerMin, r.numberOfPlayerMax);

            return WorkflowStepState.GetFromCurrent;
          }

        } else {

          context.SpeakT(GameTextKeys.DidNotUnderstand);

          return WorkflowStepState.GetFromCurrent;
        }

      }
    }
  };

  export const playerNames: IWorkflowQuestion<GameModel> = {
    workflowName: WorkflowNames.GetNumberOfPlayer,
    ask: (context, wc) => context.t.getText(GameTextKeys.Player_0_WhatIsYourName, wc.getCurrentPayload()),
    reprompt: (context, wc) => context.t.getText(GameTextKeys.Player_0_WhatIsYourName, wc.getCurrentPayload()),
    askAgain: (context, wc) => context.t.getText(GameTextKeys.Player_0_WhatIsYourName, wc.getCurrentPayload()),
    handler: {
      GetFirstNameIntent: (context, wc, slotset) => {
        const currentStep = wc.getCurrentStep();

        if (slotset.hasValue('firstName')) {
          const name = slotset.slot('firstName').value;

          // Workflow item completed
          context.SpeakT(GameTextKeys.Player_0_IsCalled_1, currentStep.Payload, name);
          // context.Speak(`Spieler ${currentStep.Payload} heißt ${name}.`);

          // Store player
          if (wc.payload.Players === undefined) {
            wc.payload.Players = [];
          }
          wc.payload.Players.push(new Player(name));

          return WorkflowStepState.GetFromNext;

        } else {
          context.SpeakT(GameTextKeys.DidNotUnderstand);
          // context.Speak('Das habe ich nicht verstanden.');

          return WorkflowStepState.GetFromCurrent;

        }

      }
    }
  };

  export const roundsToPlay: IWorkflowQuestion<GameModel> = {
    workflowName: WorkflowNames.GetRoundToPlay,
    ask: ctx => ctx.GetText(GameTextKeys.HowManyRoundsToPlay),
    reprompt: ctx => ctx.GetText(GameTextKeys.HowManyRoundsToPlay),
    askAgain: ctx => ctx.GetText(GameTextKeys.HowManyRoundsToPlay),
    handler: {
      GetNumberIntent: (context, wc, slotset) => {
        const eineSlot = slotset.getString('eineSlot');

        let value = slotset.getNumber('numberSlot');

        if (Number.isNaN(value)) {
          if (eineSlot === 'eine') {
            value = 1;
          }
        }

        if (value !== undefined) {
          wc.payload.RoundsToPlay = value;
          const text = context.t.getPlural(GameTextKeys.SayRoundsToPlay_0, value);
          context.Speak(text);

          return WorkflowStepState.GetFromNext;

        } else {
          context.SpeakT(GameTextKeys.DidNotUnderstand);

          return WorkflowStepState.GetFromCurrent;
        }

      }
    }
  };

  export const readyToPlay: IWorkflowQuestion<GameModel> = {
    workflowName: WorkflowNames.ReadyToPlay,
    ask: ctx => ctx.GetText(GameTextKeys.ReadyToPlay),
    reprompt: ctx => ctx.GetText(GameTextKeys.ReadyToPlay),
    askAgain: ctx => ctx.GetText(GameTextKeys.ReadyToPlay),
    handler: {
      YesIntent: (context, wc, slotset) => {
        // const modelService = new GameModelService();
        // modelService.save(context);

        return WorkflowStepState.GetFromNext;
      }
      ,
      NoIntent: (context, slotset) => {
        context.SpeakT(GameTextKeys.LeaveGame);
        context.shouldEndSession(true);

        return WorkflowStepState.Error;
      }
    }
  };

  function isInRange(value: number, min: number, max: number): boolean {

    if (value > max) {
      return false;
    }

    if (value < min) {
      return false;
    }

    return true;
  }

}
