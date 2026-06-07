import Link from 'next/link'

export default function SideMenu() {
  return (
    <div className="mr-8">
      <ul>
        <li>
          <Link href="/">
            Home
          </Link>
        </li>
        <li>
          <Link href="/persons">
            Lista de pessoas
          </Link>
        </li>
        <li>
          <Link href="/persons/new">
            Cadastrar pessoa
          </Link>
        </li>
        <li>
          <Link href="/congregation">
            Congregações
          </Link>
        </li>
      </ul>
    </div>
  )
}