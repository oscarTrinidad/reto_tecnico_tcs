import { User } from "src/models/user.model";

export interface UserState {
    user: User | null;
}
  
export const initialUserState: UserState = {
    user: null,
};