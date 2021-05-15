import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/single/Login';

describe('App', () => {
  it('should render login page', () => {
    expect(
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      )
    ).toBeTruthy();
  });
});
