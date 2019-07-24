import { sagas as configSagas } from 'config/sagas';
import dictionarySagas from 'dictionary/sagas';
import { sagas as i18nSagas } from 'i18n';
import sharedSagas from 'shared/sagas';
import splashSagas from 'splash/sagas';
import walkthroughSagas from 'walkthrough/sagas';

export default function* rootSaga() {
  yield* configSagas();
  yield* dictionarySagas();
  yield* i18nSagas();
  yield* sharedSagas();
  yield* splashSagas();
  yield* walkthroughSagas();
}
