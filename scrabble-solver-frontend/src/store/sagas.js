import dictionarySagas from 'dictionary/sagas';
import sharedSagas from 'shared/sagas';

export default function* rootSaga() {
  yield* dictionarySagas();
  yield* sharedSagas();
}
