# FRONTEND DEVELOPMENT CONVENTIONS

You must strictly follow these conventions when generating or modifying frontend code.

## 1. Routing and Layout

1. All application routes must be registered in `App.tsx` using React Router's `createBrowserRouter`.
2. Use a common `Layout` component for application-wide UI.
3. The `Layout` component must contain the Navbar, Footer, and an `<Outlet />` for rendering child routes.
4. Do not place page-specific UI directly inside `App.tsx` or `Layout.tsx`.
5. Every route must point to its respective page component inside the appropriate feature folder.

## 2. Folder Structure and Code Organization

Follow this architecture:

```text
src/
├── features/
│   ├── dashboard/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   │
│   └── users/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── types/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── layouts/
│   └── Layout.tsx
│
├── lib/
│   └── api.ts
│
├── utils/
│   └── helpers.ts
│
├── types/
│   └── index.ts
│
├── App.tsx
└── main.tsx
```

### Responsibilities

- **features:** Contains domain-specific functionality, pages, components, services and types.
- **features/components:** Components used only within that particular feature.
- **features/pages:** Route-level page components.
- **features/services:** Feature-specific API calls and business operations.
- **features/types:** Types specific to that feature.
- **components/ui:** Reusable UI primitives such as buttons, inputs, dialogs and cards.
- **components/shared:** Application-wide reusable components.
- **layouts:** Common application layouts containing Navbar, Footer and Outlet.
- **lib:** Third-party integrations and application infrastructure, such as Axios instances and API clients.
- **utils:** Reusable helper functions, formatters and other utility logic.
- **types:** Global application types shared across multiple features.

## 3. Example: Creating a Users Feature

Suppose the user requests:

"Create a users page where I can view all users, search users and see their details."

Follow this implementation flow:

**Step 1: Register the route in App.tsx**

```tsx
{
  path: "/users",
  element: <UsersPage />
}
```

**Step 2: Create the feature structure**

```text
features/
└── users/
    ├── components/
    │   ├── UserTable.tsx
    │   └── UserSearch.tsx
    ├── pages/
    │   └── UsersPage.tsx
    ├── services/
    │   └── user.service.ts
    └── types/
        └── user.types.ts
```

**Step 3: Define user types**

```tsx
export interface User {
  id: string;
  name: string;
  email: string;
}
```

**Step 4: Create API services**

Use the shared API client from `lib/api.ts`.

```tsx
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};
```

**Step 5: Create reusable feature components**

- `UserSearch.tsx`: Handles user search.
- `UserTable.tsx`: Displays the user list.

**Step 6: Compose the page**

`UsersPage.tsx` imports the search component, table component and user service to build the complete page.

## 4. General Rules

1. Always inspect the existing project structure before creating files.
2. Reuse existing components, utilities, API clients and types wherever possible.
3. Never duplicate API configuration across features.
4. Keep feature-specific logic inside its respective feature folder.
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