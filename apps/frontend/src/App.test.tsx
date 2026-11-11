import { jest } from '@jest/globals';

const validateSession = jest.fn<() => Promise<unknown>>();
const login = jest.fn<(body: unknown) => Promise<unknown>>();

jest.unstable_mockModule('./lib/api', () => ({
  api: {
    get: async (url: string) => ({
      data: url === '/graph/threads' ? [] : await validateSession(),
    }),
    post: async (url: string, body: unknown) => ({
      data:
        url === '/auth/login'
          ? await login(body)
          : url === '/graph/threads'
            ? { threadId: '1-test' }
            : undefined,
    }),
  },
}));

const { fireEvent, render, screen } = await import('@testing-library/react');
const { Provider } = await import('react-redux');
const { default: App } = await import('./App');
const { makeStore } = await import('./store');

const user = { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' };
const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

const renderAt = (path: string) => {
  window.history.pushState({}, '', path);
  render(
    <Provider store={makeStore()}>
      <App />
    </Provider>,
  );
};

describe('routing and auth', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('logged out', () => {
    beforeEach(() =>
      validateSession.mockResolvedValue({ authenticated: false }),
    );

    it('shows the landing page with Log in and Register buttons', async () => {
      renderAt('/');
      expect(
        await screen.findByRole('heading', {
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
      expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute(
        'href',
        '/login',
      );
      expect(screen.getByRole('link', { name: 'Register' })).toHaveAttribute(
        'href',
        '/login?mode=register',
      );
    });

    it('fills the prompt from a suggestion and enables Build', async () => {
      renderAt('/');
      const prompt = await screen.findByLabelText(/describe the app/i);
      const build = screen.getByRole('button', { name: /start building/i });
      expect(build).toBeDisabled();
      fireEvent.click(screen.getByRole('button', { name: 'Admin dashboard' }));
      expect(prompt).toHaveValue('Build a admin dashboard');
      expect(build).toBeEnabled();
    });

    it('redirects /dashboard to /login', async () => {
      renderAt('/dashboard');
      expect(
        await screen.findByRole('heading', { name: 'Welcome back' }),
      ).toBeInTheDocument();
      expect(window.location.pathname).toBe('/login');
    });

    it('switches /login between login and register', async () => {
      renderAt('/login?mode=register');
      expect(
        await screen.findByRole('heading', { name: 'Create your account' }),
      ).toBeInTheDocument();
      fireEvent.click(
        screen.getByRole('button', { name: 'Log in', pressed: false }),
      );
      expect(
        await screen.findByRole('heading', { name: 'Welcome back' }),
      ).toBeInTheDocument();
      expect(window.location.search).toBe('');
    });

    it('logs in and lands on the dashboard', async () => {
      login.mockResolvedValue({ user, expiresAt });
      renderAt('/login');
      fireEvent.change(await screen.findByLabelText('Email'), {
        target: { value: user.email },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'supersecret123' },
      });
      validateSession.mockResolvedValue({
        authenticated: true,
        user,
        expiresAt,
      });
      fireEvent.submit(screen.getByLabelText('Password').closest('form')!);
      expect(
        await screen.findByRole('button', { name: /log out/i }),
      ).toBeInTheDocument();
      expect(login).toHaveBeenCalledWith({
        email: user.email,
        password: 'supersecret123',
      });
      expect(window.location.pathname).toBe('/dashboard');
    });
  });

  describe('logged in', () => {
    beforeEach(() =>
      validateSession.mockResolvedValue({
        authenticated: true,
        user,
        expiresAt,
      }),
    );

    it('redirects / to /dashboard', async () => {
      renderAt('/');
      expect(
        await screen.findByRole('button', { name: /log out/i }),
      ).toBeInTheDocument();
      expect(window.location.pathname).toBe('/dashboard');
    });

    it('redirects /login to /dashboard and shows the user with Log out', async () => {
      renderAt('/login');
      expect(
        await screen.findByRole('button', { name: /log out/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /log out/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: 'Register' }),
      ).not.toBeInTheDocument();
    });
  });
});
