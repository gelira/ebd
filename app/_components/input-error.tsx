export default function InputError({ errorMessage }: { errorMessage: string }) {
  if (!errorMessage) {
    return null
  }

  return (
    <p className="mt-2 text-sm text-error">{errorMessage}</p>
  )
}