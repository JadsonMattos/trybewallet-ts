import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

export type RootState = {
  user: UserState,
  wallet: WalletState,
};

export type UserState = {
  email: string,
};

export type ExchangeRate = {
  code: string,
  name: string,
  ask: string,
};

export type ExpenseInitial = {
  value: string | number,
  currency: string,
  description: string,
  method: string,
  tag: string,
};

export type NewExpense = ExpenseInitial & {
  exchangeRates: Record<string, ExchangeRate>,
};

export type Expense = NewExpense & {
  id: number,
};

export type WalletState = {
  currencies: Array<string>,
  expenses: Expense[],
  editor: boolean,
  idToEdit: number,
};

export type Dispatch = ThunkDispatch<WalletState, null, AnyAction>;
