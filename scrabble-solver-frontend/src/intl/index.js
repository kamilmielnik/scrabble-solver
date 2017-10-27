import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import plLocaleData from 'react-intl/locale-data/pl';
import en from './en';
import pl from './pl';

addLocaleData([ ...enLocaleData, ...plLocaleData ]);

export default {
  'en-US': {
    messages: en,
    locale: 'en-US'
  },
  'en-GB': {
    messages: en,
    locale: 'en-GB'
  },
  'pl-PL': {
    messages: pl,
    locale: 'pl-PL'
  }
};
