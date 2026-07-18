# Contributing

Thanks for your interest in improving Tutor Assistant AI.

## Local Setup

1. Fork and clone the repository.
2. Run `npm run install:all`.
3. Copy `server/.env.example` to `server/.env`.
4. Copy `client/.env.example` to `client/.env`.
5. Start the backend with `npm run server:dev`.
6. Start the frontend with `npm run client:dev`.

## Development Guidelines

- Keep teacher-facing language clear and non-technical.
- Do not commit secrets, `.env` files, generated builds, caches, or editor settings.
- Keep frontend changes accessible by default: keyboard support, focus states, readable contrast, and semantic HTML.
- Keep backend changes modular: routes, controllers, services, middleware, and models should remain separated.
- Prefer small, focused pull requests with a clear description and testing notes.

## Before Opening a Pull Request

- Run `npm run client:build`.
- Test registration, login, logout, AI generation, dashboard counts, and My Resources actions.
- Confirm light and dark mode remain readable.
- Update documentation when behavior, setup, or environment variables change.
