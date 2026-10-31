import { createAction } from '@reduxjs/toolkit';

export const initialize = createAction<{ version: string }>('initialize');

export const reset = createAction('reset');

export const createBoard = createAction('createBoard');

export const removeBoard = createAction<string>('removeBoard');

export const switchBoard = createAction<string>('switchBoard');
