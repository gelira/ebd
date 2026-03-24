import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div>
      <h2>Congregação não encontrada</h2>
      <Link href="/">Retornar para a página inicial</Link>
    </div>
  )
}