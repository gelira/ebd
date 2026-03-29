import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '../generated/prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      'info',
      'warn',
      'error'
    ],
  })

prisma.$on('query' as never, (e: any) => {
  console.log('Query: ' + e.query);
  console.log('Params: ' + e.params);
  console.log('-----------------------------------------------------')
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
