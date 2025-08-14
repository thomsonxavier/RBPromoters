This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

1. **Appwrite Setup**: This project uses Appwrite for authentication. You'll need to:
   - Create an Appwrite project at [cloud.appwrite.io](https://cloud.appwrite.io)
   - Get your Project ID and Endpoint URL
   - Create a `.env.local` file in the root directory with the following variables:

```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
```

2. **Install Dependencies**:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the Development Server**:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Authentication Features

The project now includes:
- **Sign In/Sign Up**: Toggle between login and registration forms
- **Appwrite Integration**: Uses Appwrite for user authentication
- **Session Management**: Automatic session checking and logout functionality
- **Error Handling**: Proper error messages and toast notifications
- **Responsive Design**: Works on all device sizes

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Appwrite Documentation](https://appwrite.io/docs) - learn about Appwrite features and API.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
