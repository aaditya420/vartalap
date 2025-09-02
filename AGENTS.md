# T3 Stack Best Practices Guide

This guide provides comprehensive best practices for using the T3 Stack - a full-stack, typesafe web application framework consisting of Next.js, TypeScript, tRPC, Prisma, NextAuth.js, and Tailwind CSS.

## Table of Contents

1. [T3 Stack Overview](#t3-stack-overview)
2. [Next.js App Router Best Practices](#nextjs-app-router-best-practices)
3. [Prisma ORM Best Practices](#prisma-orm-best-practices)
4. [tRPC Best Practices](#trpc-best-practices)
5. [PostgreSQL Integration](#postgresql-integration)
6. [Project Structure](#project-structure)
7. [Performance Guidelines](#performance-guidelines)
8. [Security Best Practices](#security-best-practices)
9. [Development Workflow](#development-workflow)
10. [Deployment Guidelines](#deployment-guidelines)

## T3 Stack Overview

The T3 Stack is a curated collection of technologies designed to build full-stack, typesafe web applications with maximum developer experience and minimal configuration overhead.

### Core Components

- **Next.js**: Full-stack React framework with App Router
- **TypeScript**: Static type checking and enhanced developer experience
- **tRPC**: End-to-end typesafe APIs without code generation
- **Prisma**: Type-safe database ORM with excellent DX
- **NextAuth.js**: Complete authentication solution
- **Tailwind CSS**: Utility-first CSS framework
- **PostgreSQL**: Production-ready relational database

### Getting Started

```bash
# Initialize a new T3 app
npm create t3-app@latest
yarn create t3-app
pnpm create t3-app@latest
bun create t3-app@latest

# With specific options (CI mode)
pnpm create t3-app@latest --CI --trpc --tailwind --prisma --nextAuth --dbProvider postgres
```

## Next.js App Router Best Practices

### File Structure and Organization

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout with providers
│   ├── globals.css           # Global styles
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── trpc/[trpc]/route.ts
│   └── _components/          # Shared components
└── server/
    ├── api/                  # tRPC routers
    ├── auth.ts              # NextAuth configuration
    └── db.ts                # Database client
```

### Component Patterns

#### Server Components (Default)
```tsx
// Leverage server components for data fetching
export default async function BlogPage() {
  const posts = await getPosts();
  
  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  );
}
```

#### Client Components
```tsx
'use client'

import { useSession } from "next-auth/react"

export default function ClientComponent() {
  const { data: session } = useSession()
  
  return <div>{session?.user?.name}</div>
}
```

### Data Fetching Strategies

#### Static Data (Build-time)
```tsx
export default async function Page() {
  // Cached until manually invalidated (like getStaticProps)
  const staticData = await fetch('https://api.example.com/data', { 
    cache: 'force-cache' 
  });
  
  return <div>{/* ... */}</div>;
}
```

#### Dynamic Data (Request-time)
```tsx
export default async function Page() {
  // Refetched on every request (like getServerSideProps)
  const dynamicData = await fetch('https://api.example.com/data', { 
    cache: 'no-store' 
  });
  
  return <div>{/* ... */}</div>;
}
```

#### Revalidated Data
```tsx
export default async function Page() {
  // Cached with 10-second lifetime
  const revalidatedData = await fetch('https://api.example.com/data', {
    next: { revalidate: 10 },
  });
  
  return <div>{/* ... */}</div>;
}
```

### Layout Best Practices

#### Root Layout
```tsx
// app/layout.tsx
import { TRPCReactProvider } from "@/trpc/react"
import { SessionProvider } from "next-auth/react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <TRPCReactProvider>
            {children}
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
```

#### Nested Layouts
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
```

### Error Handling

#### Error Boundaries
```tsx
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

#### 404 Pages
```tsx
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  )
}
```

### Performance Optimizations

#### Streaming with Suspense
```tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      <h1>Posts</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Posts />
      </Suspense>
    </div>
  )
}
```

#### Parallel Data Fetching
```tsx
export default async function Page() {
  // Fetch data in parallel to reduce waterfalls
  const [posts, users] = await Promise.all([
    getPosts(),
    getUsers(),
  ]);
  
  return (
    <div>
      <Posts posts={posts} />
      <Users users={users} />
    </div>
  );
}
```

## Prisma ORM Best Practices

### Schema Design

#### Model Definitions
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["jsonProtocol"] // Better performance in serverless
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  posts     Post[]
  profile   Profile?
  
  @@map("users") // Map to snake_case table name
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Foreign key
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  @@map("posts")
}

model Profile {
  id     String  @id @default(cuid())
  bio    String?
  userId String  @unique
  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("profiles")
}
```

#### Field Conventions
```prisma
model Example {
  id          String    @id @default(cuid())
  title       String    @db.VarChar(255)        // Specify database type
  content     String?                           // Optional field
  isPublished Boolean   @default(false)         // Default value
  metadata    Json?                            // JSON field
  tags        String[]                         // Array field (PostgreSQL)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Indexes
  @@index([title])
  @@index([createdAt, isPublished])
  @@unique([title, createdAt])
}
```

### Client Usage

#### Global Client Instance
```typescript
// src/server/db.ts
import { PrismaClient } from '@prisma/client'

const createPrismaClient = () =>
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development" 
        ? ["query", "error", "warn"] 
        : ["error"],
  })

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
```

#### Query Patterns

**Basic CRUD Operations**
```typescript
// Create
const user = await db.user.create({
  data: {
    email: "user@example.com",
    name: "John Doe",
    profile: {
      create: {
        bio: "Software Developer"
      }
    }
  },
  include: {
    profile: true
  }
});

// Read with relations
const posts = await db.post.findMany({
  where: { published: true },
  include: {
    author: {
      select: {
        name: true,
        email: true
      }
    }
  },
  orderBy: { createdAt: 'desc' },
  take: 10,
});

// Update
const updatedPost = await db.post.update({
  where: { id: postId },
  data: { 
    title: "Updated Title",
    updatedAt: new Date()
  },
});

// Delete with cascading
await db.user.delete({
  where: { id: userId }
});
```

**Advanced Queries**
```typescript
// Transactions
await db.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: "user@example.com" }
  });
  
  await tx.post.create({
    data: {
      title: "First Post",
      authorId: user.id
    }
  });
});

// Aggregations
const userStats = await db.user.aggregate({
  _count: { id: true },
  _avg: { posts: { _count: true } },
  where: { createdAt: { gte: new Date('2024-01-01') } }
});

// Raw queries (when needed)
const result = await db.$queryRaw`
  SELECT u.name, COUNT(p.id) as post_count
  FROM users u
  LEFT JOIN posts p ON u.id = p.author_id
  GROUP BY u.id, u.name
`;
```

### Performance Optimizations

#### Query Optimization
```typescript
// Use select to limit fields
const users = await db.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    // Avoid fetching unnecessary fields
  }
});

// Use include judiciously
const posts = await db.post.findMany({
  include: {
    author: {
      select: { name: true } // Only select needed fields
    }
  }
});

// Pagination
const posts = await db.post.findMany({
  skip: page * limit,
  take: limit,
  orderBy: { createdAt: 'desc' }
});
```

#### Connection Management
```typescript
// Avoid creating multiple instances
// ❌ Don't do this
async function badExample() {
  const prisma = new PrismaClient();
  return prisma.user.findMany();
}

// ✅ Use singleton pattern
import { db } from '@/server/db';

async function goodExample() {
  return db.user.findMany();
}
```

### Database Migrations

#### Development Workflow
```bash
# Create and apply migration
npx prisma migrate dev --name init

# Reset database (development only)
npx prisma migrate reset

# Generate client after schema changes
npx prisma generate

# Push schema changes (prototyping)
npx prisma db push
```

#### Production Deployment
```bash
# Apply pending migrations in production
npx prisma migrate deploy

# Generate client
npx prisma generate
```

#### Database Seeding
```typescript
// prisma/seed.ts
import { db } from "../src/server/db";

async function main() {
  await db.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      posts: {
        create: [
          {
            title: "First Post",
            content: "This is the first post",
            published: true,
          }
        ]
      }
    },
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
```

## tRPC Best Practices

### Router Setup

#### Base Configuration
```typescript
// src/server/api/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { type Context } from './context';
import superjson from 'superjson';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Protected procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
```

#### Context Creation
```typescript
// src/server/api/context.ts
import { type NextRequest } from "next/server";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";

export const createTRPCContext = async (opts: {
  req: NextRequest;
}) => {
  const session = await getServerAuthSession();

  return {
    db,
    session,
    ...opts,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
```

### Procedure Patterns

#### Query Procedures
```typescript
// src/server/api/routers/posts.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit, cursor } = input;
      
      const posts = await ctx.db.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { name: true, image: true }
          }
        }
      });
      
      let nextCursor: string | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
      }
      
      return {
        items: posts,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
        include: {
          author: {
            select: { name: true, image: true }
          }
        }
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      return post;
    }),
});
```

#### Mutation Procedures
```typescript
export const postsRouter = createTRPCRouter({
  // ... query procedures

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        content: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db.post.create({
        data: {
          title: input.title,
          content: input.content,
          authorId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(255).optional(),
        content: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      
      // Check ownership
      const post = await ctx.db.post.findUnique({
        where: { id },
        select: { authorId: true }
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      if (post.authorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You can only edit your own posts',
        });
      }

      return ctx.db.post.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Similar ownership check...
      return ctx.db.post.delete({
        where: { id: input.id },
      });
    }),
});
```

### Client-Side Usage

#### React Query Integration
```typescript
// src/app/_components/posts-list.tsx
'use client';

import { api } from '@/trpc/react';

export function PostsList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = api.posts.getAll.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.pages.map((page) =>
        page.items.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      )}
      
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

#### Mutations with Optimistic Updates
```typescript
// src/app/_components/create-post-form.tsx
'use client';

import { api } from '@/trpc/react';

export function CreatePostForm() {
  const utils = api.useUtils();
  
  const createPost = api.posts.create.useMutation({
    async onMutate(newPost) {
      // Cancel outgoing fetches
      await utils.posts.getAll.cancel();

      // Get previous data
      const previousPosts = utils.posts.getAll.getInfiniteData();

      // Optimistically update
      utils.posts.getAll.setInfiniteData(
        { limit: 10 },
        (old) => {
          if (!old) return { pages: [], pageParams: [] };
          
          const newPostWithId = {
            id: 'temp-' + Date.now(),
            ...newPost,
            author: { name: 'You', image: null },
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          return {
            ...old,
            pages: [
              {
                items: [newPostWithId, ...old.pages[0]!.items],
                nextCursor: old.pages[0]!.nextCursor,
              },
              ...old.pages.slice(1),
            ],
          };
        }
      );

      return { previousPosts };
    },
    
    onError(err, newPost, context) {
      // Revert optimistic update
      if (context?.previousPosts) {
        utils.posts.getAll.setInfiniteData(
          { limit: 10 },
          context.previousPosts
        );
      }
    },
    
    onSettled() {
      // Sync with server
      utils.posts.getAll.invalidate();
    },
  });

  const handleSubmit = (data: { title: string; content?: string }) => {
    createPost.mutate(data);
  };

  // Form JSX...
}
```

### Error Handling

#### Centralized Error Handling
```typescript
// src/server/api/trpc.ts
export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure.use(async ({ next, ctx }) => {
  try {
    return await next({ ctx });
  } catch (error) {
    // Log error
    console.error('tRPC Error:', error);
    
    // Re-throw for client
    throw error;
  }
});
```

#### Client Error Handling
```typescript
// src/trpc/react.tsx
import { TRPCClientError } from '@trpc/client';
import type { AppRouter } from '@/server/api/root';

export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

// Usage in components
export function PostsList() {
  const { data, error } = api.posts.getAll.useQuery();

  if (error) {
    if (isTRPCClientError(error)) {
      // Handle tRPC-specific errors
      return <div>API Error: {error.message}</div>;
    }
    return <div>Unexpected error occurred</div>;
  }

  // Render posts...
}
```

### Middleware Patterns

#### Rate Limiting Middleware
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export const rateLimitedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const identifier = ctx.req.ip ?? 'anonymous';
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(identifier);

  if (!success) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Rate limit exceeded',
    });
  }

  return next({ ctx });
});
```

#### Input Validation Middleware
```typescript
export const validateOwnership = <T extends { userId: string }>(
  procedure: any
) =>
  procedure.use(async ({ ctx, input, next }: { ctx: any; input: T; next: any }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    if (input.userId !== ctx.session.user.id) {
      throw new TRPCError({ 
        code: 'FORBIDDEN',
        message: 'You can only access your own resources'
      });
    }

    return next({ ctx, input });
  });
```

## PostgreSQL Integration

### Connection Configuration

#### Database URL Setup
```bash
# .env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# For connection pooling (recommended for production)
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?connection_limit=10&pool_timeout=20"
```

#### Connection Pooling with PgBouncer
```ini
# pgbouncer.ini
[databases]
myapp = host=localhost port=5432 dbname=myapp

[pgbouncer]
listen_port = 6432
listen_addr = 127.0.0.1
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
server_reset_query = DISCARD ALL
max_client_conn = 1000
default_pool_size = 20
max_db_connections = 25
```

### Performance Optimization

#### Prisma Configuration
```prisma
// prisma/schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["jsonProtocol", "metrics"] // Performance features
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### Connection Management
```typescript
// src/server/db.ts
import { PrismaClient } from '@prisma/client';

const createPrismaClient = () =>
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Global instance to prevent connection exhaustion
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

#### Query Optimization
```sql
-- Add indexes for common queries
CREATE INDEX CONCURRENTLY idx_posts_author_created ON posts(author_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_posts_published ON posts(published) WHERE published = true;
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- Partial indexes for soft deletes
CREATE INDEX CONCURRENTLY idx_posts_active ON posts(created_at DESC) WHERE deleted_at IS NULL;

-- Composite indexes for complex queries
CREATE INDEX CONCURRENTLY idx_posts_search ON posts USING gin(to_tsvector('english', title || ' ' || content));
```

### Database Configuration

#### PostgreSQL Settings
```sql
-- postgresql.conf optimizations
shared_buffers = 256MB                    -- 25% of RAM for dedicated servers
effective_cache_size = 4GB                -- Estimate of OS file cache
work_mem = 64MB                          -- Memory for complex queries
maintenance_work_mem = 256MB              -- Memory for maintenance operations
max_connections = 200                     -- Adjust based on application needs
max_wal_size = 2GB                       -- WAL file size limits
checkpoint_completion_target = 0.9        -- Checkpoint timing
random_page_cost = 1.1                   -- SSD optimization

-- Performance monitoring
log_statement = 'mod'                     -- Log modifications
log_min_duration_statement = 1000         -- Log slow queries (1s+)
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
```

#### Connection Security
```sql
-- Create application user with limited privileges
CREATE USER myapp_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE myapp TO myapp_user;
GRANT USAGE ON SCHEMA public TO myapp_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO myapp_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO myapp_user;

-- Set default privileges for new tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO myapp_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO myapp_user;
```

### Backup and Monitoring

#### Automated Backups
```bash
#!/bin/bash
# backup_db.sh
export PGPASSWORD=$DATABASE_PASSWORD

# Full backup
pg_dump -h localhost -U myapp_user -d myapp \
  --format=custom \
  --no-owner \
  --no-acl \
  --file="/backups/myapp_$(date +%Y%m%d_%H%M%S).dump"

# Cleanup old backups (keep last 30 days)
find /backups -name "myapp_*.dump" -mtime +30 -delete
```

#### Monitoring Queries
```sql
-- Monitor slow queries
SELECT query, mean_exec_time, calls, total_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 1000  -- Queries slower than 1 second
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Monitor table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Monitor connection count
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';
```

## Project Structure

The T3 Stack follows a specific folder structure optimized for full-stack development:

```
my-t3-app/
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
│
├── public/                     # Static assets
│   └── favicon.ico
│
└── src/
    ├── app/                    # Next.js App Router
    │   ├── layout.tsx          # Root layout
    │   ├── page.tsx           # Homepage
    │   ├── globals.css        # Global styles
    │   ├── api/
    │   │   ├── auth/[...nextauth]/route.ts
    │   │   └── trpc/[trpc]/route.ts
    │   └── _components/       # Shared components
    │
    ├── server/                # Server-side code
    │   ├── api/              # tRPC routers
    │   │   ├── routers/      # Individual route files
    │   │   ├── root.ts       # Root router
    │   │   └── trpc.ts       # tRPC configuration
    │   ├── auth.ts           # NextAuth configuration
    │   └── db.ts             # Database client
    │
    ├── trpc/                 # tRPC client setup
    │   ├── react.tsx         # React Query integration
    │   └── server.ts         # Server-side client
    │
    ├── styles/               # Additional styles
    │
    └── env.js                # Environment validation
```

### Component Organization

```
src/app/_components/
├── ui/                       # Reusable UI components
│   ├── button.tsx
│   ├── input.tsx
│   ├── modal.tsx
│   └── index.ts             # Barrel exports
│
├── forms/                   # Form components
│   ├── auth-form.tsx
│   ├── post-form.tsx
│   └── user-form.tsx
│
├── layouts/                 # Layout components
│   ├── header.tsx
│   ├── footer.tsx
│   ├── sidebar.tsx
│   └── navigation.tsx
│
└── features/               # Feature-specific components
    ├── auth/
    │   ├── login-form.tsx
    │   └── user-profile.tsx
    └── posts/
        ├── post-list.tsx
        ├── post-card.tsx
        └── post-detail.tsx
```

## Performance Guidelines

### Database Performance

#### Query Optimization
```typescript
// ❌ Avoid N+1 queries
const posts = await db.post.findMany();
for (const post of posts) {
  const author = await db.user.findUnique({ where: { id: post.authorId } });
}

// ✅ Use include or select to fetch related data
const posts = await db.post.findMany({
  include: {
    author: {
      select: { name: true, email: true }
    }
  }
});

// ✅ Use dataloader pattern for complex scenarios
import DataLoader from 'dataloader';

const userLoader = new DataLoader(async (userIds: readonly string[]) => {
  const users = await db.user.findMany({
    where: { id: { in: [...userIds] } }
  });
  return userIds.map(id => users.find(user => user.id === id));
});
```

#### Connection Pooling
```typescript
// src/server/db.ts
const createPrismaClient = () =>
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Connection pooling configuration
  });

// Use environment variables for pool size
// DATABASE_URL="postgresql://user:pass@localhost:5432/db?connection_limit=10&pool_timeout=20"
```

### Frontend Performance

#### Code Splitting
```typescript
// Dynamic imports for heavy components
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./heavy-chart'));

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Loading chart...</div>}>
        <HeavyChart />
      </Suspense>
    </div>
  );
}
```

#### Image Optimization
```tsx
import Image from 'next/image';

export default function ProfilePicture({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={300}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      priority // For above-the-fold images
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

#### React Query Configuration
```typescript
// src/trpc/react.tsx
import { QueryClient } from '@tanstack/react-query';

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.data?.httpStatus >= 400 && error?.data?.httpStatus < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
});
```

## Security Best Practices

### Authentication & Authorization

#### NextAuth.js Configuration
```typescript
// src/server/auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { db } from "@/server/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    // Secure JWT handling
    jwt: ({ token, user }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "database", // More secure than JWT for sensitive apps
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
```

#### Role-Based Access Control
```typescript
// src/server/api/routers/admin.ts
export const adminRouter = createTRPCRouter({
  getAllUsers: createTRPCRouter.procedure
    .use(async ({ ctx, next }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { role: true }
      });

      if (user?.role !== 'ADMIN') {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return next({ ctx });
    })
    .query(async ({ ctx }) => {
      return ctx.db.user.findMany({
        select: { id: true, name: true, email: true, createdAt: true }
      });
    }),
});
```

### Input Validation & Sanitization

#### Zod Schema Validation
```typescript
import { z } from "zod";

// Comprehensive validation schemas
export const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number, and special character"
    ),
  age: z.number().int().min(13).max(120).optional(),
});

// XSS prevention
export const sanitizeHtml = (input: string): string => {
  // Use a library like DOMPurify for production
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};
```

#### SQL Injection Prevention
```typescript
// ✅ Prisma automatically prevents SQL injection
const user = await db.user.findFirst({
  where: {
    email: userInput, // Safe with Prisma
  }
});

// ❌ Raw queries need parameterization
const users = await db.$queryRaw`
  SELECT * FROM users WHERE email = ${userInput}
`; // This is safe because Prisma parameterizes

// ❌ Never do this
const query = `SELECT * FROM users WHERE email = '${userInput}'`;
```

### Environment Variables & Secrets

#### Environment Validation
```typescript
// src/env.js
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      z.string().url(),
    ),
    DISCORD_CLIENT_ID: z.string().min(1),
    DISCORD_CLIENT_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
