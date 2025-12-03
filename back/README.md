# Aim Trainer Backend API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure `.env` file with your MongoDB URL and JWT secret

3. Start the server:
```bash
npm run dev  # Development with nodemon
npm start    # Production
```

## API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user
```json
{
  "username": "player123",
  "password": "securepass"
}
```

Response:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "player123"
  }
}
```

#### POST `/api/auth/login`
Login existing user
```json
{
  "username": "player123",
  "password": "securepass"
}
```

Response: Same as register

### Leaderboard

#### GET `/api/leaderboard?limit=100`
Get top scores (default: 100)

Response:
```json
{
  "success": true,
  "data": [
    {
      "name": "player123",
      "score": 1500,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/leaderboard`
Submit a score

**Guest submission:**
```json
{
  "name": "GuestPlayer",
  "score": 1200
}
```

**Authenticated submission:**
```json
{
  "score": 1200
}
```
Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "data": {
    "name": "player123",
    "score": 1200,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Features

- Optional authentication - users can play as guests or create accounts
- JWT-based auth with 7-day expiration
- Authenticated users automatically use their username for leaderboard
- Guest players can submit with any name
- Scores sorted by highest first
- MongoDB for data persistence
