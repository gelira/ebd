import db from '../db'

export async function getPersons({ churchId }: { churchId: number }) {
  return await db.person.findMany({
    where: { churchId },
  })
}
