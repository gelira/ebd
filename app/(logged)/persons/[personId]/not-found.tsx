import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div>
      <h2>Pessoa não encontrada</h2>
      <Link href="/persons">Retornar para a lista de pessoas</Link>
    </div>
  )
}