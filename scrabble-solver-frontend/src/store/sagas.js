import dictionarySagas from 'modules/dictionary/sagas';
import sharedSagas from 'modules/shared/sagas';

export default function* rootSaga() {
  yield* dictionarySagas();
  yield* sharedSagas();
}
