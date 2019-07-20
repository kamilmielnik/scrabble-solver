import { useSelector } from 'react-redux';
import { selectResults } from './selectors';

export const useResults = () => useSelector(selectResults);
