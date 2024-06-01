import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './App';
import { renderWithRouterAndRedux } from './tests/helpers/renderWith';
import Login from './pages/Login';
import Header from './components/Header';
import Wallet from './pages/Wallet';
import WalletForm from './components/WalletForm';
// import store from './redux';
import mockData from './tests/helpers/mockData';
import * as fetch from './redux/actions';

beforeEach(() => {
  vi.spyOn(fetch, 'fetchAPI').mockImplementation(() => (dispatch) => {
    return Promise.resolve(mockData).then((currencies) => {
      dispatch({ type: 'FETCH_CURRENCIES', payload: currencies });
    });
  });
  vi.spyOn(fetch, 'fetchCurrencyRate').mockResolvedValue(mockData as any);
  vi.spyOn(fetch, 'fetchThunkRates').mockResolvedValue(mockData as any);
});

afterEach(() => {
  vi.clearAllMocks();
});

const emailText = 'example@example.com';
const initialState = {
  user: { email: emailText },
  wallet: { expenses: [], currencies: ['USD'], exchangeRates: null },
};

describe('Testes login', () => {
  it('renderiza a página de login em "/"', () => {
    const { getByText } = renderWithRouterAndRedux(<App />);
    const loginPage = getByText('Trybe Wallet');
    expect(loginPage).toBeInTheDocument();
  });

  it('renderiza um elemento para inserir e-mail e senha.', () => {
    const { getByTestId } = renderWithRouterAndRedux(<Login />);
    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it('O e-mail é salvo no estado global após preencher campo', () => {
    const { getByTestId, getByText, store } = renderWithRouterAndRedux(<Login />, { initialState });
    const emailInput = getByTestId('email-input');
    userEvent.type(emailInput, emailText);
    const entrarButton = getByText('Entrar');
    userEvent.click(entrarButton);
    expect(store.getState().user.email).toBe(emailText);
  });

  it('A rota é alterada para "/carteira" após o clique no botão.', async () => {
    const { getByText } = renderWithRouterAndRedux(<Login />);
    const enterButton = getByText('Entrar');
    userEvent.click(enterButton);
    const { getByTestId } = renderWithRouterAndRedux(<Header />);
    await waitFor(() => {
      expect(getByTestId('email-field')).toBeInTheDocument();
    });
  });
});

describe('Testes do Header', () => {
  it('O componente `Header` é renderizado dentro do componente `Wallet`', () => {
    const { getByTestId } = renderWithRouterAndRedux(<Wallet />);
    const headerElement = getByTestId('header-component');
    expect(headerElement).toBeInTheDocument();
  });

  it('Exibe o e-mail da pessoa usuária, a despesa total e o câmbio no Header', () => {
    const { getByTestId } = renderWithRouterAndRedux(<Header />);
    const emailElement = getByTestId('email-field');
    expect(emailElement).toHaveTextContent('Email:');
    const totalExpenseElement = getByTestId('total-field');
    expect(totalExpenseElement).toHaveTextContent('0');
    const currencyElement = getByTestId('header-currency-field');
    expect(currencyElement).toHaveTextContent('BRL');
  });
});

describe('Testes do WalletForm', () => {
  it('O componente `WalletForm` é renderizado dentro do componente `Wallet`', () => {
    const { getByTestId } = renderWithRouterAndRedux(<Wallet />);
    const walletElement = getByTestId('wallet-component');
    expect(walletElement).toBeInTheDocument();
  });

  it('Renderiza os campos e elementos do formulário', () => {
    const { getByTestId/* , getByText */ } = renderWithRouterAndRedux(<WalletForm />);
    expect(getByTestId('value-input')).toBeInTheDocument();
    expect(getByTestId('description-input')).toBeInTheDocument();
    expect(getByTestId('currency-input')).toBeInTheDocument();
    expect(getByTestId('method-input')).toBeInTheDocument();
    expect(getByTestId('tag-input')).toBeInTheDocument();
    // expect(getByText('Adicionar despesa')).toBeInTheDocument();
  });

  it('Testa as seleções da moeda, método de pagamento e categoria', async () => {
    renderWithRouterAndRedux(<Wallet />);
    // expect(fetch.fetchAPI).toHaveBeenCalledTimes(1);
    const currencyInput = screen.getByTestId('currency-input');
    expect(currencyInput).toBeInTheDocument();
    await userEvent.selectOptions(currencyInput, 'USD');
    expect(currencyInput).toHaveValue('USD');
    expect(currencyInput).toHaveSelectedOptions([{ label: 'USD', value: 'USD' }]);
    const methodInput = screen.getByTestId('method-input');
    userEvent.selectOptions(methodInput, 'Cartão de crédito');
    expect(methodInput).toHaveValue('Cartão de crédito');
    const tagInput = screen.getByTestId('tag-input');
    userEvent.selectOptions(tagInput, 'Lazer');
    expect(tagInput).toHaveValue('Lazer');
  });

  it('Renderiza o botão "Adicionar despesa" e executa a ação ao clicar', async () => {
    renderWithRouterAndRedux(<WalletForm />);
    const addButton = screen.getByText('Adicionar despesa');
    expect(addButton).toBeInTheDocument();
    vi.spyOn(fetch, 'fetchThunkRates').mockResolvedValue(mockData as any);
    userEvent.click(addButton);
    await waitFor(() => {
      expect(fetch.fetchThunkRates).toHaveBeenCalledTimes(1);
    });
  });

  it('Testa a despesa e atualização do total', async () => {
    renderWithRouterAndRedux(<Wallet />, { initialEntries: ['/carteira'] });
    const valueInput = screen.getByTestId('value-input');
    const descriptionInput = screen.getByTestId('description-input');
    // expect(fetch.fetchAPI).toHaveBeenCalledTimes(1);
    userEvent.type(valueInput, '10');
    userEvent.type(descriptionInput, 'Compra de alimentos');
    vi.spyOn(fetch, 'fetchThunkRates').mockResolvedValue(mockData as any);
    const addButton = screen.getByText('Adicionar despesa');
    userEvent.click(addButton);
    await waitFor(() => {
      expect(fetch.fetchThunkRates).toHaveBeenCalledTimes(1);
    });
    expect(descriptionInput).toHaveValue('');
    const totalField = screen.getByTestId('total-field');
    expect(totalField).toHaveTextContent('10.00');
  });
});
