import { sagas as configSagas } from 'config/sagas';
import dictionarySagas from 'dictionary/sagas';
import { sagas as i18nSagas } from 'i18n';
import { sagas as sharedSagas } from 'shared';
import { sagas as walkthroughSagas } from 'walkthrough';

export default function* rootSaga() {
  yield* configSagas();
  yield* dictionarySagas();
  yield* i18nSagas();
  yield* sharedSagas();
  yield* walkthroughSagas();
}
