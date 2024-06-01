import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userEmail } from '../redux/actions';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const isValidEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);

  const handleLogin = () => {
    if (isValidEmail && password.length >= 6) {
      dispatch(userEmail(email));
      navigate('./carteira');
    }
  };

  return (
    <div>
      <h2>Trybe Wallet</h2>
      <input
        type="email"
        placeholder="Email"
        data-testid="email-input"
        value={ email }
        onChange={ handleEmailChange }
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        data-testid="password-input"
        value={ password }
        onChange={ handlePasswordChange }
      />
      <br />
      <button
        type="button"
        disabled={ !isValidEmail || password.length < 6 }
        onClick={ handleLogin }
      >
        Entrar
      </button>
    </div>
  );
}

export default Login;
