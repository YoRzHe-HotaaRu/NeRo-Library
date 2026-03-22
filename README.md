# NeRo Library

A simple website to browse, search, and discover anime series and movies. Made by: YiorZhe and Shiouko

---

## What Is This?

NeRo Library is a website that lets you explore thousands of anime titles. You can search for specific shows, browse by genre, and see which anime are currently airing or highly rated.

All the anime information comes from MyAnimeList, one of the largest anime databases on the internet.

---

## What Can You Do With It?

- **Browse Top Anime** - See the highest-rated anime of all time
- **See What's Airing** - Check out anime that are currently being broadcast
- **Search** - Find any anime by typing its name
- **Browse by Genre** - Explore anime categories like Action, Comedy, Romance, etc.
- **View Details** - Click on any anime to see its rating, episodes, synopsis, studios, and more
- **Create an Account** - Register with email and password (with captcha protection)
- **Save to Library** - Add anime to your personal library
- **Track Episodes** - Mark which episodes you've watched
- **Rate Anime** - Give your own score to anime you've watched

---

## How Do You Use It?

1. Open the website in your browser
2. Use the navigation menu at the top:
   - **Home** - Main page with top and current anime
   - **Search** - Find anime by name
   - **Genres** - Browse anime by category
   - **My Library** - View your saved anime (when logged in)
3. Click on any anime image or name to see more details
4. Use the "Next" and "Previous" buttons to browse through more results
5. Register an account to save anime and track your watching progress

---

## Setting Up Your Library

1. Click **Register** to create an account
2. Complete the captcha and fill in your details
3. Login with your email and password
4. Browse anime and click **Add to Library** on any anime page
5. Go to **My Library** to see all your saved anime
6. Use **Track Episodes** to mark episodes as watched
7. Update status (Watching, Completed, etc.) and add your own score

---

## How Do I Run This Website?

### What You Need First

1. **Node.js** - Download from [nodejs.org](https://nodejs.org) (version 18 or newer)
2. A **command line/terminal** program
   - Windows: Command Prompt or PowerShell
   - Mac/Linux: Terminal

### Steps to Run

1. Download or copy the project folder to your computer
2. Open your command line/terminal
3. Go to the project folder:
   ```
   cd anime-library
   ```

4. Install what the website needs:
   ```
   npm install
   ```

5. Set up the database:
   ```
   npx prisma generate
   npx prisma db push
   ```

6. Start the website:
   ```
   npm run dev
   ```

7. Open your browser and go to: `http://localhost:3000`

### Environment Settings (Optional)

The website works out of the box, but you can customize settings in the `.env` file:

```
# Database (SQLite is used by default - no changes needed for local use)
DATABASE_URL="file:./dev.db"

# Login Security
NEXTAUTH_SECRET="any-random-secret-text-here"
NEXTAUTH_URL="http://localhost:3000"

# Captcha (Test keys work by default)
NEXT_PUBLIC_HCAPTCHA_SITE_KEY="10000000-ffff-ffff-ffff-000000000001"
HCAPTCHA_SECRET_KEY="0x0000000000000000000000000000000000000000"
```

#### Getting Real Captcha Keys (Optional)

For production use, get free captcha keys at [hcaptcha.com](https://www.hcaptcha.com/):

1. Go to hcaptcha.com and create a free account
2. Add your website
3. Copy the **Site Key** and **Secret Key**
4. Update the `.env` file with your real keys

---

## Deploying to the Internet

### Option 1: Vercel (Easiest, Free)

1. Create a free account at [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Add these environment variables in Vercel:
   - `DATABASE_URL` - Use a PostgreSQL connection string (see below)
   - `NEXTAUTH_SECRET` - Generate at [generate-secret.now.sh](https://generate-secret.now.sh/32)
   - `NEXTAUTH_URL` - Your Vercel app URL (e.g., `https://your-app.vercel.app`)
   - `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` - Your hCaptcha site key
   - `HCAPTCHA_SECRET_KEY` - Your hCaptcha secret key

### Option 2: Any Hosting Provider

Most hosting providers that support Node.js will work:
- Railway
- Render
- DigitalOcean
- AWS
- Your own server

### Database for Production

SQLite works for local testing, but for production you need PostgreSQL:

#### Free PostgreSQL Options:

1. **Neon** (Recommended) - [neon.tech](https://neon.tech)
   - Create free account
   - Create a database
   - Copy the connection string
   - Set as `DATABASE_URL` in your environment

2. **Supabase** - [supabase.com](https://supabase.com)
   - Create free project
   - Go to Settings > Database
   - Copy connection string

3. **Vercel Postgres** - Built into Vercel
   - Add Postgres in your Vercel project settings

#### After setting up PostgreSQL:

```bash
# Update your .env with the PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Push the schema to your database
npx prisma db push
```

---

## Is This Website Safe for the API?

Yes! The website is designed to be respectful to the anime data service (Jikan API):

- **Waits between requests** - It pauses 1 second between each request so it does not overwhelm the service
- **Caches results** - If you look at the same page twice, it remembers the data for 5 minutes instead of asking again
- **Handles errors politely** - If the service is busy, it automatically waits and tries again a few times before giving up

This means you can browse freely without worrying about causing problems for the data service.

---

## What Technology Does It Use?

For the curious, this website is built with:

- **Next.js** - A framework for building websites
- **React** - A library for creating interactive pages
- **TypeScript** - A safer version of JavaScript
- **Tailwind CSS** - For styling (though we use classic 2000s-style design!)
- **Prisma** - For database management
- **NextAuth.js** - For user authentication
- **hCaptcha** - For bot protection on login/register
- **Jikan API** - A free service that provides anime data from MyAnimeList

---

## Classic Design

The website uses a nostalgic 2000s web design style:

- Simple fonts (Verdana, Arial)
- Table-based layouts
- Inset and outset button borders
- No gradients or flashy effects
- Clean, readable structure

It looks like the websites from the early internet era - simple, functional, and easy to navigate.

---

## Troubleshooting

**"Failed to load anime data"**
- Wait a minute and click "Try Again"
- The data service might be temporarily busy

**"No results found" when searching**
- Check your spelling
- Try searching for a shorter or different part of the name

**Page loads slowly**
- The first load may take a moment as data is being fetched
- Subsequent visits to the same page will be faster (cached for 5 minutes)

**Can't login or register**
- Make sure you completed the captcha
- Check that your password is at least 6 characters
- Make sure your email is not already registered

**Database errors**
- Run `npx prisma db push` to sync the database
- Make sure your `.env` file has the correct `DATABASE_URL`

---

## Credits

Anime data provided by [Jikan API](https://jikan.moe/) (unofficial MyAnimeList API)

---

## License

This project is for educational and personal use.
