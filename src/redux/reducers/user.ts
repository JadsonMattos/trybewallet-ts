import { AnyAction } from 'redux';
import { USER_EMAIL } from '../actions';
import { UserState } from '../../types';

const initialState: UserState = {
  email: '',
};

const user = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case USER_EMAIL:
      return {
        ...state,
        email: action.payload,
      };
    default:
      return state;
  }
};

export default user;
