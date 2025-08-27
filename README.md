# Firecrawl Web Scraper

A Next.js application for scraping and extracting clean data from websites using the Firecrawl API.

## Features

- Clean web scraping interface
- Extract content in multiple formats (Markdown, HTML)
- Metadata extraction
- Real-time scraping with loading states
- Mock mode for development without API key

## Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Firecrawl API key (optional for development)

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 2. Environment Setup

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Add your Firecrawl API key to the `.env` file:
- Get your API key from [https://firecrawl.dev](https://firecrawl.dev)
- Add it to the `FIRECRAWL_API_KEY` variable in your `.env` file

Note: The app will work without an API key using mock responses for development.

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to use the application.

## Usage

1. Enter a URL in the input field
2. Click "Scrape" to extract content
3. View the extracted content in different formats:
   - Markdown view for clean, formatted text
   - HTML view for structured content
   - Metadata for page information

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI with custom components
- **State Management**: Zustand
- **API**: Firecrawl v2 for web scraping

## Project Structure

```
fc-test/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   │   └── scrape/      # Scraping endpoint
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page
├── components/          # React components
│   ├── playground.tsx   # Main scraping interface
│   └── ui/             # Reusable UI components
└── lib/                # Utility functions
```

## Development

The application includes:
- TypeScript for type safety
- Tailwind CSS for styling
- Prettier configuration for code formatting
- Turbopack for fast development builds

## License

Private project