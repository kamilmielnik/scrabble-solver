import configSagas from 'config/sagas';
import dictionarySagas from 'dictionary/sagas';
import sharedSagas from 'shared/sagas';

export default function* rootSaga() {
  yield* configSagas();
  yield* dictionarySagas();
  yield* sharedSagas();
}
