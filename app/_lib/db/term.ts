import prisma from './prisma'

export async function getTerm({ id, churchId }: { id: number, churchId: number }) {
  return await prisma.term.findFirst({
    where: { id, churchId },
  })
}