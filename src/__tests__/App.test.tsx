import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Start from '../pages/embed/Start';

describe('App', () => {
  it('should render start page', () => {
    expect(
      render(
        <BrowserRouter>
          <Start />
        </BrowserRouter>
      )
    ).toBeTruthy();
  });
});
