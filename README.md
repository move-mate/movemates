```markdown
# Next.js Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Netlify

To deploy this Next.js app on **Netlify**, follow these steps:

1. **Push your code to GitHub/GitLab/Bitbucket** (if it's not already there).
2. **Create a Netlify account** or log in to your existing account at [Netlify](https://app.netlify.com).
3. **Create a New Site from Git**:
   - In the Netlify dashboard, click on **New Site from Git**.
   - Select your Git provider (GitHub, GitLab, or Bitbucket).
   - Choose the repository you want to deploy.
4. **Configure Build Settings**:
   - Set the **Build Command** to `npm run build`.
   - Set the **Publish Directory** to `out` (for Static Export). If you're using server-side rendering, you may not need this, and Netlify will build your site accordingly.
5. **Deploy Your Site**:
   - Click on **Deploy Site**.
   - Netlify will automatically build and deploy your site.

For more detailed instructions, check out [Netlify's Next.js Deployment Docs](https://docs.netlify.com/configure-builds/common-configurations/nextjs/).

## Environmental Variables

You may need to configure environment variables for your project. For example, if you are using a database or other services, you should create a `.env` file in the root of your project.

```plaintext
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=your-database-url
```

Make sure to keep sensitive credentials secure, and don't commit the `.env` file to version control.

## Build and Export

Next.js supports two modes of deployment:
- **Static Export**: If your application is static, you can run the following command to generate an optimized version of your site:

  ```bash
  npm run build
  npm run export
  ```

  This will generate static files in the `out` directory, which can be deployed to any static hosting platform like Netlify.

- **Server-Side Rendering (SSR)**: If you need server-side rendering for dynamic content, Netlify will handle SSR as part of its build process. You do not need to use `next export` in this case.

## Running Tests

If you're using Vitest for testing, you can run the tests by following these steps:

1. **Run all tests**:

   ```bash
   npm run test
   ```

2. **Run tests with coverage report**:

   ```bash
   npm run test:coverage
   ```

3. **View Results**: After running the tests, Vitest will display the results in the terminal, including any errors or passing tests. If you ran with `--coverage`, it will also show the test coverage report.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request.

---

### Contact

For questions or support, contact `dev@movemates.co.za`.
```