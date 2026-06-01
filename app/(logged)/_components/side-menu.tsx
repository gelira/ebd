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
            Pessoas
          </Link>
        </li>
        <li>
          <Link href="/congregations">
            Congregações
          </Link>
        </li>
      </ul>
    </div>
  )
}