import { ResultColumn, TranslationKey } from 'types';

export interface Column {
  className: string;
  id: ResultColumn;
  translationKey: TranslationKey;
}
