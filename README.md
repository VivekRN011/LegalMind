# LegalMind AI - Contract Intelligence SaaS (MVP)

AI-powered contract analysis platform that automatically summarizes contracts and identifies risk clauses.

## Features

- **AI Contract Analysis**: Powered by Groq API (Llama 3.1), extracts summaries and identifies risky clauses
- **Secure Document Upload**: PDF contract uploads with cloud storage
- **SaaS Subscription**: Stripe integration for free/pro tier management
- **User Authentication**: JWT-based secure authentication
- **Risk Assessment**: Automatic risk classification (Low/Medium/High)

## Tech Stack

### Backend
- Node.js + Express.js
- Prisma ORM + Neon PostgreSQL
- Groq AI (Llama 3.1 8B)
- AWS S3 for document storage
- Stripe for payments
- JWT authentication

### Frontend
- React 19 + Vite
- Tailwind CSS
- React Router
- Axios

## Getting Started

### Prerequisites
- Node.js 20+
- Neon PostgreSQL account
- Groq API key
- AWS S3 bucket (optional for MVP)
- Stripe account (optional for MVP)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npx prisma db push
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
GROQ_API_KEY=gsk_...
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_BUCKET_NAME=your-bucket
AWS_REGION=us-east-1
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile

### Documents
- `POST /api/documents/upload` - Upload and analyze contract
- `GET /api/documents` - List user documents
- `GET /api/documents/:id` - Get document details
- `DELETE /api/documents/:id` - Delete document

### Stripe
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhooks
- `POST /api/stripe/portal` - Create customer portal session

## Project Structure

```
LegalMind/
├── backend/
│   ├── src/
│   │   ├── config/      # App configuration
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # Auth, error handling
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── validators/  # Input validation
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context
│   │   ├── pages/       # Page components
│   │   └── services/    # API services
│   └── package.json
└── .github/
    └── workflows/
        └── ci.yml       # GitHub Actions CI
```

## Usage

1. Register an account
2. Upload a PDF contract
3. Wait for AI analysis
4. View contract summary and risk clauses
5. Upgrade to Pro for unlimited uploads

## License

MIT
