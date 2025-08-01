## Setup 

Create an .env file in the root of the project and add the following environment variables:

```env
    NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

* Change the `NEXT_PUBLIC_API_URL` in the `.env` file to point to your API endpoint.

## Getting Started

First, run the development server:

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Trade-offs or areas for improvement

Improvements can be made in the following areas:

1. **Data**

* Get filters (locations, timezones, skills) from the backend instead of getting them from the requested data. 
* You can not filter jobs by location, timezone, and skills that are not in the first page.
* hourlyRateMax is hardcoded to 150, which is not ideal. It should be dynamic based on the data received from the API.

2. **Error Handling**

* Implement error handling for the API calls to ensure a better user experience.

3. **Pagination**

* The current implementation fetches only the first 10 jobs.

4. **Route Authentication Verification**

Implement a centralized mechanism for route-level authentication. Instead of handling auth checks individually within each page or component.

* middleware.ts for pre-request authentication and role-based access control
```agsl
   const protectedPaths = ['/dashboard']

  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  if (isProtectedRoute) {
    if (!token) {
      // redirect to login
    }

    try {
      const decoded = jwt.verify(token, SECRET)
      // You can also check for roles/permissions here
      // if (decoded.permission !== 'admin') { ... }
    } catch (err) {
      // redirect to login
      ...
    }
  }
```

* Global layout for post-request authentication checks
```agsl
When useRouter is used in a layout.tsx file, its effects will apply globally to all pages within that layout's scope.
This is useful for implementing global behaviors like route transition animations or authentication checks that should apply across multiple pages.
```

This ensures better maintainability and a cleaner separation of concerns across the application.

