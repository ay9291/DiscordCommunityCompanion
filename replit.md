# Discord Bot Management Dashboard

## Overview

This is a full-stack web application for managing a Discord bot with comprehensive moderation, verification, and community features. The system provides a modern dashboard interface for bot administration and includes support for NSFW community management with automated verification systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with Tailwind CSS for styling
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Custom Discord-themed design system with CSS variables

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Development**: Hot reload with Vite integration in development mode

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema updates
- **Session Storage**: PostgreSQL-based sessions with connect-pg-simple

## Key Components

### Database Schema
The application uses a well-structured PostgreSQL schema with the following main tables:
- **servers**: Discord server information and bot tokens
- **bot_stats**: Performance metrics and usage statistics
- **activities**: Audit log for bot actions and events
- **tickets**: Support ticket system
- **moderation_settings**: Auto-moderation configuration
- **bot_config**: Bot behavior settings

### Discord Integration
- **Discord.js**: Official Discord API library for bot functionality
- **API Wrapper**: Custom Discord API client for server information retrieval
- **Real-time Updates**: Bot actions are logged and displayed in real-time

### UI Components
- **Dashboard**: Comprehensive overview with stats cards, activity feeds, and quick actions
- **Modular Design**: Reusable components following Discord's design language
- **Responsive Layout**: Mobile-first design with sidebar navigation
- **Dark Theme**: Discord-inspired color scheme with CSS custom properties

### Verification System
Based on the requirements document, the bot supports:
- Multi-role verification (seller, sugar baby, couple, voyeur)
- ID verification with manual approval workflow
- Automated role assignment after verification
- DM-based verification process

## Data Flow

1. **Client Request**: Frontend makes API calls to Express server
2. **Server Processing**: Express routes handle business logic and database operations
3. **Database Interaction**: Drizzle ORM manages PostgreSQL queries
4. **Discord Bot Integration**: Server communicates with Discord API for bot actions
5. **Real-time Updates**: Activity logs and stats are updated and reflected in the dashboard

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **discord.js**: Discord bot framework
- **express**: Web application framework
- **react**: Frontend UI library
- **@tanstack/react-query**: Server state management

### UI Dependencies
- **@radix-ui/react-***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **wouter**: Lightweight router

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type safety and development experience
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React application to static files
- **Backend**: esbuild bundles Express server for Node.js deployment
- **Database**: Drizzle migrations ensure schema consistency

### Environment Configuration
- **Development**: Local development with Vite proxy and hot reload
- **Production**: Static files served by Express with bundled server code
- **Database**: Environment-based connection strings for different stages

### Key Features Supported
- Auto-moderation with spam detection and link filtering
- Role management and reaction roles
- Support ticket system
- Activity logging and audit trails
- Bot performance monitoring
- NSFW content management capabilities

The architecture is designed to be scalable and maintainable, with clear separation between frontend presentation, backend logic, and data persistence layers.