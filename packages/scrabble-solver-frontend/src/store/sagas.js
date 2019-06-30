import dictionarySagas from 'dictionary/sagas';
import sharedSagas from 'shared/sagas';
import walkthroughSagas from 'walkthrough/sagas';

export default function* rootSaga() {
  yield* dictionarySagas();
  yield* sharedSagas();
  yield* walkthroughSagas();
}
