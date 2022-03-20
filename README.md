# QWIZ

App for building pub quizes

## Installation and running locally

Clone the repo

```bash
  git clone https://github.com/mislavjc/qwiz.git qwiz
  cd qwiz
```
Install compatable Node version and deps
```bash
  node -v #16.13.2
  npm i
```
Start the frontend server
```bash
  npm run start frontend
```
Start the backend server
```bash
  npm run start backend
```

## Environment Variables

To run this project, add the following environment variables to your .env.local file in apps/frontend dir

`NEXTAUTH_URL=http://localhost:4200`

`GITHUB_CLIENT_ID`

`GITHUB_CLIENT_SECRET`

`GOOGLE_CLIENT_SECRET`

`GOOGLE_CLIENT_SECRET`

`SECRET={any string}`

And to your .env file in root dir (for Prisma)

`DATABASE_URL="DATABASE_URL="mysql://url"`