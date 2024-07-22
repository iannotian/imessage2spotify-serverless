## iMessage2Spotify

This is a backend that powers the Apple Shortcut `iMessage2Spotify`.

## Development

### Running locally (easiest way)

- Add `.env` file with contents of `.env.example`
- Configure a Postgres DB and add that `DATABASE_URL` to `.env`
- Configure a Spotify Developer account, create an app, and add its client ID, secret, etc. to `.env`.
- Run `npm i`
- Run `npx prisma db push` to migrate the DB
- Run `npm run dev` to start the server
- Open [http://localhost:3000](http://localhost:3000) with your browser.

### Deployment

It's straightforward with Vercel: link your Git repo, update your environment variables, and you're good to go
