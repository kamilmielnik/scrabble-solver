import { useEffect, useState } from 'react';

const getInitialState = (query: string, defaultState?: boolean) => {
  if (typeof defaultState !== 'undefined') {
    return defaultState;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia(query).matches;
};

export const useMedia = (query: string, defaultState?: boolean) => {
  const [state, setState] = useState(getInitialState(query, defaultState));

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handleChange = () => {
      setState(mediaQuery.matches);
    };

    setState(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return state;
};
