# FRONTEND DEVELOPMENT CONVENTIONS

You must strictly follow these conventions when generating or modifying frontend code.

## 1. Routing and Layout

1. All application routes must be registered in `App.tsx` using React Router's `createBrowserRouter`.
2. Use a common `Layout` component (`layouts/Layout.tsx`) for application-wide UI. It runs the session check (`useSessionCheck`), renders the top-right auth buttons and an `<Outlet />` for child routes. Add a Navbar or Footer here when they exist.
3. Do not place page-specific UI directly inside `App.tsx` or `Layout.tsx`.
4. Every route must point to a page component in its feature folder, e.g. `features/dashboard/DashboardPage.tsx`.
5. Wrap logged-in-only routes in `ProtectedRoute` and logged-out-only routes (landing, login) in `GuestRoute`, both from `features/auth/`.

## 2. Folder Structure and Code Organization

The project separates **state**, **pages** and **UI**:

- `store/` holds all shared app state with **Redux Toolkit**, one folder per feature, each with a slice (state + reducers) and thunks (API calls). It is the **only** place that calls the API.
- `features/` holds pages and the components that read state or dispatch thunks, one **flat** folder per feature. Do not create `components/`, `pages/`, `services/` or `types/` subfolders inside a feature.
- `components/` is the **only** components folder. It holds reusable UI blocks, grouped by feature, with no API calls, no store access and no business rules: everything a component needs arrives through props.
- `types/` is the **only** types folder, with one file per feature.

```text
src/
├── store/                     ← Redux Toolkit: state + API calls
│   ├── index.ts                 configureStore, RootState, AppDispatch, useAppDispatch, useAppSelector
│   └── auth/
│       ├── authSlice.ts         state, reducers, how each thunk updates the state
│       └── authThunks.ts        createAsyncThunk: loginUser, registerUser, verifyOtp, resendOtp, validateSession, logoutUser
│
├── features/                  ← pages + components that use the store (flat, one folder per feature)
│   ├── auth/
│   │   ├── AuthPage.tsx         route page (/login)
│   │   ├── LoginForm.tsx        local input state, dispatches loginUser
│   │   ├── RegisterForm.tsx
│   │   ├── OtpForm.tsx
│   │   ├── useSessionCheck.ts   dispatches validateSession on every route change, logs out on expiry
│   │   ├── ProtectedRoute.tsx   route guards
│   │   ├── GuestRoute.tsx
│   │   └── AuthButtons.tsx      top-right login/register/logout
│   ├── dashboard/
│   │   └── DashboardPage.tsx
│   └── landing/
│       └── LandingPage.tsx
│
├── components/                ← reusable UI blocks only (props in, markup out)
│   ├── ui/                      generic primitives: Button, Input, FormMessage, PageLoader
│   ├── auth/                    AuthCard, ModeSwitch, OtpInput
│   └── landing/                 Hero, Features, Showcase, Testimonials, ...
│
├── types/                     ← all types, one file per feature
│   ├── index.ts                 global types shared everywhere (User)
│   └── auth.ts
│
├── layouts/
│   └── Layout.tsx
├── lib/
│   └── api.ts                   axios instance (used only by thunks)
├── utils/
│   └── helpers.ts
├── App.tsx
└── main.tsx                     wraps <App /> in the Redux <Provider>
```

### Responsibilities

- **`store/<feature>/<feature>Slice.ts`:** The feature's state shape, its initial state, plain reducers (`cancelRegistration`, `sessionExpired`) and `extraReducers` that set `loading`, `error` and data when a thunk is pending, fulfilled or rejected.
- **`store/<feature>/<feature>Thunks.ts`:** One `createAsyncThunk` per API call, using `lib/api.ts`. Catch errors and `rejectWithValue(getErrorMessage(err))` so the slice gets a readable message.
- **`store/index.ts`:** Registers every slice reducer and exports the typed hooks. Always use `useAppDispatch` / `useAppSelector`, never plain `useDispatch` / `useSelector`.
- **`features/<feature>/`:** Route pages, hooks and components that read the store or dispatch thunks. Keep only UI-local state here (form inputs, countdowns, open/closed). Name files after what they are: `XxxPage.tsx`, `useXxx.ts`.
- **components/ui/:** Generic, app-agnostic primitives (buttons, inputs, loaders, messages).
- **`components/<feature>/`:** Presentational blocks for one area of the app. They may import from `components/ui/`, `types/` and `utils/`, never from `features/`, `store/` or `lib/`.
- **types/:** All TypeScript types. Shared types go in `types/index.ts`; feature types go in `types/<feature>.ts`.
- **layouts:** The app shell that wraps every route.
- **lib:** Third-party integrations and infrastructure, such as the Axios instance.
- **utils:** Reusable helper functions and formatters.

### Where does it go?

| If the code... | Put it in |
|---|---|
| Calls the API | a thunk in `store/<feature>/<feature>Thunks.ts` |
| Is state shared across pages, or loading/error of an API call | `store/<feature>/<feature>Slice.ts` |
| Is a page, or dispatches thunks / reads the store | `features/<feature>/` |
| Is state only one component cares about (input values, a timer) | `useState` in that component |
| Only renders props (could be shown in a style guide) | `components/<feature>/` or `components/ui/` |
| Is a type or interface | `types/<feature>.ts` |
| Is a pure helper function | `utils/helpers.ts` |

