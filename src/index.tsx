import React from 'react';
import { render } from 'react-dom';
// GraphQL Utilities
import { ApolloProvider } from '@apollo/client/react';
import ApolloClient from './lib/GraphQL';
// Main Component
import App from './App';
// Global Styles
import './styles/App.global.css';
// I18N
import Store from './lib/Store';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zh from './locales/zh.json';

const appLang = Store.get('appLang') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    zh: {
      translation: zh,
    },
  },
  lng: appLang,
  fallbackLng: 'zh',
  interpolation: {
    escapeValue: false,
  },
});

render(
  <ApolloProvider client={ApolloClient}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
