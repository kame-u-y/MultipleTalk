import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';
import './style.css';

const render = () => {
  const App = require('./app/App').default;
  ReactDOM.render(
    <CookiesProvider>
      <App />
    </CookiesProvider>,
    document.getElementById('root')
  );
};

render();

if (module.hot) {
  module.hot.accept('./app/App', () => {
    render();
  });
}
