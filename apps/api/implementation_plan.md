# Global Error Handling Implementation Plan

This plan outlines the architecture for a centralized error handling system. This will eliminate repetitive `try-catch` blocks in controllers and ensure that every error—whether a database conflict, a validation failure, or a system crash—results in a consistent, professional JSON response.

## User Review Required

> [!IMPORTANT]
> - **Unified Responses**: All API errors will now follow a standard format: `{ "status": "fail/error", "message": "..." }`.
> - **Operational vs. Programmatic**: The system will distinguish between "Operational" errors (things we expect, like invalid input) and "Programmatic" errors (unexpected bugs), hiding sensitive details of the latter in production.
> - **Refactor Impact**: I will be removing `try-catch` blocks from existing controllers to use a cleaner `catchAsync` pattern.

## Proposed Changes

### 1. Core Utilities

#### [NEW] [appError.ts](file:///d:/Software%20Eng%20%2803-2026%29/E-commers/chilleBazzar-eCom/apps/api/src/utils/appError.ts)
- Create a class `AppError` that extends `Error`.
- Include `statusCode`, `status` (fail/error), and `isOperational` properties.

#### [NEW] [catchAsync.ts](file:///d:/Software%20Eng%20%2803-2026%29/E-commers/chilleBazzar-eCom/apps/api/src/utils/catchAsync.ts)
- Create a higher-order function to wrap controller methods.
- This will automatically catch any rejected promises and pass them to the global error handler.

### 2. Specialized Middleware

#### [NEW] [error.middleware.ts](file:///d:/Software%20Eng%20%2803-2026%29/E-commers/chilleBazzar-eCom/apps/api/src/middleware/error.middleware.ts)
- Implement a global error handling function:
  - **Mongoose Support**: Convert `CastError`, `DuplicateKeyError`, and `ValidationError` into user-friendly `AppError` instances.
  - **Environment Awareness**: Send detailed stack traces in development, but only clean messages in production.

### 3. Application Integration

#### [MODIFY] [index.ts](file:///d:/Software%20Eng%20%2803-2026%29/E-commers/chilleBazzar-eCom/apps/api/src/index.ts)
- Implement a "Route Not Found" handler for any undefined URL.
- Register the global error handling middleware at the **very bottom** of the middleware stack.

#### [MODIFY] [auth.controller.ts](file:///d:/Software%20Eng%20%2803-2026%29/E-commers/chilleBazzar-eCom/apps/api/src/controllers/auth.controller.ts) & [farmerProfile.controller.ts](file:///d:/Software%20Eng%20%2803-2026%29/E-commers/chilleBazzar-eCom/apps/api/src/controllers/farmerProfile.controller.ts)
- Refactor all methods to use `catchAsync`.
- Replace manual `res.status(...).json(...)` error calls with `next(new AppError(...))`.

## Verification Plan

### Manual Testing via Postman
1. **Invalid Route**: Request `GET /api/v1/invalid` and verify the 404 response.
2. **Validation Error**: Attempt to signup with a missing field and verify the detailed validation response.
3. **Duplicate Field**: Attempt to signup with an existing email and verify the 400 response.
4. **Invalid ID**: Request a farmer profile with a malformed ID and verify the 400 "Invalid ID" response.
5. **Unauthorized**: Attempt to access a protected route without a cookie and verify the 401 response handled by the new system.
