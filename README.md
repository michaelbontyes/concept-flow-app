# Concept Flow App

A headless NextJS application that interacts with the Concept Flow API for managing healthcare information systems metadata.

## Features

- User authentication with JWT
- Responsive UI using TailwindCSS
- Accessible components with HeadlessUI
- Form validation with React Hook Form
- TypeScript support for type safety

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Concept Flow API running on http://localhost:8000 (or set custom URL)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd concept-flow-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root of the project and add:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Build for production:
```bash
npm run build
# or
yarn build
```

6. Start the production server:
```bash
npm start
# or
yarn start
```

## Authentication

The app uses JWT-based authentication to communicate with the Concept Flow API:

1. Login credentials are sent to the API's `/api/v1/auth/login` endpoint
2. The returned JWT token is stored in local storage
3. The token is attached to all subsequent API requests
4. The token can be refreshed using the `/api/v1/auth/refresh` endpoint

## Project Structure

```
concept-flow-app/
├── app/              # Next.js app router pages
│   ├── login/        # Login page
│   ├── dashboard/    # Protected dashboard page
│   └── ...
├── components/       # React components
│   ├── LoginForm.tsx
│   ├── AuthGuard.tsx
│   └── ...
├── contexts/         # React contexts
│   └── AuthContext.tsx
├── lib/              # Utility functions
│   └── api.ts
├── types/            # TypeScript type definitions
│   └── auth.ts
└── ...
```

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Submit a pull request

## License

[MIT License](LICENSE)
