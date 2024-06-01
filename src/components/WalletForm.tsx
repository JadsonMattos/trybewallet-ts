import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { RootState, Dispatch, Expense } from '../types';
import { fetchAPI, fetchThunkRates, setEditor, setIdToEdit, updateExpense } from '../redux/actions';

function WalletForm() {
  const dispatch: Dispatch = useDispatch();
  const { currencies, idToEdit, editor, expenses } = useSelector(
    (state: RootState) => state.wallet,
  );

  const [expense, setExpense] = useState({
    value: '',
    description: '',
    currency: 'USD',
    method: 'Dinheiro',
    tag: 'Alimentação',
  });

  useEffect(() => {
    dispatch(fetchAPI());
  }, [dispatch]);

  const handleExpense = () => {
    dispatch(fetchThunkRates(expense));
    setExpense({
      value: '',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
    });
  };

  const handleEdit = (id) => {
    dispatch(setEditor(true));
    dispatch(setIdToEdit(id));
    const expenseToEdit = expenses.find((expen) => expen.id === id);
    if (expenseToEdit) {
      setExpense({ ...expenseToEdit });
    }
  };

  const handleSaveEdit = () => {
    const editedExpense = {
      id: idToEdit,
      value: expense.value,
      description: expense.description,
      currency: expense.currency,
      method: expense.method,
      tag: expense.tag,
    };
    dispatch(updateExpense(editedExpense));
    dispatch(setEditor(false));
  };

  return (
    <form
      data-testid="wallet-component"
      onSubmit={ (event) => {
        event.preventDefault();
        if (editor) {
          handleSaveEdit();
        } else {
          handleExpense();
        }
      } }
    >
      <div>
        <label htmlFor="value">Valor:</label>
        <input
          type="number"
          id="value"
          name="value"
          value={ expense.value }
          onChange={ (event) => setExpense({ ...expense, value: event.target.value }) }
          data-testid="value-input"
        />
      </div>
      <div>
        <label htmlFor="description">Descrição:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={ expense.description }
          onChange={ (event) => setExpense(
            { ...expense, description: event.target.value },
          ) }
          data-testid="description-input"
        />
      </div>
      <div>
        <label htmlFor="currency">Moeda:</label>
        <select
          id="currency"
          name="currency"
          value={ expense.currency }
          onChange={ (event) => setExpense({ ...expense, currency: event.target.value }) }
          data-testid="currency-input"
        >
          { currencies.map((currency) => (
            <option key={ currency } value={ currency }>
              { currency }
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="method">Método de pagamento:</label>
        <select
          id="method"
          name="method"
          value={ expense.method }
          onChange={ (event) => setExpense({ ...expense, method: event.target.value }) }
          data-testid="method-input"
        >
          <option value="Dinheiro">Dinheiro</option>
          <option type="submit" value="Cartão de crédito">Cartão de Crédito</option>
          <option type="submit" value="Cartão de débito">Cartão de Débito</option>
        </select>
      </div>
      <div>
        <label htmlFor="tag">Categoria:</label>
        <select
          data-testid="tag-input"
          id="tag"
          onChange={ (event) => setExpense({ ...expense, tag: event.target.value }) }
        >
          <option value="Alimentação">Alimentação</option>
          <option value="Lazer">Lazer</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Transporte">Transporte</option>
          <option value="Saúde">Saúde</option>
        </select>
      </div>
      { editor ? (
        <button type="submit" onClick={ handleSaveEdit }>
          Editar Despesa
        </button>
      ) : (
        <button type="submit">Adicionar despesa</button>
      )}
    </form>
  );
}

export default WalletForm;
