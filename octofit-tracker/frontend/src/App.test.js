import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders octofit navigation', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  expect(screen.getByText(/octofit tracker/i)).toBeInTheDocument();
  expect(screen.getByText(/users/i)).toBeInTheDocument();
});