**Import direction:** `features → store, components, types, utils`. `store → lib, types, utils`. `components → components/ui, types, utils`. Components never import features or the store.

## 3. Example: Creating a Users Feature

Suppose the user requests:

"Create a users page where I can view all users, search users and see their details."

Follow this implementation flow:

**Step 1: Register the route in App.tsx** (inside `ProtectedRoute` if it needs login)

```tsx
{ path: '/users', element: <UsersPage /> }
```

**Step 2: Create the files**

```text
store/users/
├── usersSlice.ts        state: list, loading, error
└── usersThunks.ts       fetchUsers

features/users/
└── UsersPage.tsx        dispatches fetchUsers, holds the search text

components/users/
├── UserTable.tsx        renders the users it receives as props
└── UserSearch.tsx       renders the search box, reports changes via onChange

types/
└── users.ts
```

**Step 3: Define user types** in `types/users.ts`

```ts
export interface UserRow {
  id: string;
  name: string;
  email: string;
}
```

**Step 4: Create the thunk** in `store/users/usersThunks.ts`, using the shared client from `lib/api.ts`

```ts
export const fetchUsers = createAsyncThunk(
  'users/fetch',
  async (_: void, { rejectWithValue }) => {
    try {
      const { data } = await api.get<UserRow[]>('/users');
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);
```

**Step 5: Create the slice** in `store/users/usersSlice.ts` and add `users: usersReducer` to `store/index.ts`

```ts
const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [] as UserRow[], loading: false, error: '' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = ''; })
      .addCase(fetchUsers.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload; })
      .addCase(fetchUsers.rejected, (state, { payload }) => { state.loading = false; state.error = payload as string; });
  },
});
export default usersSlice.reducer;
```

**Step 6: Create the UI blocks** in `components/users/`

- `UserSearch.tsx`: props `value` and `onChange`; no state of its own beyond the input.
- `UserTable.tsx`: props `users`; just renders them.

**Step 7: Compose the page**

`features/users/UsersPage.tsx` dispatches `fetchUsers()` in a `useEffect`, reads `list`, `loading` and `error` with `useAppSelector`, keeps the search text in `useState`, filters the list and passes it to `UserSearch` and `UserTable`.

## 4. General Rules

1. Always inspect the existing project structure before creating files.
2. Reuse existing components, utilities, API clients and types wherever possible.
3. Never duplicate API configuration across features.
4. Keep business logic in `features/<feature>/` and keep `components/` presentational (see the table in section 2).
5. Avoid unnecessarily creating files or folders.
6. Do not put all application logic inside a single component.
7. Use TypeScript and define proper types. Avoid `any` unless absolutely necessary.
8. Follow existing naming conventions and coding patterns.
9. Do not modify project configuration files unless required.
10. Do not overwrite existing functionality while implementing new features.

**Most importantly:** Maintain consistency with the existing codebase. These conventions define the preferred architecture, but always inspect existing files before making changes.


## 5. Code Formatting & Cleanliness

Follow a clean, compact and consistent coding style. Avoid unnecessary whitespace, comments and excessive line breaks.

### Spacing Rules

1. Do not add unnecessary blank lines inside functions. Keep related statements together.
2. Always leave exactly one blank line between separate functions, methods and logical blocks.
3. Avoid excessive vertical spacing between JSX elements and related statements.
4. Keep code compact without making it difficult to read.

### Line Formatting

1. When an expression, function call, object or JSX element can comfortably fit on one line, keep it on one line.
2. Do not unnecessarily break short expressions into multiple lines.
3. When a line becomes too long or difficult to read, split it into multiple lines logically.
4. Avoid deeply nested code when a cleaner alternative is possible.
5. Prefer early returns over unnecessary nested conditionals.

### Comments

1. Do not add comments for obvious code or self-explanatory functions.
2. Avoid describing what every line of code does.
3. Add comments only when the implementation contains non-obvious logic, important business rules or necessary technical explanations.
4. Never generate redundant TODO comments or decorative section comments.

### Function & Component Structure

1. Keep functions focused and concise. Each function should have a clear responsibility.
2. Avoid unnecessary wrapper functions and abstractions.
3. Keep related logic together rather than spreading simple operations across multiple files.
4. Extract logic into separate functions only when it improves readability, reuse or maintainability.
5. Avoid unnecessarily nesting callbacks, ternaries and conditional expressions.

### Examples

**Avoid unnecessarily expanded formatting:**

```tsx
const getUser = (
  id: string
) => {
  
  const user = users.find(
    (user) => user.id === id
  );

  return user;
};
```

**Prefer:**

```tsx
const getUser = (id: string) => {
  const user = users.find(user => user.id === id);
  return user;
};
```

**Avoid unnecessary line breaks:**

```tsx
const user = {
  id: "1",
  name: "Suraj",
  email: "suraj@example.com"
};
```

**Prefer keeping simple expressions compact:**

```tsx
const isAdmin = user.role === "admin";
const fullName = `${user.firstName} ${user.lastName}`;
```

**Avoid excessive comments:**

```tsx
// Get the user by ID
const user = users.find(user => user.id === id);

// Return the user
return user;
```

**Prefer self-explanatory code:**

```tsx
const user = users.find(user => user.id === id);
return user;
```

**Final rule:** Write code as an experienced developer would write it in a real production codebase. Prioritize clarity, compactness and maintainability over unnecessary formatting, comments and abstractions.
