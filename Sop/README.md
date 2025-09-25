# Shopee SOP Assistant

AI-powered SOP assistant untuk membantu agent Shopee menangani kasus return & refund dengan lebih efisien.

## Features

- **Admin Panel**: Manajemen SOP dan kategori
- **AI Chat Interface**: ChatGPT-like interface untuk agent
- **Multi-input Support**: Text dan image upload
- **Evidence Assessment**: Otomatis menilai conclusive/inconclusive evidence
- **Role-based Access**: Admin dan Agent roles
- **Shopee Design**: UI/UX menggunakan color scheme Shopee

## Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router)
- **Database**: Neon PostgreSQL
- **AI Integration**: OpenAI GPT API
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

## Environment Variables

```env
DATABASE_URL="postgresql://neondb_owner:npg_W61rqRFNPdOT@ep-calm-fire-a10s3rvb-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="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"
```

## Installation

1. Clone repository
2. Install dependencies: `npm install`
3. Setup environment variables
4. Generate Prisma client: `npx prisma generate`
5. Push database schema: `npx prisma db push`
6. Seed database: `npx tsx prisma/seed.ts && npx tsx prisma/seed-sops.ts`
7. Run development server: `npm run dev`

## Default Users

- **Admin**: admin@shopee.com / admin123
- **Agent**: agent@shopee.com / agent123

## Deployment

Ready for deployment on Vercel or Netlify. Make sure to:

1. Set environment variables in deployment platform
2. Update NEXTAUTH_URL to production URL
3. Ensure database is accessible from production

## Usage

### Admin
1. Login via `/shopee` dengan admin credentials
2. Manage SOP categories dan content
3. Monitor chat history dan analytics

### Agent
1. Login via `/shopee` dengan agent credentials
2. Akses chat interface
3. Upload screenshot atau ketik deskripsi case
4. Dapatkan SOP guidance dari AI

## SOP Categories

1. Damaged - Items received in damaged condition
2. Wrong - Wrong item received by customer
3. Counterfeit - Suspected counterfeit or fake products
4. Expired - Products that have expired
5. Empty Parcel/Swap Parcel - Empty packages or swapped items
6. Non Receipts - Items not received by customer
7. Faulty - Defective or malfunctioning products
8. Special SOP (Seller Dispute) - Special cases requiring seller dispute resolution
