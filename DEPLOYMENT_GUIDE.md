# Deploying Personal Goal Web to Vercel

Since your application uses a database and authentication, deploying to Vercel requires moving away from the local SQLite file (which doesn't work in Vercel's serverless environment) to a cloud database like **Vercel Postgres**.

Follow these steps to deploy your application successfully.

## Prerequisites
- A [GitHub](https://github.com/) account.
- A [Vercel](https://vercel.com/) account.

---

## Step 1: Push Code to GitHub
1. Create a new "Private" repository on GitHub (e.g., `personal-goal-web`).
2. Run these commands in your terminal to push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/personal-goal-web.git
   git push -u origin main
   ```

## Step 2: Create Project on Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** -> **"Project"**.
3. Select the `personal-goal-web` repository you just created.
4. Leave the settings as default for now, but **DO NOT deploy yet**.

## Step 3: Set Up the Database (Vercel Postgres)
1. After importing (or from the project dashboard), go to the **Storage** tab.
2. Click **"Connect Store"** -> select **"Postgres"**.
3. Accept the terms and click **"Create"**.
4. Once created, Vercel will automatically generate environment variables (like `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, etc.) for your project.

## Step 4: Update Your Code for Postgres
Vercel cannot use the `sqlite` provider found in your `prisma/schema.prisma`. You must switch to `postgresql`.

1. Open `prisma/schema.prisma` and change the `datasource` block:

   ```prisma
   // prisma/schema.prisma

   generator client {
     provider = "prisma-client-js"
   }

   datasource db {
     provider = "postgresql"
     // Uses the connection string from Vercel environment variables
     url      = env("POSTGRES_PRISMA_URL") 
     // Direct connection for migrations
     directUrl = env("POSTGRES_URL_NON_POOLING") 
   }
   // ... rest of your schema
   ```

2. Generate the new client:
   ```bash
   npx prisma generate
   ```

3. Commit and push these changes to GitHub:
   ```bash
   git add .
   git commit -m "Switch to Postgres for Vercel"
   git push
   ```

## Step 5: Configure Environment Variables
Go to **Settings** -> **Environment Variables** in your Vercel Project.

1. **Auto-added**: You should already see `POSTGRES_...` variables from Step 3.
2. **Add Manual Variables**:
   - `NEXTAUTH_SECRET`: Generate one (use `openssl rand -base64 32` or a random string).
   - `NEXTAUTH_URL`: Set this to your Vercel domain (e.g., `https://personal-goal-web.vercel.app`) once you have it. For the initial deployment, you might not strictly need it, but it's recommended.

## Step 6: Initialize the Database
Since the database is new, it has no tables. You need to push your schema to it.

**Option A: Run from your local machine (Easiest)**
1. Go to your Vercel Project -> Storage -> Postgres -> **.env.local** tab.
2. Copy the contents correctly.
3. Paste them into your local `.env` file (temporarily replacing your sqlite config).
4. Run:
   ```bash
   npx prisma db push
   ```
   *This commands creates the tables in your live Vercel database.*

**Option B: Add a Build Command**
You can update `package.json` to push DB changes on build, but Option A is safer for now.

## Step 7: Deploy
1. Vercel automatically deploys when you push to main. If the previous build failed (because of the sqlite error), go to **Deployments** and click **Redeploy**.
2. Your app should now be live and connected to the Postgres database!

## Critical Note on Data
Your local data (in `dev.db`) **will not** be transferred automatically. You will start with an empty database on Vercel.
