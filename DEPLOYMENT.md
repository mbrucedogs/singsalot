# Deployment Guide - Multi-Project Firebase Setup

This project uses a multi-project Firebase setup where:
- **Web App**: Hosted on `sings-a-lot` project
- **Database & Functions**: Hosted on `firebase-herse` project

## Project Structure

```
sings-a-lot (webapp)     ← Frontend hosting
firebase-herse (database) ← Database, Functions, Rules
```

## Deployment Commands

### Deploy Web App Only (to sings-a-lot)
```bash
npm run deploy:webapp
```

### Deploy Database & Functions Only (to firebase-herse)
```bash
npm run deploy:database
```

### Deploy Everything
```bash
npm run deploy:all
```

## Manual Deployment Steps

### 1. Deploy Web App
```bash
# Build the app
npm run build

# Switch to webapp project
firebase use webapp

# Deploy hosting
firebase deploy --only hosting
```

### 2. Deploy Database & Functions
```bash
# Switch to database project
firebase use sings-a-lot-database

# Deploy database rules and functions
firebase deploy --only database,functions
```

## Environment Configuration

Make sure your `.env` file points to the correct database project:

```env
# These should point to firebase-herse (database project)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=firebase-herse.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://firebase-herse-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=firebase-herse
VITE_FIREBASE_STORAGE_BUCKET=firebase-herse.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id

# App Configuration
VITE_CONTROLLER_NAME=default
VITE_APP_TITLE=SingSalot AI
```

## Firebase Project Aliases

- `webapp` → `sings-a-lot` (frontend hosting)
- `sings-a-lot-database` → `firebase-herse` (database, functions, rules)

## Troubleshooting

### If you get permission errors:
1. Make sure you're logged into Firebase CLI: `firebase login`
2. Check your project access: `firebase projects:list`
3. Verify project aliases: `firebase use`

### If database connection fails:
1. Check that your `.env` file points to the correct database project
2. Verify database rules are deployed to the correct project
3. Check Firebase console for the correct project

### If functions don't work:
1. Make sure functions are deployed to the database project
2. Check function logs: `firebase functions:log`
3. Verify function configuration in `functions/src/index.ts` 