# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multi-tenant SaaS application with three main components:
- **API**: NestJS backend with TypeORM and PostgreSQL
- **Client**: React frontend with Material UI, Clerk auth, and Zustand state management  
- **Landing**: Landing page with SSR support

## Development Commands

### Quick Start
```bash
# Start all services with Docker Compose
docker-compose up

# Or run services individually:
# API (runs on port 5000)
cd api && npm run start:dev

# Client (runs on port 3000)
cd client && npm run dev

# Landing (runs on port 3001)
cd landing && npm run dev:ssr
```

### API Commands
```bash
cd api
npm run build              # Build for production
npm run start:dev          # Start with hot reload and linting
npm run start:prod         # Start production build
npm run lint               # Run ESLint and fix issues
npm run test               # Run unit tests
npm run test:e2e           # Run e2e tests
npm run migration:generate # Generate TypeORM migration
npm run migration:run      # Run migrations
npm run migration:revert   # Revert last migration
```

### Client Commands  
```bash
cd client
npm run dev                # Start dev server with linting
npm run build              # Build for production
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
npm run format             # Format code with Prettier
npm run test               # Run tests
```

### Landing Commands
```bash
cd landing
npm run dev                # Start dev server
npm run dev:ssr            # Start SSR dev server
npm run build:ssr          # Build for SSR production
npm run lint               # Run ESLint
npm run test               # Run tests
```

## Architecture

### API Architecture (Clean Architecture)

The API follows clean architecture with strict layer separation:

```
src/
├── api/                   # Presentation Layer - Controllers, HTTP handling
├── application/           # Application Layer - Use cases, CQRS, DTOs
├── domain/               # Domain Layer - Entities, business logic, interfaces
└── infrastructure/       # Infrastructure Layer - External services, persistence
```

**Key principles:**
- Dependencies flow inward: API → Application → Domain
- Domain layer has no external dependencies
- Use dependency injection for service management
- CQRS pattern for commands (state changes) and queries (reads)
- Repository pattern with interfaces in domain, implementations in infrastructure

### Client Architecture

Feature-based module structure:
```
src/
├── modules/              # Feature modules (auth, invoices, tenants, users)
│   └── [feature]/
│       ├── components/   # UI components
│       ├── services/     # API calls
│       ├── stores/       # Zustand state management
│       └── types/        # TypeScript types
├── common/               # Shared components and utilities
└── routes/               # React Router configuration
```

### Database

PostgreSQL with TypeORM migrations. Key entities:
- Tenant (multi-tenancy support)
- User (with Clerk integration)
- Role (authorization)
- Invoice & InvoiceItem (business domain)

### Authentication & Security

- **Authentication**: Clerk (external service)
- **Authorization**: Role-based guards in API layer
- **Multi-tenancy**: Tenant isolation at database level
- **Secrets Management**: Support for AWS Secrets Manager, Azure Key Vault, or local storage

### AI/LLM Integration

The API includes Model Context Protocol (MCP) integration and supports OpenAI for AI-driven features, particularly for invoice data extraction and analysis.

## Important Conventions

- **TypeScript strict mode** enabled in all projects
- **ESLint** runs before dev server starts - fix linting issues first
- **Feature modules** maintain their own services, stores, and components
- **Clean architecture layers** must be respected in the API
- **Multi-tenant context** required for most API operations
- **Clerk authentication** tokens required for API access

## Environment Variables

### API
- Database connection via TypeORM config
- Clerk API keys for authentication
- Cloud provider secrets (AWS/Azure) if using cloud secret storage

### Client
- `VITE_API_URL` - Backend API URL
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk public key

## Testing Strategy

- **Unit tests**: Focus on domain logic and use cases
- **Integration tests**: Test repository implementations
- **E2E tests**: Full API endpoint testing
- All projects use Jest with `--passWithNoTests` flag