import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../types';
import { deleteExpense, setEditor, setIdToEdit } from '../redux/actions';

function Table() {
  const dispatch = useDispatch();
  const { expenses } = useSelector((state: RootState) => state.wallet);

  const handleDelete = (id: number) => {
    dispatch(deleteExpense(id));
  };

  const handleEdit = (id) => {
    dispatch(setEditor(true));
    dispatch(setIdToEdit(id));
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Descrição</th>
          <th>Tag</th>
          <th>Método de pagamento</th>
          <th>Valor</th>
          <th>Moeda</th>
          <th>Câmbio utilizado</th>
          <th>Valor convertido</th>
          <th>Moeda de conversão</th>
          <th>Editar/Excluir</th>
        </tr>
      </thead>
      <tbody>
        { expenses.map((expense) => (
          <tr key={ expense.id }>
            <td>{ expense.description }</td>
            <td>{ expense.tag }</td>
            <td>{ expense.method }</td>
            <td>{ Number(expense.value).toFixed(2) }</td>
            <td>{ expense.exchangeRates[expense.currency].name }</td>
            <td>{ Number(expense.exchangeRates[expense.currency].ask).toFixed(2) }</td>
            <td>
              { Number(expense.value)
                * parseFloat(expense.exchangeRates[expense.currency].ask) }
            </td>
            <td>Real</td>
            <td>
              <button
                data-testid="edit-btn"
                onClick={ () => handleEdit(expense.id) }
              >
                Editar
              </button>
              <button
                data-testid="delete-btn"
                onClick={ () => handleDelete(expense.id) }
              >
                Excluir
              </button>
            </td>
          </tr>
        )) }
      </tbody>
    </table>
  );
}

export default Table;
