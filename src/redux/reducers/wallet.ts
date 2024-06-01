import { AnyAction } from 'redux';
import { ADD_EXPENSE, DELETE_EXPENSE, FETCH_CURRENCIES,
  SET_EDITOR, SET_ID_TO_EDIT, UPDATE_EXPENSE } from '../actions';
import { WalletState } from '../../types';

const initialState: WalletState = {
  expenses: [],
  currencies: [],
  editor: false,
  idToEdit: 0,
};

const WalletReducer = ((state = initialState, action: AnyAction) => {
  const updatedExpenses = state.expenses.filter(
    (expense) => expense.id !== action.payload,
  );

  const updatedTotalExpense = updatedExpenses.reduce((total, expense) => {
    const exchangeRate = expense.exchangeRates[expense.currency].ask;
    return total + Number(expense.value) * Number(exchangeRate);
  }, 0);

  switch (action.type) {
    case FETCH_CURRENCIES:
      return {
        ...state,
        currencies: action.payload,
      };
    case ADD_EXPENSE:
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    case DELETE_EXPENSE:
      return {
        ...state,
        expenses: updatedExpenses,
        totalExpense: updatedTotalExpense,
      };
    case SET_EDITOR:
      return {
        ...state,
        editor: action.payload,
      };
    case SET_ID_TO_EDIT:
      return {
        ...state,
        idToEdit: action.payload,
      };
    case UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map((expense) => (expense.id === action.payload.id
          ? action.payload : expense)),
      };
    default:
      return state;
  }
});

export default WalletReducer;
