import { Dispatch } from 'redux';
import { Expense, ExpenseInitial } from '../../types';

export const USER_EMAIL = 'USER_EMAIL';
export const FETCH_CURRENCIES = 'FETCH_CURRENCIES';
export const ADD_EXPENSE = 'ADD_EXPENSE';
export const FETCH_CURRENCY_RATE = 'FETCH_CURRENCY_RATE';
export const DELETE_EXPENSE = 'DELETE_EXPENSE';
export const SET_EDITOR = 'SET_EDITOR';
export const SET_ID_TO_EDIT = 'SET_ID_TO_EDIT';
export const UPDATE_EXPENSE = 'UPDATE_EXPENSE';

export const userEmail = (email: string) => {
  return {
    type: USER_EMAIL,
    payload: email,
  };
};

export const fetchCurrencies = (currencies: string[]) => {
  return {
    type: FETCH_CURRENCIES,
    payload: currencies,
  };
};

export function fetchAPI() {
  return async (dispatch: Dispatch) => {
    try {
      const response = await fetch('https://economia.awesomeapi.com.br/json/all');
      if (!response.ok) {
        throw new Error('Error!');
      }
      const data = await response.json();
      const currenciesList = Object.keys(data)
        .filter((currency) => currency !== 'USDT');
      dispatch(fetchCurrencies(currenciesList));
    } catch (error) {
      console.error(error);
    }
  };
}

export const addExpense = (expense: Expense) => {
  return {
    type: ADD_EXPENSE,
    payload: expense,
  };
};

export const getNextExpense = (expenses: Array<Expense>) => {
  if (expenses.length === 0) {
    return 0;
  }
  const maxId = Math.max(...expenses.map((expen) => expen.id));
  return maxId + 1;
};

export const fetchCurrencyRate = async () => {
  const response = await fetch('https://economia.awesomeapi.com.br/json/all');
  const data = await response.json();
  return data;
};

export const fetchThunkRates = (expense: ExpenseInitial) => {
  return async (dispatch: Dispatch, getState: any) => {
    try {
      const currencyRate = await fetchCurrencyRate();
      const nextId = getNextExpense(getState().wallet.expenses);
      const newExpense = {
        id: nextId,
        value: expense.value,
        currency: expense.currency,
        description: expense.description,
        method: expense.method,
        tag: expense.tag,
        exchangeRates: currencyRate,
      };
      dispatch(addExpense(newExpense));
    } catch (error) {
      console.error(error);
    }
  };
};

export const deleteExpense = (id: number) => {
  return {
    type: DELETE_EXPENSE,
    payload: id,
  };
};

export const setEditor = (value: boolean) => {
  return {
    type: SET_EDITOR,
    payload: value,
  };
};

export const setIdToEdit = (id: number) => {
  return {
    type: SET_ID_TO_EDIT,
    payload: id,
  };
};

export const updateExpense = (editedExpense: Expense) => {
  return {
    type: UPDATE_EXPENSE,
    payload: editedExpense,
  };
};