```

### Content Security Policy

#### Next.js CSP Configuration
```typescript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com;
  child-src *.youtube.com *.google.com *.twitter.com;
  style-src 'self' 'unsafe-inline' *.googleapis.com;
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self' *.gstatic.com;
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'false',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

## Development Workflow

### Development Setup

#### Package Scripts
```json
{
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "lint": "next lint",
    "start": "next start",
    "type-check": "tsc --noEmit",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "tsx prisma/seed.ts",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

#### Git Hooks with Husky
```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
npm run type-check
```

### Testing Strategy

#### Unit Tests with Jest
```typescript
// src/__tests__/utils.test.ts
import { describe, expect, test } from '@jest/globals';
import { formatDate, slugify } from '../utils';

describe('Utils', () => {
  describe('formatDate', () => {
    test('formats date correctly', () => {
      const date = new Date('2023-01-01T00:00:00.000Z');
      expect(formatDate(date)).toBe('January 1, 2023');
    });
  });

  describe('slugify', () => {
    test('creates proper slug', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });
  });
});
```

#### Integration Tests with tRPC
```typescript
// src/__tests__/api/posts.test.ts
import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';
import { db } from '@/server/db';

describe('Posts API', () => {
  const caller = appRouter.createCaller(
    await createTRPCContext({ req: {} as any })
  );

  beforeEach(async () => {
    await db.post.deleteMany();
    await db.user.deleteMany();
  });

  test('creates post successfully', async () => {
    const user = await db.user.create({
      data: { email: 'test@example.com', name: 'Test User' }
    });

    const ctx = await createTRPCContext({
      req: {} as any,
      session: { user: { id: user.id } }
    });

    const caller = appRouter.createCaller(ctx);
    
    const post = await caller.posts.create({
      title: 'Test Post',
      content: 'This is a test post'
    });

    expect(post.title).toBe('Test Post');
    expect(post.authorId).toBe(user.id);
  });
});
```

#### E2E Tests with Playwright
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can sign in', async ({ page }) => {
    await page.goto('/auth/signin');
    
    await page.click('button:has-text("Sign in with Discord")');
    
    // Mock OAuth flow or use test credentials
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome');
  });

  test('protected routes redirect to signin', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/auth/signin');
  });
});
```

