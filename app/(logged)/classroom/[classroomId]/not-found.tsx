import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Classe não encontrada</h2>
      <Link href="/classroom">Retornar para a lista de classes</Link>
    </div>
  )
}