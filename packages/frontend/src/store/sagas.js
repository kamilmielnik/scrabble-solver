import { sagas as configSagas } from 'modules/config/sagas';
import { sagas as i18nSagas } from 'modules/i18n';
import { sagas as sharedSagas } from 'modules/shared';

export default function* rootSaga() {
  yield* configSagas();
  yield* i18nSagas();
  yield* sharedSagas();
}
