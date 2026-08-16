import { createAction } from '@reduxjs/toolkit';

export const initialize = createAction<{ version: string }>('initialize');

export const reset = createAction('reset');
