import { useSelector } from 'react-redux';
import { RootState } from '../types';

function Header() {
  const { email } = useSelector((state: RootState) => state.user);
  const { expenses } = useSelector((state: RootState) => state.wallet);

  const totalExpense = expenses.reduce((total: any, expense: any) => {
    return total + parseFloat(expense.value) * (
      expense.exchangeRates[expense.currency].ask);
  }, 0);

  return (
    <header data-testid="header-component">
      <div data-testid="email-field">
        { `Email: ${email}` }
      </div>
      <div data-testid="total-field">
        { `${totalExpense.toFixed(2)}` }
      </div>
      <div data-testid="header-currency-field">
        BRL
      </div>
    </header>
  );
}

export default Header;
