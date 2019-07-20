import { createSelector } from 'reselect';

import { selectMessage } from 'i18n/selectors';

const selectState = (state) => state;
const selectRoot = (state) => state.walkthrough;

export const selectShowWalkthrough = createSelector(
  selectRoot,
  ({ showWalkthrough }) => showWalkthrough
);

export const selectTranslations = createSelector(
  selectState,
  (state) => ({
    back: selectMessage(state, { id: 'modules.walkthrough.back' }),
    board: selectMessage(state, { id: 'modules.board.label' }),
    boardExplanation: selectMessage(state, { id: 'modules.walkthrough.explanation.board' }),
    close: selectMessage(state, { id: 'modules.walkthrough.close' }),
    configSetting: selectMessage(state, { id: 'modules.config.config' }),
    configSettingExplanation: selectMessage(state, { id: 'modules.walkthrough.explanation.config-setting' }),
    dictionaryFind: selectMessage(state, { id: 'modules.dictionary.input.label' }),
    dictionaryFindExplanation: selectMessage(state, { id: 'modules.walkthrough.explanation.word-input-definition' }),
    dictionaryResults: selectMessage(state, { id: 'modules.dictionary.output.label' }),
    dictionaryResultsExplanation: selectMessage(state, { id: 'modules.walkthrough.explanation.word-definition' }),
    last: selectMessage(state, { id: 'modules.walkthrough.last' }),
    localeSetting: selectMessage(state, { id: 'modules.config.locale' }),
    localeSettingExplanation: selectMessage(state, { id: 'modules.walkthrough.explanation.locale-setting' }),
    next: selectMessage(state, { id: 'modules.walkthrough.next' }),
    remainingTiles: selectMessage(state, { id: 'modules.remaining-tiles.label-clean' }),
    remainingTilesExplanation: selectMessage(state, { id: 'modules.walkthrough.explanation.remaining-tiles' }),
    results: selectMessage(state, { id: 'modules.results.list' }),
    resultsExplanation: selectMessage(state, { id: 'modules.walkthrough.explanation.results' }),
    skip: selectMessage(state, { id: 'modules.walkthrough.skip' }),
    tiles: selectMessage(state, { id: 'modules.results.list.tiles' }),
    tilesExplanation: selectMessage(state, { id: 'modules.walkthrough.explanation.tiles' })
  })
);

export const selectSteps = createSelector(
  selectTranslations,
  (translations) => [
    {
      title: translations.tiles,
      text: translations.tilesExplanation,
      selector: '#tiles',
      position: 'bottom'
    },
    {
      title: translations.results,
      text: translations.resultsExplanation,
      selector: '#results',
      position: 'left'
    },
    {
      title: translations.board,
      text: translations.boardExplanation,
      selector: '#board',
      position: 'right'
    },
    {
      title: translations.dictionaryResults,
      text: translations.dictionaryResultsExplanation,
      selector: '#dictionary-results',
      position: 'right'
    },
    {
      title: translations.dictionaryFind,
      text: translations.dictionaryFindExplanation,
      selector: '#dictionary-find',
      position: 'right'
    },
    {
      title: translations.remainingTiles,
      text: translations.remainingTilesExplanation,
      selector: '#remaining-tiles',
      position: 'top'
    },
    {
      title: translations.configSetting,
      text: translations.configSettingExplanation,
      selector: '#config-setting',
      position: 'right'
    },
    {
      title: translations.localeSetting,
      text: translations.localeSettingExplanation,
      selector: '#locale-setting',
      position: 'right'
    }
  ]
);
