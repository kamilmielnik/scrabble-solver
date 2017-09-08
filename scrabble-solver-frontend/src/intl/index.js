import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import plLocaleData from 'react-intl/locale-data/pl';
import en from './en';
import pl from './pl';

addLocaleData([ ...enLocaleData, ...plLocaleData ]);

export { en, pl };
