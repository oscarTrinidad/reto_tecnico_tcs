import { createReducer, on } from '@ngrx/store';
import { setUser, clearUser } from 'src/ngrx/actions/user.actions';
import { UserState, initialUserState } from 'src/ngrx/states/user.state';

export const userReducer = createReducer(
  initialUserState,
  on(setUser, (state, { user }) => ({ ...state, user })),
  on(clearUser, (state) => ({ ...state, user: null }))
);