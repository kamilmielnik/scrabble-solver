import { sagas as configSagas } from 'config/sagas';
import { sagas as i18nSagas } from 'i18n';
import { sagas as sharedSagas } from 'shared';

export default function* rootSaga() {
  yield* configSagas();
  yield* i18nSagas();
  yield* sharedSagas();
}
