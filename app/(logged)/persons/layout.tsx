export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <h2>Pessoas cadastradas</h2>
      {children}
    </section>
  )
} 