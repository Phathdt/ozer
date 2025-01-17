# E-commerce Frontend with Next.js and Clerk Auth

A modern e-commerce frontend application built with Next.js 14, Clerk Authentication, and Tailwind CSS. This application connects to a NestJS backend API to manage products and shopping carts.

## Features

- 🛍️ Product listing
- 🛒 Shopping cart management
- 🔐 Authentication with Clerk
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 🔄 Server-side rendering
- 📱 Fully responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks
- **API Integration**: REST API

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+
- npm or yarn
- Access to the NestJS backend API (running on port 4000)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
src/
├── app/
│   ├── products/
│   │   └── page.tsx      # Products listing page
│   ├── my-cart/
│   │   └── page.tsx      # Shopping cart page
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/               # shadcn/ui components
│   └── providers/        # App providers
├── hooks/
│   └── use-auth-token.ts # Custom auth hook
└── lib/
    └── cart.ts          # Cart service functions
```

## Authentication Flow

### Products Page (/products)
- Public access
- Add to cart:
  1. Checks authentication status
  2. If not logged in, redirects to sign-in
  3. If logged in, adds item to cart

### Cart Page (/my-cart)
- Protected route
- Middleware checks:
  1. If not authenticated, redirects to sign-in
  2. After sign-in, returns to cart page
  3. Fetches and displays cart data

## API Integration

The frontend connects to a NestJS backend running on `http://localhost:4000` with the following endpoints:

- `GET /products` - Fetch products list
- `GET /cart` - Get user's cart (authenticated)
- `POST /cart/items` - Add item to cart (authenticated)
- `PUT /cart/items/:id` - Update cart item (authenticated)
- `DELETE /cart/items/:id` - Remove cart item (authenticated)

## Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build application
npm start           # Start production server

# Linting
npm run lint        # Run ESLint
```

## Development Guidelines

1. **Component Structure**
   - Use server components by default
   - Switch to client components when needed ('use client')
   - Keep components focused and modular

2. **Authentication**
   - Use the `useAuthToken` hook for client-side auth
   - Use middleware for protected routes
   - Handle auth state appropriately in UI

3. **Styling**
   - Use Tailwind CSS utility classes
   - Follow shadcn/ui patterns
   - Maintain responsive design principles

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
