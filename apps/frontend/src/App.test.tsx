import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('LandingPage', () => {
  it('renders the hero and every section', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /what will you build today/i,
      }),
    ).toBeInTheDocument();
    for (const id of [
      'features',
      'how-it-works',
      'showcase',
      'testimonials',
      'about',
      'faq',
    ]) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
  });

  it('fills the prompt from a suggestion and enables Build', () => {
    render(<App />);
    const prompt = screen.getByLabelText(/describe the app/i);
    const build = screen.getByRole('button', { name: /start building/i });
    expect(build).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Admin dashboard' }));
    expect(prompt).toHaveValue('Build a admin dashboard');
    expect(build).toBeEnabled();
  });
});
