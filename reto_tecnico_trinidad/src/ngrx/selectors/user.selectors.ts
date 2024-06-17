import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from 'src/ngrx/states/user.state';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(
  selectUserState,
  (state: UserState) => state.user
);