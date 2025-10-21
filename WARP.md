# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Running the Application

- `npm run dev` - Start development server with hot reload using Node's --watch flag
- Server runs on `http://localhost:3000` (or PORT from environment)

### Code Quality

- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code using Prettier
- `npm run format:check` - Check if code is properly formatted

### Database Operations

- `npm run db:generate` - Generate Drizzle migrations from schema changes
- `npm run db:migrate` - Apply pending migrations to database
- `npm run db:studio` - Launch Drizzle Studio for database management

## Architecture Overview

### Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Zod schemas
- **Logging**: Winston with structured logging
- **Security**: Helmet, CORS, cookie-parser

### Project Structure

The application follows a layered architecture with clear separation of concerns:

```
src/
├── config/          # Configuration (database, logger)
├── controllers/     # Request handlers and response logic
├── middleware/      # Custom middleware functions
├── models/          # Drizzle schema definitions
├── routes/          # Express route definitions
├── services/        # Business logic and data operations
├── utils/           # Helper functions (JWT, cookies, formatting)
└── validations/     # Zod validation schemas
```

### Import Aliases

The project uses Node.js import maps for clean imports:

- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#middleware/*` → `./src/middleware/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

### Database Architecture

- **ORM**: Drizzle ORM with Neon PostgreSQL serverless driver
- **Migrations**: Generated in `./drizzle/` directory
- **Schema**: Defined in `src/models/*.js` files
- **Connection**: Configured via `DATABASE_URL` environment variable

### Authentication Flow

- JWT-based authentication with secure HTTP-only cookies
- Password hashing using bcrypt with salt rounds of 10
- User registration with email uniqueness validation
- Role-based authorization (user/admin roles)

### Logging Strategy

- Winston logger with structured JSON format
- Different transports for development (console) and production (files)
- Request logging via Morgan middleware integrated with Winston
- Error logs stored in `logs/error.log`, all logs in `logs/combined.log`

### Code Quality Standards

- ESLint with recommended rules plus custom overrides
- Prettier for code formatting
- 2-space indentation, single quotes, semicolons required
- Unix line endings enforced
- Arrow functions and const/let preferred over function declarations and var

## Environment Requirements

- Node.js with ES modules support
- PostgreSQL database (Neon serverless)
- Required environment variables:
  - `DATABASE_URL` - PostgreSQL connection string
  - `JWT_SECRET` - Secret for JWT token signing
  - `NODE_ENV` - Environment (development/production)
  - `PORT` - Server port (optional, defaults to 3000)

## Development Workflow

1. Database changes: Update schema in `src/models/`, run `npm run db:generate`, then `npm run db:migrate`
2. New features: Follow the layered architecture (route → controller → service → model)
3. Validation: Use Zod schemas in `src/validations/` for input validation
4. Testing: No test framework is currently configured
5. Code quality: Run `npm run lint` and `npm run format` before committing
