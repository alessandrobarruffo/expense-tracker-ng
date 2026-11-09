# Frontend Architecture Notes

This document explains the folder structure and the main conventions used in the Angular frontend.

## 1. Organize by feature, not by file type

Everything that belongs to a feature lives in the same folder (store, API, models, guards, interceptors, pages, components). To change a feature you open one folder, and to move or remove it you move one folder.

```
src/app/
├── core/                    <- code that belongs to no feature
│   ├── layout/              <- main layout (navbar + <router-outlet />)
│   ├── interceptors/        <- generic interceptors (errors, logging)
│   └── config/              <- backend URL, configuration tokens
├── shared/                  <- reusable components, pipes, directives, utils
└── features/
    ├── auth/
    │   ├── auth.store.ts
    │   ├── auth.api.ts
    │   ├── auth.models.ts
    │   ├── auth.interceptor.ts
    │   ├── auth.guard.ts
    │   ├── auth.routes.ts
    │   └── pages/
    │       ├── login.page.ts
    │       └── register.page.ts
    └── users/
        ├── pages/
        ├── components/
        ├── users.store.ts
        ├── users.api.ts
        ├── users.models.ts
        └── users.routes.ts
```

## 2. What is a feature?

A feature is a cohesive set of code that **owns something of its own** (state, data, backend calls, pages or routes) and that changes together.

Rule of thumb: _"Whose data or pages does this code work with?"_ If the answer is a named owner, that owner is the feature and the code goes in `features/<name>/`. If the answer is "nobody", it goes in `core/`.

What does **not** matter for this decision:

- **Being core business.** Authentication is not the business of the app, but it is a feature.
- **Being global.** Globality is decided by how the code is provided (`providedIn: 'root'` or `providers` on a route), not by the folder it lives in.
- **Having a UI.** The layout has a UI but owns nothing, so it is not a feature.

| Code                          | Owns something?     | Location             |
| ----------------------------- | ------------------- | -------------------- |
| Auth store, API, login pages  | user, token, pages  | `features/auth/`     |
| `auth.interceptor`            | uses the auth store | `features/auth/`     |
| Generic error interceptor     | nothing             | `core/interceptors/` |
| Layout with navbar and outlet | nothing             | `core/layout/`       |
| Static "About" page           | page and route      | `features/about/`    |

A layout with its own state (theme, notifications) can become a feature of its own. This is a grey area, and moving it later is cheap.

## 3. State management: SignalStore first

We start with the NgRx `SignalStore` (`@ngrx/signals`) because it needs far less boilerplate than classic NgRx. Both belong to the same family and can coexist, so migrating later is not a rewrite.

- Global stores (such as auth) use `providedIn: 'root'`.
- Feature stores are provided at route level, so they live and die with the feature.
- Async methods use `rxMethod`, with `catchError` **inside** the `switchMap`, so an error does not close the stream.
- Components talk to the store only through its signals and public methods.

## 4. Responsibilities

- `*.api.ts`: HTTP calls only. No state.
- `*.store.ts`: state and the logic around it (calling the API, updating state, handling errors).
- Pages: tied to a route, read the store, compose components.
- Components: presentational only, they receive `input()` and emit `output()`, and do not know the store.

Pure data transformations (mappers, formatting, validation) live in plain functions outside the store, so they can be tested without creating it.

## 5. Models

- Request and response types are kept separate when they differ (for example `LoginRequest` and `AuthUser`), instead of one type with optional fields such as `password?`.
- `interface` / `type` are used for data models.
- The backend uses snake_case in its JSON, while the frontend uses camelCase. For this reason every feature has two kinds of types:
  - **DTO** (`UserDto`): mirrors the backend JSON exactly, with snake_case properties.
  - **Model** (`User`): used by stores, pages and components, with camelCase properties.
- The conversion between the two happens in one place only, a mapper in the feature's `*.api.ts` file, at the boundary with the backend. The rest of the frontend never sees snake_case.
- The mapper is also where other type conversions happen, for example date strings into `Date` objects.

```ts
// users.models.ts
export interface UserDto {
  username: string;
  created_at: string;
}

export interface User {
  username: string;
  createdAt: Date;
}

// users.api.ts
const toUser = (dto: UserDto): User => ({
  username: dto.username,
  createdAt: new Date(dto.created_at),
});
```

## 6. Authentication

- The access token is read from the `Authorization` response header and kept in the auth store.
- The refresh token is an `httpOnly` cookie handled by the backend.
- On startup the app calls refresh through `provideAppInitializer`, returning the Observable directly, so the app starts only after the session is known.
- Navigation after login and logout is done in the store for now. If a `returnUrl` is needed later, it can move to the login page.

## 7. Dependency direction

- Features may import from `core/` and `shared/`.
- `core/` and `shared/` do not import from features.
- Features should not import from each other. Shared code moves up to `shared/` or `core/`.
