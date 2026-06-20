import type { Person } from '@/app/_lib/generated/prisma/client'
import Link from 'next/link'

export default function PersonItem({ person }: { person: Person }) {
  const birthDate = (() => {
    if (!person.birthDate) {
      return 'Sem data de nascimento'
    }

    const [year, month, day] = new Date(person.birthDate).toISOString().split('T')[0].split('-')

    return `${day}/${month}/${year}`
  })()

  return (
    <p>
      <Link href={`/persons/${person.id}`}>{person.completeName}</Link> - <span>{birthDate}</span>  
    </p>
  )
}