### Database Management

#### Migration Best Practices
```bash
# Create descriptive migration names
npx prisma migrate dev --name add_user_preferences

# Review migrations before applying
cat prisma/migrations/*/migration.sql

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

#### Database Seeding
```typescript
// prisma/seed.ts
import { db } from "../src/server/db";
import { hash } from "bcryptjs";

const seedUsers = [
  {
    email: "admin@example.com",
    name: "Admin User",
    role: "ADMIN",
  },
  {
    email: "user@example.com",
    name: "Regular User",
    role: "USER",
  },
];

const seedPosts = [
  {
    title: "Getting Started with T3 Stack",
    content: "Welcome to the T3 Stack...",
    published: true,
  },
  {
    title: "Advanced Patterns",
    content: "Learn advanced patterns...",
    published: false,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await db.post.deleteMany();
  await db.user.deleteMany();

  // Seed users
  const users = [];
  for (const userData of seedUsers) {
    const user = await db.user.create({
      data: userData,
    });
    users.push(user);
  }

  // Seed posts
  for (let i = 0; i < seedPosts.length; i++) {
    await db.post.create({
      data: {
        ...seedPosts[i]!,
        authorId: users[i % users.length]!.id,
      },
    });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await db.$disconnect();
    process.exit(1);
  });
```

## Deployment Guidelines

### Environment Configuration

#### Production Environment Variables
```bash
# .env.production
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-super-secret-key-here
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
```

### Vercel Deployment

#### Project Configuration
```json
// vercel.json (optional)
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

#### Build Optimization
```javascript
// next.config.js
/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    // Improve cold start performance
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  
  // Reduce bundle size
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@prisma/client": false,
      };
    }
    return config;
  },

  // Image optimization
  images: {
    domains: ["cdn.discordapp.com", "avatars.githubusercontent.com"],
    formats: ["image/webp", "image/avif"],
  },

  // Compression
  compress: true,

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = config;
```

### Docker Deployment

#### Multi-stage Dockerfile
```dockerfile
# Dependencies stage
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY prisma ./prisma
COPY package.json package-lock.json* ./
RUN npm ci

# Builder stage
FROM node:18-alpine AS builder
ARG DATABASE_URL
ARG NEXT_PUBLIC_APP_URL
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN SKIP_ENV_VALIDATION=1 npm run build

# Runner stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose for Development
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
    depends_on:
      - db
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Database Deployment

#### Production Migration Strategy
```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Starting deployment..."

# Backup database
echo "📦 Creating database backup..."
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Apply migrations
echo "🔄 Applying database migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "🏗️  Generating Prisma client..."
npx prisma generate

# Build application
echo "📋 Building application..."
npm run build

echo "✅ Deployment completed successfully!"
```

#### Database Connection in Production
```typescript
// Optimized connection for serverless
const createPrismaClient = () =>
  new PrismaClient({
    log: ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

export const db = globalForPrisma.prisma ?? createPrismaClient();

// Prevent connection leaks in serverless
if (process.env.NODE_ENV === "production") {
  // Clean up connections on process exit
  process.on('beforeExit', async () => {
    await db.$disconnect();
  });
}
```

### Monitoring & Observability

#### Error Tracking with Sentry
```typescript
// sentry.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.Integrations.Prisma({ client: db }),
  ],
});
```

#### Performance Monitoring
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const start = Date.now();

  const response = NextResponse.next();

  // Add performance headers
  response.headers.set('x-response-time', `${Date.now() - start}ms`);
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

### Health Checks

#### API Health Endpoint
```typescript
// app/api/health/route.ts
import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET() {
  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Database connection failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
```

---

This comprehensive guide covers the essential best practices for building production-ready applications with the T3 Stack. Each section provides practical examples and proven patterns to help you create scalable, secure, and maintainable applications.

Remember to always test your implementations thoroughly and adapt these practices to your specific use case and requirements.