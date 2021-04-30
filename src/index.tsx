import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from '@apollo/client/react';
import ApolloClient from './lib/GraphQL';
import App from './App';
import './styles/App.global.css';

render(
  <ApolloProvider client={ApolloClient}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
