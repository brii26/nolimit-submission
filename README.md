# nolimit-submission

Test Nodejs Backend Engineer - Soal 1 (SUBMISSION)

## Stack

| | |
|:---|:---|
| Runtime | Node.js + Express |
| ORM | Prisma |
| Database | MySQL |

## Endpoints

| Method | Endpoint | Auth |
|:---|:---|:---|
| POST | /api/auth/register | No |
| POST | /api/auth/login | No |
| GET | /api/posts | No |
| GET | /api/posts/:id | No |
| POST | /api/posts | Yes |
| PATCH | /api/posts/:id | Yes (author only) |
| DELETE | /api/posts/:id | Yes (author only) |

## Setup

**1. Clone and install dependencies**
```bash
pnpm install
```

**2. Configure environment**
```bash
cp .env.example .env
```

**3. Start the database**
```bash
docker compose up -d
```

**4. Run migrations**
```bash
pnpm prisma migrate dev
```

**5. Start the server**
```bash
pnpm run dev
```

## Testing

```bash
pnpm test
```
