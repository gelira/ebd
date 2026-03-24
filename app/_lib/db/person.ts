import prisma from './prisma'

export async function getPersons({ churchId }: { churchId: number }) {
  return await prisma.person.findMany({
    where: { churchId },
    orderBy: { completeName: 'asc' },
  })
}

export async function getPerson({ id, churchId }: { churchId: number, id: number }) {
  return await prisma.person.findFirst({
    where: { id, churchId },
  })
}
