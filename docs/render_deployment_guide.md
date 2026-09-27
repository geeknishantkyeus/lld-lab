# Render Deployment Guide

## Step 1: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Verify email

## Step 2: Create PostgreSQL Database

1. Dashboard → "New +" → "PostgreSQL"
2. Configure:
   - Name: lld-lab-db
   - Database: lld_lab
   - User: lld_user
   - Region: Singapore (Southeast Asia)
   - PostgreSQL Version: 16
   - Plan: Free
3. Click "Create Database"
4. Wait 2-3 minutes
5. Copy "Internal Database URL" (for backend)
6. Copy "External Database URL" (for local testing)

## Step 3: Create Redis

1. Dashboard → "New +" → "Key Value"
2. Configure:
   - Name: lld-lab-redis
   - Region: Singapore (Southeast Asia)
   - Plan: Free
   - Maxmemory Policy: allkeys-lru
3. Click "Create Redis"
4. Wait 2 minutes
5. Copy "Internal Redis URL" (for backend)
6. Copy "External Redis URL" (for local testing)

## Step 4: Run Migrations (After Backend Deploy)

Once backend is deployed, open Render Shell:

cd backend
npm run db:push
npm run db:seed

Expected:
- Tables created (problems, users, attempts, feedbacks)
- 3 problems seeded

## Step 5: Verify

Check Render dashboard:
- PostgreSQL status: Available
- Redis status: Available
